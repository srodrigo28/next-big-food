"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import {
  CheckCircle2Icon,
  ClipboardCopyIcon,
  Loader2Icon,
  QrCodeIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createAsaasCharge } from "../actions/create-asaas-charge";
import { createOrder } from "../actions/create-order";
import { CartContext } from "../contexts/cart";
import { isValidCpf } from "../helpers/cpf";

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
  cpf: z
    .string()
    .trim()
    .min(1, { message: "O CPF é obrigatório." })
    .refine((v) => isValidCpf(v), { message: "CPF inválido." }),
});

type FormSchema = z.infer<typeof formSchema>;

interface PixData {
  orderId: number;
  pixCode: string;
  pixQrCodeBase64: string;
  expirationDate: string;
}

interface FinishOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { products, clearCart } = useContext(CartContext);
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", cpf: "" },
    shouldUnregister: true,
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      setIsLoading(true);
      const consumptionMethod = searchParams.get(
        "consumptionMethod",
      ) as ConsumptionMethod;
      const tableCode = searchParams.get("table") ?? undefined;

      const order = await createOrder({
        consumptionMethod,
        customerCpf: data.cpf,
        customerName: data.name,
        products: products.map((product) => ({
          id: product.id,
          quantity: product.quantity,
          customization: product.customization
            ? {
                removedIngredientIds:
                  product.customization.removedIngredients.map(
                    (ingredient) => ingredient.ingredientId,
                  ),
                addons: product.customization.addons.map((addon) => ({
                  addonId: addon.addonId,
                  quantity: addon.quantity,
                })),
                observation: product.customization.observation,
                hasAllergy: product.customization.hasAllergy,
                allergyTypes: product.customization.allergyTypes,
                allergyNotes: product.customization.allergyNotes,
              }
            : undefined,
        })),
        slug,
        tableCode,
      });

      const charge = await createAsaasCharge(order.id, data.name, data.cpf);

      clearCart();
      setPixData({
        orderId: order.id,
        pixCode: charge.pixCode,
        pixQrCodeBase64: charge.pixQrCodeBase64,
        expirationDate: charge.expirationDate,
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar cobrança. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pixData) return;
    await navigator.clipboard.writeText(pixData.pixCode);
    toast.success("Código PIX copiado!");
  };

  const handleViewOrders = () => {
    if (pixData) {
      router.push(`/${slug}/order/${pixData.orderId}`);
    }
    onOpenChange(false);
  };

  const handleClose = () => {
    setPixData(null);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerTrigger asChild />
      <DrawerContent className="mx-auto max-w-[480px]">
        {!pixData ? (
          <>
            <DrawerHeader>
              <DrawerTitle>Finalizar Pedido</DrawerTitle>
              <DrawerDescription>
                Insira suas informações para gerar o QR Code PIX.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu nome..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu CPF</FormLabel>
                        <FormControl>
                          <PatternFormat
                            placeholder="Digite seu CPF..."
                            format="###.###.###-##"
                            customInput={Input}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DrawerFooter className="px-0">
                    <Button
                      type="submit"
                      className="w-full rounded-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2Icon className="animate-spin" />
                          Gerando cobrança...
                        </>
                      ) : (
                        <>
                          <QrCodeIcon />
                          Gerar QR Code PIX
                        </>
                      )}
                    </Button>
                    <DrawerClose asChild>
                      <Button
                        className="w-full rounded-full"
                        variant="outline"
                        type="button"
                      >
                        Cancelar
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            <DrawerHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                <DrawerTitle>Pedido #{pixData.orderId} criado!</DrawerTitle>
              </div>
              <DrawerDescription>
                Escaneie o QR Code ou copie o código PIX para pagar.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col items-center gap-4 px-5 pb-2">
              {pixData.pixQrCodeBase64 && (
                <div className="relative h-48 w-48 overflow-hidden rounded-xl border">
                  <Image
                    src={`data:image/png;base64,${pixData.pixQrCodeBase64}`}
                    alt="QR Code PIX"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              <div className="w-full rounded-xl border bg-gray-50 px-3 py-2">
                <p className="mb-1 text-xs font-medium text-gray-500">
                  Código PIX (copia e cola)
                </p>
                <p className="break-all font-mono text-[11px] leading-relaxed text-gray-700">
                  {pixData.pixCode.slice(0, 80)}…
                </p>
              </div>

              {pixData.expirationDate && (
                <p className="text-xs text-gray-500">
                  QR Code válido até{" "}
                  {new Date(pixData.expirationDate).toLocaleTimeString(
                    "pt-BR",
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </p>
              )}
            </div>

            <DrawerFooter>
              <Button
                className="w-full rounded-full"
                onClick={handleCopyPix}
                variant="outline"
              >
                <ClipboardCopyIcon />
                Copiar código PIX
              </Button>
              <Button
                className="w-full rounded-full"
                onClick={handleViewOrders}
              >
                Acompanhar pedido
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default FinishOrderDialog;
