import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import AppShell from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";

import { CartProvider } from "./[slug]/menu/contexts/cart";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZapFood",
  description:
    "ZapFood. Seja bem-vindo! Escolha como prefere aproveitar sua refeicao. Estamos aqui para oferecer praticidade e sabor em cada detalhe!",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ZapFood",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${poppins.className} h-full antialiased`}>
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>

        <Toaster />
      </body>
    </html>
  );
}
