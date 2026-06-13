import { OrderStatus } from "@prisma/client";

import { updateOrderStatus } from "@/app/admin/actions/orders";
import StatusBadge from "@/app/admin/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";

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
];

const KitchenPage = async () => {
  const { restaurant } = await requireAdminSession();

  const orders = await db.order.findMany({
    where: {
      restaurantId: restaurant.id,
      status: {
        in: columns.map((column) => column.status),
      },
    },
    include: {
      table: true,
      orderProducts: {
        include: {
          product: true,
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

      <div className="grid gap-4 xl:grid-cols-3">
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
                {columnOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base">
                          Pedido #{order.id}
                        </CardTitle>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.table?.name ?? "Sem mesa vinculada"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 pt-0">
                      <div className="space-y-2 text-sm">
                        {order.orderProducts.map((orderProduct) => (
                          <div key={orderProduct.id}>
                            <span className="font-semibold">
                              {orderProduct.quantity}x
                            </span>{" "}
                            {orderProduct.product.name}
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
                ))}

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
