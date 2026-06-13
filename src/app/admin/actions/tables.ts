"use server";

import { TableStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";

const normalizeTableCode = (value: string) => {
  return value.trim().toUpperCase().replace(/\s+/g, "-");
};

export const createRestaurantTable = async (
  restaurantId: string,
  formData: FormData,
) => {
  const session = await requireAdminSession();

  if (session.restaurant.id !== restaurantId) {
    return;
  }

  const name = String(formData.get("name") ?? "").trim();
  const codeInput = String(formData.get("code") ?? "").trim();
  const seatsInput = String(formData.get("seats") ?? "").trim();

  if (!name) {
    return;
  }

  const code = normalizeTableCode(codeInput || name);
  const seats = seatsInput ? Number(seatsInput) : null;

  await db.restaurantTable.create({
    data: {
      name,
      code,
      seats: Number.isFinite(seats) ? seats : null,
      restaurantId,
    },
  });

  revalidatePath("/admin/tables");
  revalidatePath("/admin/dashboard");
};

export const updateRestaurantTableStatus = async (
  tableId: string,
  status: TableStatus,
) => {
  const session = await requireAdminSession();
  const table = await db.restaurantTable.findFirst({
    where: {
      id: tableId,
      restaurantId: session.restaurant.id,
    },
    select: {
      id: true,
    },
  });

  if (!table) {
    return;
  }

  await db.restaurantTable.update({
    where: {
      id: table.id,
    },
    data: {
      status,
    },
  });

  revalidatePath("/admin/tables");
  revalidatePath("/admin/dashboard");
};
