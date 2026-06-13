import { OrderStatus } from "@prisma/client";

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

const OrdersPage = async () => {
  const { restaurant } = await requireAdminSession();

  const orders = await db.order.findMany({
    where: {
      restaurantId: restaurant.id,
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
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Ultimos 50 pedidos do estabelecimento
        </p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">Pedido #{order.id}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.customerName ?? "Cliente nao informado"}
                  {order.table ? ` - ${order.table.name}` : ""}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                {order.orderProducts.map((orderProduct) => (
                  <div
                    key={orderProduct.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span>
                      {orderProduct.quantity}x {orderProduct.product.name}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        orderProduct.price * orderProduct.quantity,
                      )}
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
                  <form action={cancelOrder.bind(null, order.id)}>
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
              Nenhum pedido encontrado ainda.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
