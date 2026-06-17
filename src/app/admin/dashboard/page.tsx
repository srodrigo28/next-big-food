import {
  CircleDollarSignIcon,
  ClipboardListIcon,
  CookingPotIcon,
  ReceiptIcon,
  Table2Icon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { formatCurrency } from "@/helpers/format-currency";
import { requireAdminSession } from "@/lib/admin-auth";

const getStartOfDay = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const DashboardPage = async () => {
  const { restaurant } = await requireAdminSession();

  const startOfDay = getStartOfDay();
  const [
    ordersToday,
    ordersInPreparation,
    readyOrders,
    occupiedTables,
    topProductsGrouped,
  ] = await Promise.all([
    db.order.findMany({
      where: {
        restaurantId: restaurant.id,
        createdAt: {
          gte: startOfDay,
        },
      },
    }),
    db.order.count({
      where: {
        restaurantId: restaurant.id,
        status: "IN_PREPARATION",
      },
    }),
    db.order.count({
      where: {
        restaurantId: restaurant.id,
        status: "READY",
      },
    }),
    db.restaurantTable.count({
      where: {
        restaurantId: restaurant.id,
        status: {
          not: "AVAILABLE",
        },
      },
    }),
    db.orderProduct.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: {
        order: {
          restaurantId: restaurant.id,
          status: { notIn: ["CANCELLED", "PAYMENT_FAILED"] },
        },
      },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const validOrdersToday = ordersToday.filter(
    (order) => !["CANCELLED", "PAYMENT_FAILED"].includes(order.status),
  );
  const revenueToday = validOrdersToday.reduce(
    (total, order) => total + order.total,
    0,
  );
  const averageTicket =
    validOrdersToday.length > 0
      ? revenueToday / validOrdersToday.length
      : 0;

  const topProductIds = topProductsGrouped.map((item) => item.productId);
  const topProductsInfo = await db.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true },
  });
  const topProducts = topProductsGrouped.map((item) => ({
    name:
      topProductsInfo.find((product) => product.id === item.productId)
        ?.name ?? "Produto removido",
    quantity: item._sum.quantity ?? 0,
  }));

  const metrics = [
    {
      label: "Pedidos hoje",
      value: ordersToday.length,
      icon: ClipboardListIcon,
    },
    {
      label: "Faturamento hoje",
      value: formatCurrency(revenueToday),
      icon: CircleDollarSignIcon,
    },
    {
      label: "Ticket médio",
      value: formatCurrency(averageTicket),
      icon: ReceiptIcon,
    },
    {
      label: "Em preparo",
      value: ordersInPreparation,
      icon: CookingPotIcon,
    },
    {
      label: "Mesas ocupadas",
      value: occupiedTables,
      icon: Table2Icon,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{restaurant.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fila operacional</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground">Pedidos pendentes</p>
            <p className="mt-2 text-xl font-semibold">
              {
                ordersToday.filter((order) => order.status === "PENDING")
                  .length
              }
            </p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground">Prontos para entrega</p>
            <p className="mt-2 text-xl font-semibold">{readyOrders}</p>
          </div>
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground">Cancelados hoje</p>
            <p className="mt-2 text-xl font-semibold">
              {
                ordersToday.filter((order) => order.status === "CANCELLED")
                  .length
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Produtos mais vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length > 0 ? (
            <ol className="space-y-2 text-sm">
              {topProducts.map((product, index) => (
                <li
                  key={product.name + index}
                  className="flex items-center justify-between"
                >
                  <span>
                    {index + 1}. {product.name}
                  </span>
                  <span className="font-semibold">
                    {product.quantity} vendido{product.quantity !== 1 ? "s" : ""}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma venda registrada ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
