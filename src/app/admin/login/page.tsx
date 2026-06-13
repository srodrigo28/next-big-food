import { Building2Icon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/20 text-primary">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Acesso do estabelecimento</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre no painel operacional ou inicie o cadastro do seu restaurante.
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
                placeholder="admin@zapfood.local"
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
            Primeiro acesso local: admin@zapfood.local / admin123.
          </div>

          <div className="mt-4 rounded-md border p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary">
                <Building2Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Ainda nao tem cadastro?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  O onboarding de novos estabelecimentos esta no roteiro. Por enquanto,
                  use o acesso local ou fale com o suporte para criar uma conta.
                </p>
              </div>
            </div>
            <Button className="mt-4 w-full" variant="outline" asChild>
              <Link href="/">Voltar para inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
