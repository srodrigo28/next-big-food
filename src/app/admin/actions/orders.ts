"use server";

import { OrderStatus, TableStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
) => {
  const session = await requireAdminSession();
  const existingOrder = await db.order.findFirst({
    where: {
      id: orderId,
      restaurantId: session.restaurant.id,
    },
    select: {
      id: true,
    },
  });

  if (!existingOrder) {
    return;
  }

  const order = await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
    include: {
      table: true,
    },
  });

  if (order.tableId) {
    const nextTableStatus =
      status === "FINISHED" || status === "DELIVERED"
        ? TableStatus.WAITING_PAYMENT
        : TableStatus.IN_SERVICE;

    await db.restaurantTable.update({
      where: {
        id: order.tableId,
      },
      data: {
        status: nextTableStatus,
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/kitchen");
  revalidatePath("/admin/tables");
};

export const cancelOrder = async (orderId: number) => {
  await updateOrderStatus(orderId, OrderStatus.CANCELLED);
};
