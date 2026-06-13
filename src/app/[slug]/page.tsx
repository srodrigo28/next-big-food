import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ConsumptionMethodOption from "./components/consumption-method-option";
import Footer from "./menu/components/footer";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ table?: string }>;
}

const normalizeTableCode = (value: string) => {
  return value.trim().toUpperCase();
};

const RestaurantPage = async ({ params, searchParams }: RestaurantPageProps) => {
  const { slug } = await params;
  const { table } = await searchParams;
  const tableCode = table ? normalizeTableCode(table) : undefined;
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
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
      <div className="flex h-[90vh] flex-col items-center justify-center px-6">
        {/* LOGO E TITULO */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src={restaurant.avatarImageUrl}
            alt={restaurant.name}
            width={82}
            height={82}
          />
          <h2 className="font-semibold">{restaurant.name}</h2>
        </div>
        {/* BEM VINDO */}
        <div className="space-y-2 pt-24 text-center">
          <h3 className="text-2xl font-semibold">Seja bem-vindo!</h3>
          <p className="opacity-55">
            Escolha como prefere aproveitar sua refeição!
          </p>
          {restaurantTable && (
            <p className="mx-auto w-fit rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-foreground">
              {restaurantTable.name}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-8">
          <ConsumptionMethodOption
            slug={slug}
            option="DINE_IN"
            buttonText="Comer aqui"
            imageAlt="Comer aqui"
            imageUrl="/dine_in.png"
            tableCode={tableCode}
          />
          <ConsumptionMethodOption
            slug={slug}
            option="TAKEAWAY"
            buttonText="Para levar"
            imageAlt="Para levar"
            imageUrl="/takeaway.png"
            tableCode={tableCode}
          />
        </div>
      </div>
      <div className="mx-auto h-[10vh] max-w-[420px] rounded-t-xl bg-white">
        <div className="mx-auto max-w-[400px]">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
