import {
  createProduct,
  toggleProductAvailability,
  updateProduct,
} from "@/app/admin/actions/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/helpers/format-currency";
import { requireAdminSession } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { db } from "@/lib/prisma";

const ProductsPage = async () => {
  const { restaurant } = await requireAdminSession();
  const [categories, products] = await Promise.all([
    db.menuCategory.findMany({
      where: {
        restaurantId: restaurant.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    db.product.findMany({
      where: {
        restaurantId: restaurant.id,
      },
      include: {
        menuCategory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre e edite os itens exibidos no cardapio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProduct} className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" placeholder="Combo especial" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preco</Label>
              <Input
                id="price"
                name="price"
                inputMode="decimal"
                placeholder="39,90"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="menuCategoryId">Categoria</Label>
              <select
                id="menuCategoryId"
                name="menuCategoryId"
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Imagem URL</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="https://..." required />
            </div>
            <div className="space-y-2 xl:col-span-2">
              <Label htmlFor="description">Descricao</Label>
              <textarea
                id="description"
                name="description"
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Descreva o produto"
                required
              />
            </div>
            <div className="space-y-2 xl:col-span-2">
              <Label htmlFor="ingredients">Ingredientes</Label>
              <textarea
                id="ingredients"
                name="ingredients"
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Um ingrediente por linha"
              />
            </div>
            <div className="xl:col-span-2">
              <Button disabled={categories.length === 0}>Cadastrar produto</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className={cn(!product.isAvailable && "opacity-70")}>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">{product.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.menuCategory.name} - {formatCurrency(product.price)}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  product.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                )}
              >
                {product.isAvailable ? "Disponivel" : "Indisponivel"}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={updateProduct} className="grid gap-4 xl:grid-cols-2">
                <input type="hidden" name="id" value={product.id} />
                <div className="space-y-2">
                  <Label htmlFor={`name-${product.id}`}>Nome</Label>
                  <Input
                    id={`name-${product.id}`}
                    name="name"
                    defaultValue={product.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`price-${product.id}`}>Preco</Label>
                  <Input
                    id={`price-${product.id}`}
                    name="price"
                    inputMode="decimal"
                    defaultValue={String(product.price).replace(".", ",")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`category-${product.id}`}>Categoria</Label>
                  <select
                    id={`category-${product.id}`}
                    name="menuCategoryId"
                    defaultValue={product.menuCategoryId}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`image-${product.id}`}>Imagem URL</Label>
                  <Input
                    id={`image-${product.id}`}
                    name="imageUrl"
                    defaultValue={product.imageUrl}
                    required
                  />
                </div>
                <div className="space-y-2 xl:col-span-2">
                  <Label htmlFor={`description-${product.id}`}>Descricao</Label>
                  <textarea
                    id={`description-${product.id}`}
                    name="description"
                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={product.description}
                    required
                  />
                </div>
                <div className="space-y-2 xl:col-span-2">
                  <Label htmlFor={`ingredients-${product.id}`}>Ingredientes</Label>
                  <textarea
                    id={`ingredients-${product.id}`}
                    name="ingredients"
                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={product.ingredients.join("\n")}
                  />
                </div>
                <div className="flex flex-wrap gap-2 xl:col-span-2">
                  <Button size="sm" variant="secondary">
                    Salvar alteracoes
                  </Button>
                </div>
              </form>

              <form action={toggleProductAvailability.bind(null, product.id)}>
                <Button size="sm" variant={product.isAvailable ? "outline" : "default"}>
                  {product.isAvailable ? "Marcar indisponivel" : "Marcar disponivel"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}

        {products.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
