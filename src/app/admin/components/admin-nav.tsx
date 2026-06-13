import {
  ClipboardListIcon,
  CookingPotIcon,
  LayoutDashboardIcon,
  PackageIcon,
  Table2Icon,
  TagsIcon,
} from "lucide-react";
import Link from "next/link";

const items = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/admin/orders",
    label: "Pedidos",
    icon: ClipboardListIcon,
  },
  {
    href: "/admin/kitchen",
    label: "Cozinha",
    icon: CookingPotIcon,
  },
  {
    href: "/admin/tables",
    label: "Mesas",
    icon: Table2Icon,
  },
  {
    href: "/admin/categories",
    label: "Categorias",
    icon: TagsIcon,
  },
  {
    href: "/admin/products",
    label: "Produtos",
    icon: PackageIcon,
  },
];

const AdminNav = () => {
  return (
    <nav className="grid gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default AdminNav;
