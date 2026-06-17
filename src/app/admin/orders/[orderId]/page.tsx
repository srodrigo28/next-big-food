import {
  ArrowLeftIcon,
  ClipboardListIcon,
  CreditCardIcon,
  MapPinIcon,
  ShieldAlertIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateOrderStatus, cancelOrder } from "@/app/admin/actions/orders";
import StatusBadge from "@/app/admin/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ALLERGY_LABELS } from "@/constants/allergy";
import { formatCurrency } from "@/helpers/format-currency";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

const PAYMENT_STATUSES: OrderStatus[] = [
  OrderStatus.PAYMENT_CONFIRMED,
  OrderStatus.IN_PREPARATION,
  OrderStatus.READY,
  OrderStatus.DELIVERED,
  OrderStatus.FINISHED,
];

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const formatCpf = (cpf: string | null) => {
  if (!cpf) return "—";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const OrderDetailPage = async ({ params }: OrderDetailPageProps) => {
  const { orderId } = await params;
  const { restaurant } = await requireAdminSession();

  const order = await db.order.findFirst({
    where: {
      id: Number(orderId),
      restaurantId: restaurant.id,
    },
    include: {
      table: true,
      orderProducts: {
        include: {
          product: true,
          customization: {
            include: { removedIngredients: true, addons: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) return notFound();

  const isPaid = PAYMENT_STATUSES.includes(order.status);
  const hasAllergyAlert = order.orderProducts.some(
    (op) => op.customization?.hasAllergy,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">
              Pedido #{String(order.id).padStart(4, "0")}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {hasAllergyAlert && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          <ShieldAlertIcon className="h-4 w-4" />
          ATENÇÃO: pedido com alergia informada pelo cliente.
        </div>
      )}

      {order.status === OrderStatus.CANCELLED && order.cancellationReason && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <span className="font-semibold">Motivo do cancelamento:</span>{" "}
          {order.cancellationReason}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardListIcon className="h-4 w-4" />
                Itens do pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.orderProducts.map((op) => (
                <div key={op.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {op.quantity}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{op.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(op.price)} cada
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatCurrency(op.price * op.quantity)}
                    </span>
                  </div>

                  {op.customization && (
                    <div className="ml-9 mt-2 space-y-1 text-xs text-muted-foreground">
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
                          + {addon.nameSnapshot} x{addon.quantity} (
                          {formatCurrency(addon.total)})
                        </p>
                      ))}
                      {op.customization.observation && (
                        <p>Obs: {op.customization.observation}</p>
                      )}
                      {op.customization.hasAllergy && (
                        <div className="flex items-start gap-1 rounded-md bg-red-50 p-2 text-red-700">
                          <ShieldAlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <div>
                            <p className="font-semibold">Alergia informada</p>
                            {op.customization.allergyTypes.length > 0 && (
                              <p>
                                {op.customization.allergyTypes
                                  .map((type) => ALLERGY_LABELS[type])
                                  .join(", ")}
                              </p>
                            )}
                            {op.customization.allergyNotes && (
                              <p>{op.customization.allergyNotes}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <Separator />

              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Atualizar status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <form
                  action={updateOrderStatus.bind(
                    null,
                    order.id,
                    OrderStatus.IN_PREPARATION,
                  )}
                >
                  <Button size="sm" variant="secondary" type="submit">
                    Preparar
                  </Button>
                </form>
                <form
                  action={updateOrderStatus.bind(
                    null,
                    order.id,
                    OrderStatus.READY,
                  )}
                >
                  <Button size="sm" variant="secondary" type="submit">
                    Pronto
                  </Button>
                </form>
                <form
                  action={updateOrderStatus.bind(
                    null,
                    order.id,
                    OrderStatus.DELIVERED,
                  )}
                >
                  <Button size="sm" variant="secondary" type="submit">
                    Entregue
                  </Button>
                </form>
                <form
                  action={updateOrderStatus.bind(
                    null,
                    order.id,
                    OrderStatus.FINISHED,
                  )}
                >
                  <Button size="sm" type="submit">
                    Finalizar
                  </Button>
                </form>
                <form
                  action={cancelOrder.bind(null, order.id)}
                  className="flex items-center gap-2"
                >
                  <input
                    name="reason"
                    placeholder="Motivo do cancelamento (opcional)"
                    className="h-9 w-56 rounded-md border border-input bg-background px-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <Button size="sm" variant="destructive" type="submit">
                    Cancelar
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserIcon className="h-4 w-4" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="font-medium">
                  {order.customerName ?? "Não informado"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CPF</p>
                <p className="font-medium font-mono">
                  {formatCpf(order.customerCpf)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Consumo</p>
                <p className="font-medium">
                  {order.consumptionMethod === "DINE_IN"
                    ? "Comer no local"
                    : "Para levar"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          {order.table && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPinIcon className="h-4 w-4" />
                  Mesa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Nome</p>
                  <p className="font-medium">{order.table.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Código</p>
                  <p className="font-mono font-medium">{order.table.code}</p>
                </div>
                <StatusBadge status={order.table.status} />
              </CardContent>
            </Card>
          )}

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCardIcon className="h-4 w-4" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Método</p>
                <p className="font-medium">PIX (ASAAS)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p
                  className={`font-semibold ${isPaid ? "text-green-600" : "text-yellow-600"}`}
                >
                  {isPaid ? "Confirmado" : "Aguardando"}
                </p>
              </div>
              {order.asaasChargeId && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    ID da cobrança
                  </p>
                  <p className="break-all font-mono text-xs text-muted-foreground">
                    {order.asaasChargeId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
