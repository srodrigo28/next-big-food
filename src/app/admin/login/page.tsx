import { ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminSession } from "@/lib/admin-auth";

import { signInAdmin } from "./actions";
import { redirect } from "next/navigation";

interface AdminLoginPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

const AdminLoginPage = async ({ searchParams }: AdminLoginPageProps) => {
  const session = await getAdminSession();
  const { error } = await searchParams;

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/20 text-primary">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Entrar no admin</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Acesse o painel operacional do estabelecimento.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={signInAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@nextbigfood.local"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                required
              />
            </div>

            {error === "invalid" && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Email ou senha invalidos.
              </p>
            )}

            <Button className="w-full">Entrar</Button>
          </form>

          <div className="mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground">
            Primeiro acesso local: `admin@nextbigfood.local` / `admin123`.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
