import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
import Footer from "./components/footer";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ consumptionMethod: string; table?: string }>;
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
  return ["DINE_IN", "TAKEAWAY"].includes(consumptionMethod.toUpperCase());
};

const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { consumptionMethod, table } = await searchParams;
  const tableCode = table?.trim().toUpperCase();
  if (!isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      menuCategories: {
        include: {
          products: {
            where: {
              isAvailable: true,
            },
          },
        },
      },
    },
  });
  if (!restaurant) {
    return notFound();
  }

  const restaurantTable = tableCode
    ? await db.restaurantTable.findUnique({
        where: {
          restaurantId_code: {
            restaurantId: restaurant.id,
            code: tableCode,
          },
        },
      })
    : null;

  if (tableCode && !restaurantTable) {
    return notFound();
  }

  return (
    <div>
      <RestaurantHeader restaurant={restaurant} />
      {restaurantTable && (
        <div className="mx-auto max-w-[900px] bg-white px-5 pt-5">
          <p className="w-fit rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold">
            Pedido vinculado a {restaurantTable.name}
          </p>
        </div>
      )}
      <RestaurantCategories restaurant={restaurant} />

      <Footer />
    </div>
  );
};

export default RestaurantMenuPage;
