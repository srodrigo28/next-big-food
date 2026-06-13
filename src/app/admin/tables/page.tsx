import { TableStatus } from "@prisma/client";

import {
  createRestaurantTable,
  updateRestaurantTableStatus,
} from "@/app/admin/actions/tables";
import StatusBadge from "@/app/admin/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { getPublicRestaurantSlug } from "@/lib/restaurant-slug";

const tableActions = [
  {
    label: "Liberar",
    status: TableStatus.AVAILABLE,
  },
  {
    label: "Ocupar",
    status: TableStatus.OCCUPIED,
  },
  {
    label: "Atendimento",
    status: TableStatus.IN_SERVICE,
  },
  {
    label: "Pagamento",
    status: TableStatus.WAITING_PAYMENT,
  },
];

const TablesPage = async () => {
  const { restaurant } = await requireAdminSession();
  const publicSlug = getPublicRestaurantSlug();

  const tables = await db.restaurantTable.findMany({
    where: {
      restaurantId: restaurant.id,
    },
    include: {
      orders: {
        where: {
          status: {
            notIn: ["FINISHED", "CANCELLED"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      code: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mesas</h1>
        <p className="text-sm text-muted-foreground">
          Cadastro e liberacao operacional das mesas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nova mesa</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createRestaurantTable.bind(null, restaurant.id)}
            className="grid gap-4 md:grid-cols-[1fr_140px_120px_auto]"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" placeholder="Mesa 01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Codigo</Label>
              <Input id="code" name="code" placeholder="MESA-01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seats">Lugares</Label>
              <Input id="seats" name="seats" type="number" min="1" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">Cadastrar</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">{table.name}</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Codigo {table.code}
                  {table.seats ? ` - ${table.seats} lugares` : ""}
                </p>
              </div>
              <StatusBadge status={table.status} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-secondary p-3 text-sm">
                <p className="text-muted-foreground">Pedidos abertos</p>
                <p className="mt-1 text-xl font-semibold">
                  {table.orders.length}
                </p>
              </div>

              <div className="rounded-md border p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Link do QR</p>
                <p className="mt-1 break-all">
                  /{publicSlug}/table/{table.code}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {tableActions.map((action) => (
                  <form
                    key={action.status}
                    action={updateRestaurantTableStatus.bind(
                      null,
                      table.id,
                      action.status,
                    )}
                  >
                    <Button size="sm" variant="secondary">
                      {action.label}
                    </Button>
                  </form>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {tables.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Nenhuma mesa cadastrada ainda.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TablesPage;
