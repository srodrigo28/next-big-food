import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { formatCurrency } from "@/helpers/format-currency";

interface ProductsProps {
  products: Product[];
  searchTerm?: string;
}

const Products = ({ products, searchTerm }: ProductsProps) => {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const consumptionMethod = searchParams.get("consumptionMethod");
  const tableCode = searchParams.get("table");

  const normalizedSearch = searchTerm?.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch),
      )
    : products;

  return (
    <div className="space-y-3 px-5">
      {filteredProducts.map((product) => {
        const productSearchParams = new URLSearchParams();
        if (consumptionMethod) {
          productSearchParams.set("consumptionMethod", consumptionMethod);
        }
        if (tableCode) {
          productSearchParams.set("table", tableCode);
        }

        const content = (
          <>
            {/* ESQUERDA */}
            <div>
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {product.description}
              </p>
              <p className="pt-3 text-sm font-semibold">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* DIREITA */}
            <div className="relative min-h-[82px] min-w-[120px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="rounded-lg object-contain"
              />
              {!product.isAvailable && (
                <span className="absolute left-1 top-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800">
                  Indisponivel
                </span>
              )}
            </div>
          </>
        );

        if (!product.isAvailable) {
          return (
            <div
              key={product.id}
              className="flex items-center justify-between gap-10 border-b py-3 opacity-50"
            >
              {content}
            </div>
          );
        }

        return (
          <Link
            key={product.id}
            href={`/${slug}/menu/${product.id}?${productSearchParams.toString()}`}
            className="flex items-center justify-between gap-10 border-b py-3"
          >
            {content}
          </Link>
        );
      })}

      {filteredProducts.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhum produto encontrado.
        </p>
      )}
    </div>
  );
};

export default Products;
