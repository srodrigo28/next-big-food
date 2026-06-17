import {
  BellIcon,
  ChevronDownIcon,
  ClipboardListIcon,
  HeartIcon,
  HomeIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  ShoppingBagIcon,
  SlidersHorizontalIcon,
  StarIcon,
  UserRoundIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

const menuSearch = "consumptionMethod=TAKEAWAY";

const categories = [
  {
    name: "Hamburguer",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQKfI6fivqActTvBGLXfQe4a8CJ6d3HiR7USPK",
  },
  {
    name: "Pizza",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ99rtECuYaDgmA4VujBU0wKn2ThXJvF3LHfyc",
  },
  {
    name: "Japonesa",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQBH21ijzEVXRoycAtrP9vH45bZ6WDl3QF0a1M",
  },
  {
    name: "Churrasco",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQeGQofnEPyQaHEV2WL8rGUs41oMICtYfNkphl",
  },
  {
    name: "Sorvetes",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQtfuQrAKkI75oJfPT0crZxvX82ui9qV3hLFdY",
  },
  {
    name: "Saudavel",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ7i05S5tkc0L9oMIXZsFJtwnBh2KCz3y6uSW1",
  },
];

const restaurants = [
  {
    name: "Burger House",
    rating: "4,9",
    time: "12 min",
    distance: "1,2 km",
    tag: "Frete gratis",
    tagClass: "bg-green-100 text-green-700",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQKfI6fivqActTvBGLXfQe4a8CJ6d3HiR7USPK",
  },
  {
    name: "Pizza do Chef",
    rating: "4,8",
    time: "18 min",
    distance: "1,5 km",
    tag: "Oferta",
    tagClass: "bg-red-100 text-red-600",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ99rtECuYaDgmA4VujBU0wKn2ThXJvF3LHfyc",
  },
  {
    name: "Sushi Prime",
    rating: "4,9",
    time: "15 min",
    distance: "1,3 km",
    tag: "Frete gratis",
    tagClass: "bg-green-100 text-green-700",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQBH21ijzEVXRoycAtrP9vH45bZ6WDl3QF0a1M",
  },
];

const highlights = [
  {
    badge: "Mais vendido",
    name: "X-Bacon Especial",
    restaurant: "Burger House",
    price: "R$ 29,90",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQaHB8tslkBUjlHSKiuseLm2hIFzVY0OtxEPnw",
  },
  {
    badge: "Mais pedido",
    name: "Pizza Calabresa",
    restaurant: "Pizza do Chef",
    price: "R$ 34,90",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ99rtECuYaDgmA4VujBU0wKn2ThXJvF3LHfyc",
  },
  {
    badge: "Queridinho",
    name: "Combinado 20 Pecas",
    restaurant: "Sushi Prime",
    price: "R$ 49,90",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQBH21ijzEVXRoycAtrP9vH45bZ6WDl3QF0a1M",
  },
  {
    badge: "Top 1",
    name: "Acai Especial 500ml",
    restaurant: "Acai da Barra",
    price: "R$ 16,90",
    imageUrl:
      "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ7i05S5tkc0L9oMIXZsFJtwnBh2KCz3y6uSW1",
  },
];

const BottomNavItem = ({
  active,
  icon,
  label,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    className={`flex min-w-0 flex-1 flex-col items-center gap-1 text-xs font-medium ${
      active ? "text-[var(--brand-primary)]" : "text-gray-500"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const menuHref = `/${slug}/menu?${menuSearch}`;

  return (
    <div className="min-h-full w-full bg-white text-[var(--brand-text)]">
      <div className="px-4 pb-8 pt-5">
          <header className="sticky top-0 z-20 -mx-4 -mt-5 space-y-5 bg-white px-4 pb-4 pt-5 shadow-[0_8px_16px_-12px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-8 w-8 text-[var(--brand-primary)]" />
                <div className="leading-tight">
                  <p className="text-sm text-gray-500">Entregar em</p>
                  <button className="flex items-center gap-1 text-left text-base font-semibold">
                    Rua Goias, Centro
                    <ChevronDownIcon className="h-4 w-4 text-[var(--brand-primary)]" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="relative">
                  <BellIcon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--brand-primary)]" />
                </div>
                <div className="relative">
                  <ShoppingBagIcon className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[11px] font-bold text-white">
                    2
                  </span>
                </div>
              </div>
            </div>

            <Link href={menuHref} className="block">
              <div className="mx-auto flex items-center justify-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white">
                  <span className="text-3xl font-black leading-none">⚡</span>
                </span>
                <span className="text-4xl font-black italic tracking-tight">
                  Zap<span className="text-[var(--brand-primary)]">Food</span>
                </span>
              </div>
            </Link>

            <div className="flex h-[78px] items-center rounded-2xl border border-gray-200 bg-white px-4 shadow-sm">
              <SearchIcon className="h-8 w-8 shrink-0 text-gray-950" />
              <p className="ml-4 flex-1 truncate text-xl text-gray-400">
                Buscar hamburguer, pizza, acai...
              </p>
              <div className="ml-3 h-10 border-l border-gray-200 pl-5">
                <SlidersHorizontalIcon className="h-8 w-8 text-gray-950" />
              </div>
            </div>
          </header>

          <Link
            href={menuHref}
            className="relative mt-6 block h-[238px] overflow-hidden rounded-xl bg-[var(--brand-primary)] px-6 py-7 text-white shadow-sm"
          >
            <div className="relative z-10 max-w-[190px]">
              <p className="text-3xl font-black italic leading-none">
                FRETE GRATIS
              </p>
              <p className="mt-3 text-xl font-semibold leading-tight">
                em pedidos acima de <span className="text-yellow-300">R$25</span>
              </p>
              <div className="mt-7 w-fit rounded-lg bg-white/20 px-5 py-3 text-lg font-bold">
                Use o cupom: ZAP10
              </div>
              <div className="mt-7 flex gap-2">
                <span className="h-3 w-6 rounded-full bg-white" />
                <span className="h-3 w-3 rounded-full bg-white/50" />
                <span className="h-3 w-3 rounded-full bg-white/50" />
                <span className="h-3 w-3 rounded-full bg-white/50" />
                <span className="h-3 w-3 rounded-full bg-white/50" />
              </div>
            </div>
            <div className="absolute bottom-2 right-4 h-[190px] w-[230px]">
              <Image
                src="https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQKfI6fivqActTvBGLXfQe4a8CJ6d3HiR7USPK"
                alt="Hamburguer promocional"
                fill
                className="object-contain"
              />
            </div>
            <span className="absolute bottom-5 right-5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[var(--brand-primary)] shadow-lg">
              <span className="text-3xl">🛵</span>
            </span>
          </Link>

          <section className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Categorias</h2>
              <Link href={menuHref} className="text-base font-bold text-[var(--brand-primary)]">
                Ver todas
              </Link>
            </div>
            <div className="-mx-4 mt-5 flex gap-5 overflow-x-auto px-4 pb-2">
              {categories.map((category) => (
                <Link
                  href={menuHref}
                  key={category.name}
                  className="w-[82px] shrink-0 text-center"
                >
                  <div className="relative h-[78px] w-[78px] rounded-full bg-gray-100">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="rounded-full object-contain p-2"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{category.name}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Restaurantes proximos de voce</h2>
              <Link href={menuHref} className="text-base font-bold text-[var(--brand-primary)]">
                Ver todos
              </Link>
            </div>
            <div className="-mx-4 mt-5 flex gap-4 overflow-x-auto px-4 pb-2">
              {restaurants.map((restaurant) => (
                <Link
                  href={menuHref}
                  key={restaurant.name}
                  className="w-[220px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <div className="relative h-[128px]">
                    <Image
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--brand-primary)] shadow">
                      <HeartIcon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1 text-gray-900">
                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                      </span>
                      <span>{restaurant.time}</span>
                      <span>{restaurant.distance}</span>
                    </div>
                    <span
                      className={`mt-4 inline-flex rounded-md px-3 py-2 text-sm font-semibold ${restaurant.tagClass}`}
                    >
                      {restaurant.tag}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">O melhor de cada restaurante</h2>
              <Link href={menuHref} className="text-base font-bold text-[var(--brand-primary)]">
                Ver todos
              </Link>
            </div>
            <div className="-mx-4 mt-5 flex gap-4 overflow-x-auto px-4 pb-2">
              {highlights.map((product) => (
                <Link
                  href={menuHref}
                  key={product.name}
                  className="w-[180px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <div className="relative h-[150px]">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-md bg-white px-3 py-1 text-xs font-bold text-[var(--brand-primary)] shadow">
                      {product.badge}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-lg font-semibold">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.restaurant}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-lg font-bold">{product.price}</p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white">
                        <PlusIcon className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <Link
            href={menuHref}
            className="mt-8 flex items-center gap-4 rounded-xl border border-red-100 bg-red-50/20 p-4"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[var(--brand-primary)]">
              <ShoppingBagIcon className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold">Peca de novo com 1 clique</h2>
              <p className="mt-1 text-sm text-gray-500">Seus ultimos pedidos</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white text-[var(--brand-primary)]">
              <ChevronDownIcon className="h-5 w-5 -rotate-90" />
            </span>
          </Link>
        </div>

        <nav className="sticky bottom-0 grid grid-cols-5 border-t bg-white px-2 py-3">
          <BottomNavItem active icon={<HomeIcon className="h-7 w-7" />} label="Inicio" />
          <BottomNavItem icon={<SearchIcon className="h-7 w-7" />} label="Busca" />
          <BottomNavItem
            icon={<ClipboardListIcon className="h-7 w-7" />}
            label="Pedidos"
          />
          <BottomNavItem icon={<HeartIcon className="h-7 w-7" />} label="Favoritos" />
          <BottomNavItem icon={<UserRoundIcon className="h-7 w-7" />} label="Perfil" />
        </nav>
      </div>
  );
};

export default RestaurantPage;
