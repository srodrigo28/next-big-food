"use server";

import { OrderStatus, TableStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

const applyOrderStatus = async (
  orderId: number,
  status: OrderStatus,
  extraData: { cancellationReason?: string | null } = {},
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
      ...extraData,
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
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/kitchen");
  revalidatePath("/admin/tables");
};

export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
) => {
  await applyOrderStatus(orderId, status);
};

export const cancelOrder = async (orderId: number, formData: FormData) => {
  const reason = formData.get("reason");
  await applyOrderStatus(orderId, OrderStatus.CANCELLED, {
    cancellationReason:
      typeof reason === "string" && reason.trim() ? reason.trim() : null,
  });
};
