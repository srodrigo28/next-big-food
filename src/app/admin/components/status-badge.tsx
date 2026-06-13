import { OrderStatus, TableStatus } from "@prisma/client";

import { cn } from "@/lib/utils";

const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  IN_PREPARATION: "Em preparo",
  PAYMENT_CONFIRMED: "Pago",
  PAYMENT_FAILED: "Pagamento falhou",
  READY: "Pronto",
  DELIVERED: "Entregue",
  FINISHED: "Finalizado",
  CANCELLED: "Cancelado",
};

const tableStatusLabel: Record<TableStatus, string> = {
  AVAILABLE: "Livre",
  OCCUPIED: "Ocupada",
  WAITING_ORDER: "Aguardando pedido",
  IN_SERVICE: "Em atendimento",
  WAITING_PAYMENT: "Aguardando pagamento",
};

const statusClassName: Record<OrderStatus | TableStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PREPARATION: "bg-blue-100 text-blue-800",
  PAYMENT_CONFIRMED: "bg-green-100 text-green-800",
  PAYMENT_FAILED: "bg-red-100 text-red-800",
  READY: "bg-emerald-100 text-emerald-800",
  DELIVERED: "bg-slate-100 text-slate-800",
  FINISHED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  AVAILABLE: "bg-green-100 text-green-800",
  OCCUPIED: "bg-orange-100 text-orange-800",
  WAITING_ORDER: "bg-yellow-100 text-yellow-800",
  IN_SERVICE: "bg-blue-100 text-blue-800",
  WAITING_PAYMENT: "bg-purple-100 text-purple-800",
};

interface StatusBadgeProps {
  status: OrderStatus | TableStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const label =
    status in orderStatusLabel
      ? orderStatusLabel[status as OrderStatus]
      : tableStatusLabel[status as TableStatus];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        statusClassName[status],
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
