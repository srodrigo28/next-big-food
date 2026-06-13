"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";

const parseIngredients = (value: FormDataEntryValue | null) => {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
};

const parsePrice = (value: FormDataEntryValue | null) => {
  const normalizedValue = String(value ?? "")
    .replace(/\./g, "")
    .replace(",", ".");
  const price = Number(normalizedValue);
  return Number.isFinite(price) ? price : null;
};

const revalidateCatalog = (slug?: string) => {
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  if (slug) {
    revalidatePath(`/${slug}/menu`);
  }
};

const getCategoryFromCurrentRestaurant = async (
  categoryId: string,
  restaurantId: string,
) => {
  return db.menuCategory.findFirst({
    where: {
      id: categoryId,
      restaurantId,
    },
    select: {
      id: true,
    },
  });
};

export const createProduct = async (formData: FormData) => {
  const { restaurant } = await requireAdminSession();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const menuCategoryId = String(formData.get("menuCategoryId") ?? "");
  const price = parsePrice(formData.get("price"));
  const ingredients = parseIngredients(formData.get("ingredients"));

  if (!name || !description || !imageUrl || !menuCategoryId || price === null) {
    return;
  }

  const category = await getCategoryFromCurrentRestaurant(
    menuCategoryId,
    restaurant.id,
  );

  if (!category) {
    return;
  }

  await db.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
      ingredients,
      restaurantId: restaurant.id,
      menuCategoryId: category.id,
    },
  });

  revalidateCatalog(restaurant.slug);
};

export const updateProduct = async (formData: FormData) => {
  const { restaurant } = await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const menuCategoryId = String(formData.get("menuCategoryId") ?? "");
  const price = parsePrice(formData.get("price"));
  const ingredients = parseIngredients(formData.get("ingredients"));

  if (!id || !name || !description || !imageUrl || !menuCategoryId || price === null) {
    return;
  }

  const [product, category] = await Promise.all([
    db.product.findFirst({
      where: {
        id,
        restaurantId: restaurant.id,
      },
      select: {
        id: true,
      },
    }),
    getCategoryFromCurrentRestaurant(menuCategoryId, restaurant.id),
  ]);

  if (!product || !category) {
    return;
  }

  await db.product.update({
    where: {
      id: product.id,
    },
    data: {
      name,
      description,
      imageUrl,
      price,
      ingredients,
      menuCategoryId: category.id,
    },
  });

  revalidateCatalog(restaurant.slug);
};

export const toggleProductAvailability = async (productId: string) => {
  const { restaurant } = await requireAdminSession();
  const product = await db.product.findFirst({
    where: {
      id: productId,
      restaurantId: restaurant.id,
    },
    select: {
      id: true,
      isAvailable: true,
    },
  });

  if (!product) {
    return;
  }

  await db.product.update({
    where: {
      id: product.id,
    },
    data: {
      isAvailable: !product.isAvailable,
    },
  });

  revalidateCatalog(restaurant.slug);
};
