import { createCategory, updateCategory } from "@/app/admin/actions/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";

const CategoriesPage = async () => {
  const { restaurant } = await requireAdminSession();
  const categories = await db.menuCategory.findMany({
    where: {
      restaurantId: restaurant.id,
    },
    include: {
      _count: {
        select: {
          products: true,
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
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <p className="text-sm text-muted-foreground">
          Organize o cardapio publico do estabelecimento
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nova categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" placeholder="Bebidas" required />
            </div>
            <div className="flex items-end">
              <Button className="w-full">Cadastrar</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-base">{category.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {category._count.products} produtos
              </p>
            </CardHeader>
            <CardContent>
              <form action={updateCategory} className="space-y-3">
                <input type="hidden" name="id" value={category.id} />
                <div className="space-y-2">
                  <Label htmlFor={`category-${category.id}`}>Editar nome</Label>
                  <Input
                    id={`category-${category.id}`}
                    name="name"
                    defaultValue={category.name}
                    required
                  />
                </div>
                <Button size="sm" variant="secondary">
                  Salvar
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Nenhuma categoria cadastrada ainda.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
