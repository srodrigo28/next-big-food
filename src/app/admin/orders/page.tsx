import { OrderStatus } from "@prisma/client";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { cancelOrder, updateOrderStatus } from "@/app/admin/actions/orders";
import StatusBadge from "@/app/admin/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAYMENT_CONFIRMED: "Pago",
  PAYMENT_FAILED: "Pagamento falhou",
  IN_PREPARATION: "Em preparo",
  READY: "Pronto",
  DELIVERED: "Entregue",
  FINISHED: "Finalizado",
  CANCELLED: "Cancelado",
};

const DATE_LABELS: Record<string, string> = {
  today: "Hoje",
  week: "Esta semana",
  month: "Este mês",
  all: "Todos",
};

const getDateFilter = (period: string) => {
  const now = new Date();
  if (period === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { gte: start };
  }
  if (period === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return { gte: start };
  }
  if (period === "month") {
    const start = new Date(now);
    start.setDate(now.getDate() - 30);
    return { gte: start };
  }
  return undefined;
};

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    period?: string;
    q?: string;
    table?: string;
  }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { restaurant } = await requireAdminSession();
  const { status, period = "all", q, table } = await searchParams;

  const validStatus =
    status && Object.keys(STATUS_LABELS).includes(status)
      ? (status as OrderStatus)
      : undefined;

  const tables = await db.restaurantTable.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { name: "asc" },
  });

  const validTableId =
    table && tables.some((t) => t.id === table) ? table : undefined;

  const orders = await db.order.findMany({
    where: {
      restaurantId: restaurant.id,
      ...(validStatus ? { status: validStatus } : {}),
      ...(period !== "all" ? { createdAt: getDateFilter(period) } : {}),
      ...(q
        ? { customerName: { contains: q, mode: "insensitive" } }
        : {}),
      ...(validTableId ? { tableId: validTableId } : {}),
    },
    include: {
      table: true,
      orderProducts: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const buildUrl = (params: Record<string, string>) => {
    const base = new URLSearchParams({
      ...(status ? { status } : {}),
      ...(period !== "all" ? { period } : {}),
      ...(q ? { q } : {}),
      ...(validTableId ? { table: validTableId } : {}),
      ...params,
    });
    return `/admin/orders?${base.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} encontrado
          {orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Period */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(DATE_LABELS).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={period === value || (value === "all" && !period) ? "default" : "outline"}
              asChild
            >
              <Link href={buildUrl({ period: value })}>{label}</Link>
            </Button>
          ))}
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={!validStatus ? "secondary" : "outline"}
            asChild
          >
            <Link href={buildUrl({ status: "" })}>Todos os status</Link>
          </Button>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={validStatus === value ? "secondary" : "outline"}
              asChild
            >
              <Link href={buildUrl({ status: value })}>{label}</Link>
            </Button>
          ))}
        </div>

        {/* Table */}
        {tables.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={!validTableId ? "secondary" : "outline"}
              asChild
            >
              <Link href={buildUrl({ table: "" })}>Todas as mesas</Link>
            </Button>
            {tables.map((t) => (
              <Button
                key={t.id}
                size="sm"
                variant={validTableId === t.id ? "secondary" : "outline"}
                asChild
              >
                <Link href={buildUrl({ table: t.id })}>{t.name}</Link>
              </Button>
            ))}
          </div>
        )}

        {/* Search */}
        <form method="get" action="/admin/orders" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          {period && <input type="hidden" name="period" value={period} />}
          {validTableId && (
            <input type="hidden" name="table" value={validTableId} />
          )}
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por nome do cliente..."
            className="h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button size="sm" type="submit" variant="secondary">
            Buscar
          </Button>
        </form>
      </div>

      {/* Orders */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">
                    Pedido #{String(order.id).padStart(4, "0")}
                  </CardTitle>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.customerName ?? "Cliente não informado"}
                  {order.table ? ` · ${order.table.name}` : ""}
                </p>
              </div>
              <Button size="sm" variant="ghost" asChild className="shrink-0">
                <Link href={`/admin/orders/${order.id}`}>
                  <ExternalLinkIcon className="h-4 w-4" />
                  Detalhe
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-1.5 text-sm">
                {order.orderProducts.map((op) => (
                  <div
                    key={op.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span>
                      {op.quantity}x {op.product.name}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(op.price * op.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="font-semibold">{formatCurrency(order.total)}</p>
                <div className="flex flex-wrap gap-2">
                  <form
                    action={updateOrderStatus.bind(
                      null,
                      order.id,
                      OrderStatus.IN_PREPARATION,
                    )}
                  >
                    <Button size="sm" variant="secondary">
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
                    <Button size="sm" variant="secondary">
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
                    <Button size="sm" variant="secondary">
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
                    <Button size="sm">Finalizar</Button>
                  </form>
                  <form
                    action={cancelOrder.bind(null, order.id)}
                    className="flex items-center gap-2"
                  >
                    <input
                      name="reason"
                      placeholder="Motivo do cancelamento (opcional)"
                      className="h-8 w-48 rounded-md border border-input bg-background px-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <Button size="sm" variant="destructive">
                      Cancelar
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Nenhum pedido encontrado com os filtros aplicados.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
