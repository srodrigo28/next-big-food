import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/prisma";
import { getRestaurantLookupSlugs } from "@/lib/restaurant-slug";

interface TableQrPageProps {
  params: Promise<{
    slug: string;
    tableCode: string;
  }>;
}

const TableQrPage = async ({ params }: TableQrPageProps) => {
  const { slug, tableCode } = await params;
  const normalizedTableCode = decodeURIComponent(tableCode).trim().toUpperCase();

  const restaurant = await db.restaurant.findFirst({
    where: {
      slug: {
        in: getRestaurantLookupSlugs(slug),
      },
    },
  });

  if (!restaurant) {
    return notFound();
  }

  const table = await db.restaurantTable.findUnique({
    where: {
      restaurantId_code: {
        restaurantId: restaurant.id,
        code: normalizedTableCode,
      },
    },
  });

  if (!table) {
    return notFound();
  }

  redirect(`/${slug}?table=${encodeURIComponent(table.code)}`);
};

export default TableQrPage;
