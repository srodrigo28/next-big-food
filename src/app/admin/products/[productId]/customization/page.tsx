import { ArrowLeftIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  addProductIngredient,
  createProductAddon,
  removeProductAddon,
  removeProductIngredient,
  toggleProductAddonActive,
} from "@/app/admin/actions/ingredients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ALLERGY_LABELS } from "@/constants/allergy";
import { formatCurrency } from "@/helpers/format-currency";
import { requireAdminSession } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { db } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ productId: string }>;
}

const ProductCustomizationPage = async ({ params }: PageProps) => {
  const { productId } = await params;
  const { restaurant } = await requireAdminSession();

  const [product, allIngredients] = await Promise.all([
    db.product.findFirst({
      where: { id: productId, restaurantId: restaurant.id },
      include: {
        productIngredients: {
          include: { ingredient: true },
          orderBy: { ingredient: { name: "asc" } },
        },
        productAddons: {
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    db.ingredient.findMany({
      where: { restaurantId: restaurant.id, isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) return notFound();

  const configuredIngredientIds = new Set(
    product.productIngredients.map((pi) => pi.ingredientId),
  );
  const availableToAdd = allIngredients.filter(
    (i) => !configuredIngredientIds.has(i.id),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Personalização</h1>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </div>
      </div>

      {/* Ingredients section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Ingredientes do produto
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Defina os ingredientes base e quais o cliente pode remover
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {product.productIngredients.length > 0 && (
            <div className="space-y-2">
              {product.productIngredients.map((pi) => (
                <div
                  key={pi.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium">
                        {pi.ingredient.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {pi.ingredient.isAllergen &&
                          pi.ingredient.allergenType && (
                            <span className="text-xs text-orange-600">
                              ⚠ {ALLERGY_LABELS[pi.ingredient.allergenType]}
                            </span>
                          )}
                        {pi.canRemove && (
                          <span className="text-xs text-blue-600">
                            Pode remover
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={removeProductIngredient.bind(null, pi.id, productId)}>
                      <Button size="icon" variant="ghost" type="submit" className="h-7 w-7 text-red-500 hover:text-red-600">
                        <TrashIcon className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}

          {availableToAdd.length > 0 ? (
            <>
              {product.productIngredients.length > 0 && (
                <Separator />
              )}
              <form action={addProductIngredient} className="grid gap-3 sm:grid-cols-3">
                <input type="hidden" name="productId" value={productId} />
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="ingredientId" className="text-xs">
                    Adicionar ingrediente
                  </Label>
                  <select
                    id="ingredientId"
                    name="ingredientId"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Selecione um ingrediente</option>
                    {availableToAdd.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                        {i.isAllergen ? " ⚠" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" name="canRemove" className="h-3.5 w-3.5" />
                    Pode remover
                  </label>
                  <Button size="sm" type="submit">
                    <PlusIcon className="h-3.5 w-3.5" />
                    Adicionar
                  </Button>
                </div>
              </form>
            </>
          ) : allIngredients.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum ingrediente cadastrado.{" "}
              <Link href="/admin/ingredients" className="text-primary underline">
                Cadastre ingredientes primeiro.
              </Link>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Todos os ingredientes já foram adicionados ao produto.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Addons section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adicionais pagos</CardTitle>
          <p className="text-xs text-muted-foreground">
            Itens extras que o cliente pode adicionar ao produto
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {product.productAddons.length > 0 && (
            <div className="space-y-2">
              {product.productAddons.map((addon) => (
                <div
                  key={addon.id}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-lg border p-3",
                    !addon.isActive && "opacity-60",
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{addon.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatCurrency(addon.price)}</span>
                      <span>·</span>
                      <span>máx {addon.maxQuantity}</span>
                      {addon.description && (
                        <>
                          <span>·</span>
                          <span>{addon.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <form
                      action={toggleProductAddonActive.bind(
                        null,
                        addon.id,
                        productId,
                      )}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        type="submit"
                        className="text-xs"
                      >
                        {addon.isActive ? "Desativar" : "Ativar"}
                      </Button>
                    </form>
                    <form
                      action={removeProductAddon.bind(null, addon.id, productId)}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        type="submit"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
              <Separator />
            </div>
          )}

          <form action={createProductAddon} className="grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="productId" value={productId} />
            <div className="space-y-1">
              <Label htmlFor="addonName" className="text-xs">
                Nome do adicional
              </Label>
              <Input
                id="addonName"
                name="name"
                placeholder="Ex: Bacon extra"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="addonDescription" className="text-xs">
                Descrição (opcional)
              </Label>
              <Input
                id="addonDescription"
                name="description"
                placeholder="Detalhe opcional"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="addonPrice" className="text-xs">
                Preço
              </Label>
              <Input
                id="addonPrice"
                name="price"
                inputMode="decimal"
                placeholder="4,00"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="addonMaxQuantity" className="text-xs">
                Quantidade máxima
              </Label>
              <Input
                id="addonMaxQuantity"
                name="maxQuantity"
                type="number"
                min="1"
                max="10"
                defaultValue="1"
              />
            </div>
            <div className="sm:col-span-2">
              <Button size="sm" type="submit">
                <PlusIcon className="h-3.5 w-3.5" />
                Adicionar adicional
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCustomizationPage;
