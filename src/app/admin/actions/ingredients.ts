"use server";

import { AllergyType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";

export const createIngredient = async (formData: FormData) => {
  const { restaurant } = await requireAdminSession();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const isAllergen = formData.get("isAllergen") === "on";
  const allergenType = isAllergen
    ? (String(formData.get("allergenType") ?? "") as AllergyType) || null
    : null;

  if (!name) return;

  await db.ingredient.create({
    data: {
      name,
      description,
      isAllergen,
      allergenType,
      restaurantId: restaurant.id,
    },
  });

  revalidatePath("/admin/ingredients");
};

export const toggleIngredientActive = async (id: string) => {
  const { restaurant } = await requireAdminSession();
  const ingredient = await db.ingredient.findFirst({
    where: { id, restaurantId: restaurant.id },
    select: { id: true, isActive: true },
  });
  if (!ingredient) return;
  await db.ingredient.update({
    where: { id },
    data: { isActive: !ingredient.isActive },
  });
  revalidatePath("/admin/ingredients");
};

export const addProductIngredient = async (formData: FormData) => {
  const { restaurant } = await requireAdminSession();
  const productId = String(formData.get("productId") ?? "");
  const ingredientId = String(formData.get("ingredientId") ?? "");
  const canRemove = formData.get("canRemove") === "on";

  const product = await db.product.findFirst({
    where: { id: productId, restaurantId: restaurant.id },
    select: { id: true },
  });
  if (!product) return;

  await db.productIngredient.upsert({
    where: { productId_ingredientId: { productId, ingredientId } },
    create: { productId, ingredientId, canRemove },
    update: { canRemove },
  });

  revalidatePath(`/admin/products/${productId}/customization`);
};

export const removeProductIngredient = async (
  productIngredientId: string,
  productId: string,
) => {
  const { restaurant } = await requireAdminSession();
  const record = await db.productIngredient.findFirst({
    where: {
      id: productIngredientId,
      product: { restaurantId: restaurant.id },
    },
    select: { id: true },
  });
  if (!record) return;
  await db.productIngredient.delete({ where: { id: productIngredientId } });
  revalidatePath(`/admin/products/${productId}/customization`);
};

export const createProductAddon = async (formData: FormData) => {
  const { restaurant } = await requireAdminSession();
  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceRaw = String(formData.get("price") ?? "").replace(",", ".");
  const price = parseFloat(priceRaw);
  const maxQuantity = parseInt(String(formData.get("maxQuantity") ?? "1"), 10);

  if (!name || isNaN(price)) return;

  const product = await db.product.findFirst({
    where: { id: productId, restaurantId: restaurant.id },
    select: { id: true },
  });
  if (!product) return;

  await db.productAddon.create({
    data: { productId, name, description, price, maxQuantity },
  });

  revalidatePath(`/admin/products/${productId}/customization`);
};

export const removeProductAddon = async (
  addonId: string,
  productId: string,
) => {
  const { restaurant } = await requireAdminSession();
  const addon = await db.productAddon.findFirst({
    where: { id: addonId, product: { restaurantId: restaurant.id } },
    select: { id: true },
  });
  if (!addon) return;
  await db.productAddon.delete({ where: { id: addonId } });
  revalidatePath(`/admin/products/${productId}/customization`);
};

export const toggleProductAddonActive = async (
  addonId: string,
  productId: string,
) => {
  const { restaurant } = await requireAdminSession();
  const addon = await db.productAddon.findFirst({
    where: { id: addonId, product: { restaurantId: restaurant.id } },
    select: { id: true, isActive: true },
  });
  if (!addon) return;
  await db.productAddon.update({
    where: { id: addonId },
    data: { isActive: !addon.isActive },
  });
  revalidatePath(`/admin/products/${productId}/customization`);
};
