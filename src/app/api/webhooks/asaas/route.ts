import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

interface AsaasWebhookPayment {
  id: string;
  externalReference?: string;
  status: string;
}

interface AsaasWebhookBody {
  event: string;
  payment: AsaasWebhookPayment;
}

export async function POST(request: Request) {
  const token = request.headers.get("asaas-access-token");
  if (token !== process.env.WEBHOOK_ASAAS_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as AsaasWebhookBody;
  const { event, payment } = body;

  const confirmedEvents = [
    "PAYMENT_RECEIVED",
    "PAYMENT_CONFIRMED",
    "PAYMENT_APPROVED_BY_RISK_ANALYSIS",
  ];

  if (confirmedEvents.includes(event) && payment.externalReference) {
    const orderId = Number(payment.externalReference);
    if (!isNaN(orderId)) {
      const order = await db.order.update({
        where: { id: orderId },
        data: { status: "PAYMENT_CONFIRMED" },
        include: { restaurant: { select: { slug: true } } },
      });

      revalidatePath(`/${order.restaurant.slug}/orders`);
      revalidatePath("/admin/orders");
      revalidatePath("/admin/kitchen");
    }
  }

  if (event === "PAYMENT_REFUSED" || event === "PAYMENT_DELETED") {
    if (payment.externalReference) {
      const orderId = Number(payment.externalReference);
      if (!isNaN(orderId)) {
        await db.order.update({
          where: { id: orderId },
          data: { status: "PAYMENT_FAILED" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
