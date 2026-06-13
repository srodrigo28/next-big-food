"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";

const revalidateAdminCatalog = () => {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
};

export const createCategory = async (formData: FormData) => {
  const { restaurant } = await requireAdminSession();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return;
  }

  await db.menuCategory.create({
    data: {
      name,
      restaurantId: restaurant.id,
    },
  });

  revalidateAdminCatalog();
};

export const updateCategory = async (formData: FormData) => {
  const { restaurant } = await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!id || !name) {
    return;
  }

  const category = await db.menuCategory.findFirst({
    where: {
      id,
      restaurantId: restaurant.id,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    return;
  }

  await db.menuCategory.update({
    where: {
      id: category.id,
    },
    data: {
      name,
    },
  });

  revalidateAdminCatalog();
};
