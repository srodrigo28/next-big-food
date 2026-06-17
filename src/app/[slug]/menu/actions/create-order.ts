"use server";

import { AllergyType, ConsumptionMethod, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { getRestaurantLookupSlugs } from "@/lib/restaurant-slug";

import { removeCpfPunctuation } from "../helpers/cpf";

interface CreateOrderInputAddon {
  addonId: string;
  quantity: number;
}

interface CreateOrderInputCustomization {
  removedIngredientIds: string[];
  addons: CreateOrderInputAddon[];
  observation: string;
  hasAllergy: boolean;
  allergyTypes: AllergyType[];
  allergyNotes: string;
}

interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
    customization?: CreateOrderInputCustomization;
  }>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
  tableCode?: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await db.restaurant.findFirst({
    where: {
      slug: {
        in: getRestaurantLookupSlugs(input.slug),
      },
    },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const normalizedTableCode = input.tableCode?.trim().toUpperCase();
  const table = normalizedTableCode
    ? await db.restaurantTable.findUnique({
        where: {
          restaurantId_code: {
            restaurantId: restaurant.id,
            code: normalizedTableCode,
          },
        },
      })
    : null;

  if (normalizedTableCode && !table) {
    throw new Error("Table not found");
  }

  const productsWithDetails = await db.product.findMany({
    where: {
      id: { in: input.products.map((product) => product.id) },
      restaurantId: restaurant.id,
    },
    include: {
      productAddons: true,
      productIngredients: { include: { ingredient: true } },
    },
  });

  const orderProductsData = input.products.map((inputProduct) => {
    const product = productsWithDetails.find((p) => p.id === inputProduct.id);
    if (!product) {
      throw new Error("Product not found");
    }

    const customization = inputProduct.customization;

    const selectedAddons = (customization?.addons ?? []).flatMap((inputAddon) => {
      const productAddon = product.productAddons.find(
        (addon) => addon.id === inputAddon.addonId && addon.isActive,
      );
      if (!productAddon) return [];
      const quantity = Math.min(
        Math.max(inputAddon.quantity, 0),
        productAddon.maxQuantity,
      );
      if (quantity <= 0) return [];
      return [
        {
          productAddonId: productAddon.id,
          nameSnapshot: productAddon.name,
          unitPriceSnapshot: productAddon.price,
          quantity,
          total: productAddon.price * quantity,
        },
      ];
    });

    const removedIngredients = (customization?.removedIngredientIds ?? []).flatMap(
      (ingredientId) => {
        const productIngredient = product.productIngredients.find(
          (pi) => pi.ingredientId === ingredientId && pi.canRemove,
        );
        if (!productIngredient) return [];
        return [
          {
            ingredientId: productIngredient.ingredientId,
            nameSnapshot: productIngredient.ingredient.name,
          },
        ];
      },
    );

    const addonsTotal = selectedAddons.reduce((acc, addon) => acc + addon.total, 0);
    const price = product.price + addonsTotal;

    const hasCustomization =
      removedIngredients.length > 0 ||
      selectedAddons.length > 0 ||
      Boolean(customization?.observation) ||
      Boolean(customization?.hasAllergy);

    const customizationCreate: Prisma.OrderProductCreateWithoutOrderInput["customization"] =
      hasCustomization
        ? {
            create: {
              observation: customization?.observation || null,
              hasAllergy: customization?.hasAllergy ?? false,
              allergyNotes: customization?.allergyNotes || null,
              allergyTypes: customization?.allergyTypes ?? [],
              removedIngredients: { create: removedIngredients },
              addons: { create: selectedAddons },
            },
          }
        : undefined;

    return {
      productId: product.id,
      quantity: inputProduct.quantity,
      price,
      customization: customizationCreate,
    };
  });

  const order = await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerCpf: removeCpfPunctuation(input.customerCpf),
      orderProducts: {
        create: orderProductsData,
      },
      total: orderProductsData.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
      tableId: table?.id,
    },
  });

  if (table) {
    await db.restaurantTable.update({
      where: {
        id: table.id,
      },
      data: {
        status: "WAITING_ORDER",
      },
    });
  }

  revalidatePath(`/${input.slug}/orders`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/kitchen");
  revalidatePath("/admin/tables");
  return order;
};
