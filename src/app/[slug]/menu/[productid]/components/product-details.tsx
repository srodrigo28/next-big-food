"use client";

import { AllergyType, Prisma } from "@prisma/client";
import {
  ChefHatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  ShieldAlertIcon,
} from "lucide-react";
import Image from "next/image";
import { useContext, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ALLERGY_LABELS } from "@/constants/allergy";
import { formatCurrency } from "@/helpers/format-currency";

import CartSheet from "../../components/cart-sheet";
import {
  CartContext,
  CartProductCustomization,
  CartRemovedIngredient,
} from "../../contexts/cart";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
          avatarImageUrl: true;
        };
      };
      productIngredients: {
        include: { ingredient: true };
      };
      productAddons: true;
    };
  }>;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { toggleCart, addProduct } = useContext(CartContext);
  const [quantity, setQuantity] = useState<number>(1);
  const [removedIngredientIds, setRemovedIngredientIds] = useState<string[]>(
    [],
  );
  const [addonQuantities, setAddonQuantities] = useState<
    Record<string, number>
  >({});
  const [observation, setObservation] = useState("");
  const [hasAllergy, setHasAllergy] = useState(false);
  const [allergyTypes, setAllergyTypes] = useState<AllergyType[]>([]);
  const [allergyNotes, setAllergyNotes] = useState("");

  const removableIngredients = product.productIngredients.filter(
    (pi) => pi.canRemove,
  );
  const addons = product.productAddons;
  const hasCustomizationOptions =
    removableIngredients.length > 0 || addons.length > 0;

  const unitPrice = useMemo(() => {
    const addonsTotal = addons.reduce((acc, addon) => {
      const addonQuantity = addonQuantities[addon.id] ?? 0;
      return acc + addon.price * addonQuantity;
    }, 0);
    return product.price + addonsTotal;
  }, [addonQuantities, addons, product.price]);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev === 1) {
        return 1;
      }
      return prev - 1;
    });
  };
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const toggleRemovedIngredient = (ingredientId: string) => {
    setRemovedIngredientIds((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId],
    );
  };

  const handleAddonQuantityChange = (
    addonId: string,
    maxQuantity: number,
    delta: number,
  ) => {
    setAddonQuantities((prev) => {
      const current = prev[addonId] ?? 0;
      const next = Math.min(Math.max(current + delta, 0), maxQuantity);
      return { ...prev, [addonId]: next };
    });
  };

  const toggleAllergyType = (type: AllergyType) => {
    setAllergyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleAddToCart = () => {
    const selectedAddons = addons
      .filter((addon) => (addonQuantities[addon.id] ?? 0) > 0)
      .map((addon) => ({
        addonId: addon.id,
        name: addon.name,
        price: addon.price,
        quantity: addonQuantities[addon.id] ?? 0,
      }));

    const removedIngredients: CartRemovedIngredient[] = removableIngredients
      .filter((pi) => removedIngredientIds.includes(pi.ingredientId))
      .map((pi) => ({
        ingredientId: pi.ingredientId,
        name: pi.ingredient.name,
      }));

    const hasCustomization =
      removedIngredients.length > 0 ||
      selectedAddons.length > 0 ||
      observation.trim().length > 0 ||
      hasAllergy;

    const customization: CartProductCustomization | undefined = hasCustomization
      ? {
          removedIngredients,
          addons: selectedAddons,
          observation: observation.trim(),
          hasAllergy,
          allergyTypes,
          allergyNotes: allergyNotes.trim(),
        }
      : undefined;

    addProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      unitPrice,
      customization,
    });
    toggleCart();
  };

  return (
    <>
      <div className="relative mx-auto mt-1 flex max-w-[900px] flex-auto flex-col rounded-t-3xl bg-white px-3 pb-3 lg:min-w-[900px]">
        <div className="flex-auto rounded-t-xl px-2 pt-5">
          {/* RESTAURANTE */}
          <div className="flex items-center gap-1.5">
            <Image
              src={product.restaurant.avatarImageUrl}
              alt={product.restaurant.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <p className="text-xs text-muted-foreground">
              {product.restaurant.name}
            </p>
          </div>

          {/* NOME DO PRODUTO */}
          <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>

          {/* PREÇO E QUANTIDADE */}
          <div className="mt-3 flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {formatCurrency(product.price)}
            </h3>
            <div className="flex items-center gap-3 text-center">
              <Button
                variant="outline"
                className="h-8 w-8 rounded-xl"
                onClick={handleDecreaseQuantity}
              >
                <ChevronLeftIcon />
              </Button>
              <p className="w-4">{quantity}</p>
              <Button
                variant="destructive"
                className="h-8 w-8 rounded-xl"
                onClick={handleIncreaseQuantity}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>

          {/* SOBRE */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Sobre</h4>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* INGREDIENTS */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-1">
              <ChefHatIcon size={18} />
              <h4 className="font-semibold">Ingredientes</h4>
            </div>
            <ul className="list-disc px-5 text-sm text-muted-foreground">
              {product.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </div>

          {/* REMOVER INGREDIENTES */}
          {removableIngredients.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold">Remover ingredientes</h4>
              <div className="space-y-2">
                {removableIngredients.map((pi) => (
                  <label
                    key={pi.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={removedIngredientIds.includes(pi.ingredientId)}
                      onChange={() => toggleRemovedIngredient(pi.ingredientId)}
                    />
                    Sem {pi.ingredient.name}
                    {pi.ingredient.isAllergen && (
                      <span className="text-xs text-orange-600">⚠</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ADICIONAIS */}
          {addons.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold">Adicionais</h4>
              <div className="space-y-3">
                {addons.map((addon) => {
                  const addonQuantity = addonQuantities[addon.id] ?? 0;
                  return (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(addon.price)}
                          {addon.description ? ` · ${addon.description}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-lg"
                          disabled={addonQuantity === 0}
                          onClick={() =>
                            handleAddonQuantityChange(
                              addon.id,
                              addon.maxQuantity,
                              -1,
                            )
                          }
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </Button>
                        <p className="w-4 text-center text-sm">
                          {addonQuantity}
                        </p>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-lg"
                          disabled={addonQuantity >= addon.maxQuantity}
                          onClick={() =>
                            handleAddonQuantityChange(
                              addon.id,
                              addon.maxQuantity,
                              1,
                            )
                          }
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!hasCustomizationOptions && (
            <div className="mt-6 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              Este produto ainda não possui opções de personalização
              configuradas. Você ainda pode adicionar uma observação para o
              estabelecimento.
            </div>
          )}

          {/* OBSERVAÇÃO */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold">Observação</h4>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Ex: ponto da carne, corte do alimento, etc."
              rows={3}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </div>

          {/* ALERGIA */}
          <div className="mt-6 space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={hasAllergy}
                onChange={(e) => setHasAllergy(e.target.checked)}
              />
              <ShieldAlertIcon size={18} />
              Possui alguma alergia alimentar?
            </label>
            {hasAllergy && (
              <div className="space-y-3 rounded-xl border p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {Object.entries(ALLERGY_LABELS).map(([value, label]) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={allergyTypes.includes(value as AllergyType)}
                        onChange={() => toggleAllergyType(value as AllergyType)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Descreva qualquer cuidado necessário para o preparo."
                  rows={2}
                  value={allergyNotes}
                  onChange={(e) => setAllergyNotes(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <Button
          className="mt-5 w-full rounded-full hover:cursor-pointer"
          onClick={handleAddToCart}
        >
          Adicionar à sacola · {formatCurrency(unitPrice * quantity)}
        </Button>
        <CartSheet />
      </div>
    </>
  );
};

export default ProductDetails;
