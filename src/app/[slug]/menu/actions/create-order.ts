"use server";

import { ConsumptionMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { getRestaurantLookupSlugs } from "@/lib/restaurant-slug";

import { removeCpfPunctuation } from "../helpers/cpf";

interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
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

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });
  const productsWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productsWithPrices.find((p) => p.id === product.id)!.price,
  }));
  const order = await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerCpf: removeCpfPunctuation(input.customerCpf),
      orderProducts: {
        createMany: {
          data: productsWithPricesAndQuantities,
        },
      },
      total: productsWithPricesAndQuantities.reduce(
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
  // redirect(
  //   `/${input.slug}/orders?cpf=${removeCpfPunctuation(input.customerCpf)}`,
  // );
  return order;
};
