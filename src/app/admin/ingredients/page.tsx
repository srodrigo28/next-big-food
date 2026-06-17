import { LeafIcon, ShieldAlertIcon } from "lucide-react";

import {
  createIngredient,
  toggleIngredientActive,
} from "@/app/admin/actions/ingredients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALLERGY_LABELS } from "@/constants/allergy";
import { requireAdminSession } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import { db } from "@/lib/prisma";

const IngredientsPage = async () => {
  const { restaurant } = await requireAdminSession();

  const ingredients = await db.ingredient.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ingredientes</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre ingredientes para configurar personalizações nos produtos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo ingrediente</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createIngredient} className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" placeholder="Ex: Queijo, Bacon..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input id="description" name="description" placeholder="Detalhe do ingrediente" />
            </div>
            <div className="flex items-center gap-6 xl:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isAllergen" className="h-4 w-4" />
                É alergênico
              </label>
              <div className="flex items-center gap-2">
                <Label htmlFor="allergenType" className="text-sm">
                  Tipo
                </Label>
                <select
                  id="allergenType"
                  name="allergenType"
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option value="">Selecione</option>
                  {Object.entries(ALLERGY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="xl:col-span-2">
              <Button>Cadastrar ingrediente</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {ingredients.map((ingredient) => (
          <Card
            key={ingredient.id}
            className={cn(!ingredient.isActive && "opacity-60")}
          >
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  {ingredient.isAllergen ? (
                    <ShieldAlertIcon className="h-4 w-4 text-orange-500" />
                  ) : (
                    <LeafIcon className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{ingredient.name}</p>
                  <div className="flex items-center gap-2">
                    {ingredient.description && (
                      <p className="text-xs text-muted-foreground">
                        {ingredient.description}
                      </p>
                    )}
                    {ingredient.isAllergen && ingredient.allergenType && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                        {ALLERGY_LABELS[ingredient.allergenType]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <form action={toggleIngredientActive.bind(null, ingredient.id)}>
                <Button
                  size="sm"
                  variant={ingredient.isActive ? "outline" : "default"}
                  type="submit"
                >
                  {ingredient.isActive ? "Desativar" : "Ativar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}

        {ingredients.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Nenhum ingrediente cadastrado. Adicione acima para configurar
              personalizações nos produtos.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IngredientsPage;
