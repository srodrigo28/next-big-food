import { OrderStatus } from "@prisma/client";
import { ShieldAlertIcon } from "lucide-react";

import { updateOrderStatus } from "@/app/admin/actions/orders";
import StatusBadge from "@/app/admin/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALLERGY_LABELS } from "@/constants/allergy";
import { requireAdminSession } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { db } from "@/lib/prisma";

const LATE_THRESHOLD_MINUTES = 15;

const columns = [
  {
    title: "Novos",
    status: OrderStatus.PENDING,
    nextStatus: OrderStatus.IN_PREPARATION,
    actionLabel: "Iniciar preparo",
  },
  {
    title: "Em preparo",
    status: OrderStatus.IN_PREPARATION,
    nextStatus: OrderStatus.READY,
    actionLabel: "Marcar pronto",
  },
  {
    title: "Prontos",
    status: OrderStatus.READY,
    nextStatus: OrderStatus.DELIVERED,
    actionLabel: "Marcar entregue",
  },
  {
    title: "Entregues",
    status: OrderStatus.DELIVERED,
    nextStatus: OrderStatus.FINISHED,
    actionLabel: "Finalizar",
  },
];

const LATE_COLUMNS: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.IN_PREPARATION,
];

const KitchenPage = async () => {
  const { restaurant } = await requireAdminSession();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const orders = await db.order.findMany({
    where: {
      restaurantId: restaurant.id,
      OR: [
        {
          status: {
            in: [
              OrderStatus.PENDING,
              OrderStatus.IN_PREPARATION,
              OrderStatus.READY,
            ],
          },
        },
        {
          status: OrderStatus.DELIVERED,
          createdAt: { gte: startOfDay },
        },
      ],
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
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cozinha</h1>
        <p className="text-sm text-muted-foreground">
          Sequencia de preparo dos pedidos
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const columnOrders = orders.filter(
            (order) => order.status === column.status,
          );

          return (
            <section key={column.status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{column.title}</h2>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold">
                  {columnOrders.length}
                </span>
              </div>

              <div className="grid gap-3">
                {columnOrders.map((order) => {
                  const hasAllergyAlert = order.orderProducts.some(
                    (op) => op.customization?.hasAllergy,
                  );
                  const ageMinutes =
                    (Date.now() - order.createdAt.getTime()) / 60000;
                  const isLate =
                    LATE_COLUMNS.includes(column.status) &&
                    ageMinutes > LATE_THRESHOLD_MINUTES;
                  return (
                  <Card
                    key={order.id}
                    className={cn(isLate && "border-red-400 bg-red-50")}
                  >
                    <CardHeader className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base">
                          Pedido #{order.id}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {isLate && (
                            <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                              Atrasado
                            </span>
                          )}
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.table?.name ?? "Sem mesa vinculada"}
                      </p>
                      {hasAllergyAlert && (
                        <div className="flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                          <ShieldAlertIcon className="h-3.5 w-3.5" />
                          Pedido com alergia informada
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 pt-0">
                      <div className="space-y-2 text-sm">
                        {order.orderProducts.map((orderProduct) => (
                          <div key={orderProduct.id}>
                            <div>
                              <span className="font-semibold">
                                {orderProduct.quantity}x
                              </span>{" "}
                              {orderProduct.product.name}
                            </div>
                            {orderProduct.customization && (
                              <div className="ml-4 space-y-0.5 text-xs text-muted-foreground">
                                {orderProduct.customization.removedIngredients.length > 0 && (
                                  <p>
                                    Sem:{" "}
                                    {orderProduct.customization.removedIngredients
                                      .map((ingredient) => ingredient.nameSnapshot)
                                      .join(", ")}
                                  </p>
                                )}
                                {orderProduct.customization.addons.map((addon) => (
                                  <p key={addon.id}>
                                    + {addon.nameSnapshot} x{addon.quantity}
                                  </p>
                                ))}
                                {orderProduct.customization.observation && (
                                  <p>Obs: {orderProduct.customization.observation}</p>
                                )}
                                {orderProduct.customization.hasAllergy && (
                                  <p className="font-semibold text-red-600">
                                    ⚠ Alergia:{" "}
                                    {orderProduct.customization.allergyTypes
                                      .map((type) => ALLERGY_LABELS[type])
                                      .join(", ")}
                                    {orderProduct.customization.allergyNotes &&
                                      ` - ${orderProduct.customization.allergyNotes}`}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <form
                        action={updateOrderStatus.bind(
                          null,
                          order.id,
                          column.nextStatus,
                        )}
                      >
                        <Button className="w-full" size="sm">
                          {column.actionLabel}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                  );
                })}

                {columnOrders.length === 0 && (
                  <Card>
                    <CardContent className="p-4 text-sm text-muted-foreground">
                      Sem pedidos nesta etapa.
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default KitchenPage;
