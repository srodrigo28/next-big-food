import { createHash, randomBytes } from "crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

export const ADMIN_SESSION_COOKIE = "next_big_food_admin_session";
const SESSION_DURATION_DAYS = 7;

const hashToken = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};

export const createAdminSession = async (userId: string) => {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await db.adminSession.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
};

export const destroyAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    await db.adminSession.deleteMany({
      where: {
        tokenHash: hashToken(token),
      },
    });
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
};

export const getAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await db.adminSession.findUnique({
    where: {
      tokenHash: hashToken(token),
    },
    include: {
      user: {
        include: {
          restaurants: {
            include: {
              restaurant: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db.adminSession.delete({
        where: {
          id: session.id,
        },
      });
    }
    return null;
  }

  const restaurantUser = session.user.restaurants[0];

  if (!restaurantUser) {
    return null;
  }

  return {
    user: session.user,
    restaurant: restaurantUser.restaurant,
    role: restaurantUser.role,
  };
};

export const requireAdminSession = async () => {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
};
