"use server";

import { redirect } from "next/navigation";

import { createAdminSession, destroyAdminSession } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/password";
import { db } from "@/lib/prisma";

export const signInAdmin = async (formData: FormData) => {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await db.user.findUnique({
    where: {
      email,
    },
    include: {
      restaurants: true,
    },
  });

  if (
    !user ||
    user.restaurants.length === 0 ||
    !verifyPassword(password, user.passwordHash)
  ) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession(user.id);
  redirect("/admin/dashboard");
};

export const signOutAdmin = async () => {
  await destroyAdminSession();
  redirect("/admin/login");
};
