import { OrderStatus } from "@prisma/client";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  ClockIcon,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { ALLERGY_LABELS } from "@/constants/allergy";
import { formatCurrency } from "@/helpers/format-currency";
import { db } from "@/lib/prisma";

import { OrderStatusRefresher } from "./components/order-status-refresher";

interface OrderStatusPageProps {
  params: Promise<{ slug: string; orderId: string }>;
}

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: OrderStatus.PENDING, label: "Aguardando pagamento" },
  { status: OrderStatus.PAYMENT_CONFIRMED, label: "Pagamento confirmado" },
  { status: OrderStatus.IN_PREPARATION, label: "Em preparo" },
  { status: OrderStatus.READY, label: "Pronto para retirada" },
  { status: OrderStatus.DELIVERED, label: "Entregue" },
];

const STEP_ORDER = STEPS.map((s) => s.status);

const getStepIndex = (status: OrderStatus) => {
  const idx = STEP_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Aguardando pagamento",
  PAYMENT_CONFIRMED: "Pago",
  PAYMENT_FAILED: "Pagamento recusado",
  IN_PREPARATION: "Em preparo",
  READY: "Pronto para retirada",
  DELIVERED: "Entregue",
  FINISHED: "Finalizado",
  CANCELLED: "Cancelado",
};

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const colors: Partial<Record<OrderStatus, string>> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAYMENT_CONFIRMED: "bg-green-100 text-green-800",
    PAYMENT_FAILED: "bg-red-100 text-red-800",
    IN_PREPARATION: "bg-blue-100 text-blue-800",
    READY: "bg-emerald-100 text-emerald-800",
    DELIVERED: "bg-slate-100 text-slate-700",
    FINISHED: "bg-gray-100 text-gray-600",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
};

const OrderStatusPage = async ({ params }: OrderStatusPageProps) => {
  const { slug, orderId } = await params;

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });
  if (!restaurant) return notFound();

  const order = await db.order.findFirst({
    where: {
      id: Number(orderId),
      restaurantId: restaurant.id,
    },
    include: {
      table: { select: { name: true, code: true } },
      orderProducts: {
        include: {
          product: { select: { name: true } },
          customization: {
            include: { removedIngredients: true, addons: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) return notFound();

  const isCancelled = order.status === OrderStatus.CANCELLED;
  const isFinished =
    order.status === OrderStatus.FINISHED ||
    order.status === OrderStatus.DELIVERED;
  const currentStepIdx = getStepIndex(order.status);
  const isPixExpired =
    order.status === OrderStatus.PENDING &&
    order.pixExpiresAt !== null &&
    new Date() > order.pixExpiresAt;

  return (
    <div className="min-h-screen bg-gray-50">
      <OrderStatusRefresher />

      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/${slug}/orders`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <p className="text-xs text-gray-500">{restaurant.name}</p>
            <h1 className="text-base font-semibold">
              Pedido #{String(order.id).padStart(4, "0")}
            </h1>
          </div>
          <div className="ml-auto">
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* PIX expiration */}
        {order.status === OrderStatus.PENDING && order.pixExpiresAt && (
          <div
            className={`rounded-2xl p-4 shadow-sm ${
              isPixExpired ? "bg-red-50" : "bg-white"
            }`}
          >
            {isPixExpired ? (
              <p className="text-sm font-semibold text-red-700">
                QR Code PIX expirado. Entre em contato com o estabelecimento
                para gerar um novo pagamento.
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                QR Code PIX válido até{" "}
                <span className="font-semibold">
                  {order.pixExpiresAt.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Progress steps */}
        {!isCancelled && !isFinished && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Acompanhe seu pedido
            </p>
            <div className="space-y-4">
              {STEPS.map((step, idx) => {
                const isDone = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.status} className="flex items-center gap-3">
                    <div className="flex w-5 shrink-0 items-center justify-center">
                      {isDone ? (
                        <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                      ) : isCurrent ? (
                        <ClockIcon className="h-5 w-5 text-[var(--brand-primary)]" />
                      ) : (
                        <CircleDashedIcon className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isDone
                          ? "text-green-600 line-through"
                          : isCurrent
                            ? "font-semibold text-gray-900"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isFinished && (
          <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-5 shadow-sm">
            <CheckCircle2Icon className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-800">Pedido concluído!</p>
              <p className="text-sm text-green-600">Obrigado pela preferência.</p>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="rounded-2xl bg-red-50 p-5 shadow-sm">
            <p className="font-semibold text-red-700">Pedido cancelado</p>
            <p className="mt-1 text-sm text-red-500">
              Entre em contato com o estabelecimento se precisar de ajuda.
            </p>
          </div>
        )}

        {/* Table info */}
        {order.table && (
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-700">
              Mesa:{" "}
              <span className="font-semibold">{order.table.name}</span>
            </p>
          </div>
        )}

        {/* Items */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Itens do pedido
          </p>
          <div className="space-y-2.5">
            {order.orderProducts.map((op) => (
              <div key={op.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {op.quantity}
                    </span>
                    <p className="text-sm text-gray-800">{op.product.name}</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-gray-700">
                    {formatCurrency(op.price * op.quantity)}
                  </p>
                </div>

                {op.customization && (
                  <div className="ml-7 mt-1 space-y-0.5 text-xs text-gray-500">
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
                    {op.customization.observation && (
                      <p>Obs: {op.customization.observation}</p>
                    )}
                    {op.customization.hasAllergy && (
                      <p className="font-medium text-orange-600">
                        ⚠ Alergia:{" "}
                        {op.customization.allergyTypes
                          .map((type) => ALLERGY_LABELS[type])
                          .join(", ")}
                        {op.customization.allergyNotes &&
                          ` - ${op.customization.allergyNotes}`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Total</p>
            <p className="font-bold text-gray-900">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        {/* Back to orders */}
        <Link
          href={`/${slug}/orders`}
          className="block w-full rounded-full border border-gray-200 bg-white py-3 text-center text-sm font-medium text-gray-700 shadow-sm"
        >
          Ver todos os pedidos
        </Link>
      </div>
    </div>
  );
};

export default OrderStatusPage;
