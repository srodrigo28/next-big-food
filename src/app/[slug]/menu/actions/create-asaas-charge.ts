"use server";

import { db } from "@/lib/prisma";
import {
  createPixCharge,
  findOrCreateCustomer,
  getPixQrCode,
} from "@/lib/asaas";

export interface AsaasChargeResult {
  orderId: number;
  pixCode: string;
  pixQrCodeBase64: string;
  expirationDate: string;
}

export async function createAsaasCharge(
  orderId: number,
  customerName: string,
  customerCpf: string,
): Promise<AsaasChargeResult> {
  const order = await db.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { restaurant: { select: { name: true } } },
  });

  const customerId = await findOrCreateCustomer(customerName, customerCpf);

  const chargeId = await createPixCharge(
    customerId,
    order.total,
    orderId,
    order.restaurant.name,
  );

  await db.order.update({
    where: { id: orderId },
    data: { asaasChargeId: chargeId },
  });

  const qrCode = await getPixQrCode(chargeId);

  await db.order.update({
    where: { id: orderId },
    data: { pixExpiresAt: new Date(qrCode.expirationDate) },
  });

  return {
    orderId,
    pixCode: qrCode.payload,
    pixQrCodeBase64: qrCode.encodedImage,
    expirationDate: qrCode.expirationDate,
  };
}
