const ASAAS_URL = process.env.API_ASAAS_URL!;
const ASAAS_KEY = process.env.API_ASAAS_KEY!;

const asaasHeaders = {
  accept: "application/json",
  "content-type": "application/json",
  access_token: ASAAS_KEY,
};

export interface AsaasPixQrCode {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

async function asaasFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${ASAAS_URL}${path}`, {
    ...options,
    headers: { ...asaasHeaders, ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ASAAS ${options?.method ?? "GET"} ${path} → ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function findOrCreateCustomer(
  name: string,
  cpf: string,
): Promise<string> {
  const cleanCpf = cpf.replace(/\D/g, "");

  const search = await asaasFetch<{ data: { id: string }[] }>(
    `/customers?cpfCnpj=${cleanCpf}&limit=1`,
  );

  if (search.data.length > 0) {
    return search.data[0].id;
  }

  const created = await asaasFetch<{ id: string }>("/customers", {
    method: "POST",
    body: JSON.stringify({ name, cpfCnpj: cleanCpf }),
  });

  return created.id;
}

export async function createPixCharge(
  customerId: string,
  value: number,
  orderId: number,
  restaurantName: string,
): Promise<string> {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);
  const dueDateStr = dueDate.toISOString().split("T")[0];

  const charge = await asaasFetch<{ id: string }>("/payments", {
    method: "POST",
    body: JSON.stringify({
      customer: customerId,
      billingType: "PIX",
      value,
      dueDate: dueDateStr,
      externalReference: String(orderId),
      description: `Pedido #${orderId} - ${restaurantName}`,
    }),
  });

  return charge.id;
}

export async function getPixQrCode(chargeId: string): Promise<AsaasPixQrCode> {
  return asaasFetch<AsaasPixQrCode>(`/payments/${chargeId}/pixQrCode`);
}
