"use client";

import { OrderStatus, Prisma } from "@prisma/client";
import { CheckCircle2Icon, HomeIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";

interface OrderListProps {
  orders: Array<
    Prisma.OrderGetPayload<{
      include: {
        restaurant: {
          select: {
            name: true;
            avatarImageUrl: true;
          };
        };
        orderProducts: {
          include: {
            product: true;
            customization: {
              include: {
                removedIngredients: true;
                addons: true;
              };
            };
          };
        };
      };
    }>
  >;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Aguardando pagamento",
    className: "bg-yellow-100 text-yellow-800",
  },
  PAYMENT_CONFIRMED: {
    label: "Pago",
    className: "bg-green-100 text-green-800",
  },
  PAYMENT_FAILED: {
    label: "Pagamento recusado",
    className: "bg-red-100 text-red-800",
  },
  IN_PREPARATION: {
    label: "Em preparo",
    className: "bg-blue-100 text-blue-800",
  },
  READY: {
    label: "Pronto para retirada",
    className: "bg-emerald-100 text-emerald-800",
  },
  DELIVERED: {
    label: "Entregue",
    className: "bg-slate-100 text-slate-700",
  },
  FINISHED: {
    label: "Finalizado",
    className: "bg-gray-100 text-gray-600",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800",
  },
};

const PAID_STATUSES: OrderStatus[] = [
  OrderStatus.PAYMENT_CONFIRMED,
  OrderStatus.IN_PREPARATION,
  OrderStatus.READY,
  OrderStatus.DELIVERED,
  OrderStatus.FINISHED,
];

const isPaid = (status: OrderStatus) => PAID_STATUSES.includes(status);

const OrderList = ({ orders }: OrderListProps) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  return (
    <div className="space-y-6 p-6">
      <Button
        size="icon"
        variant="secondary"
        className="rounded-full bg-white"
        onClick={() => router.push(`/${slug}`)}
      >
        <HomeIcon />
      </Button>

      <div className="flex items-center gap-3">
        <ScrollTextIcon />
        <h2 className="text-lg font-semibold">Meus Pedidos</h2>
      </div>

      {orders.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum pedido encontrado.</p>
      )}

      {orders.map((order) => {
        const config = statusConfig[order.status];
        return (
          <Card key={order.id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/${slug}/order/${order.id}`}
                  className="text-sm font-bold text-gray-700 hover:underline"
                >
                  Pedido #{String(order.id).padStart(4, "0")}
                </Link>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
                >
                  {config.label}
                </span>
              </div>

              {isPaid(order.status) && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                  <CheckCircle2Icon className="h-3.5 w-3.5" />
                  Pagamento confirmado
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative h-5 w-5">
                  <Image
                    src={order.restaurant.avatarImageUrl}
                    alt={order.restaurant.name}
                    className="rounded-sm object-cover"
                    fill
                  />
                </div>
                <p className="text-sm font-semibold">{order.restaurant.name}</p>
              </div>

              <Separator />

              <div className="space-y-1.5">
                {order.orderProducts.map((op) => (
                  <div key={op.id}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
                        {op.quantity}
                      </div>
                      <p className="text-sm">{op.product.name}</p>
                    </div>
                    {op.customization && (
                      <div className="ml-7 space-y-0.5 text-xs text-gray-500">
                        {op.customization.removedIngredients.length > 0 && (
                          <p>
                            Sem:{" "}
                            {op.customization.removedIngredients
                              .map((ingredient) => ingredient.nameSnapshot)
                              .join(", ")}
                          </p>
                        )}
                        {op.customization.addons.map((addon) => (
                          <p key={addon.id}>
                            + {addon.nameSnapshot} x{addon.quantity}
                          </p>
                        ))}
                        {op.customization.hasAllergy && (
                          <p className="font-medium text-orange-600">
                            ⚠ Alergia informada
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrderList;
