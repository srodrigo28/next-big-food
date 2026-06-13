import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getAdminSession } from "@/lib/admin-auth";

import AdminNav from "./components/admin-nav";
import { signOutAdmin } from "./login/actions";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="hidden w-64 shrink-0 border-r bg-white p-5 md:block">
          <Link href="/admin/dashboard" className="block">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Next Big Food
            </p>
            <h1 className="mt-1 text-xl font-semibold">Admin</h1>
          </Link>
          <div className="mt-8">
            <AdminNav />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b bg-white px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {session?.restaurant.name ?? "Operacao do estabelecimento"}
                </p>
                <h2 className="text-lg font-semibold">
                  Controle de pedidos, cozinha e mesas
                </h2>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                {session && (
                  <form action={signOutAdmin}>
                    <Button size="sm" variant="outline">
                      Sair
                    </Button>
                  </form>
                )}
                <div className="flex gap-2 md:hidden">
                  <AdminNav />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
