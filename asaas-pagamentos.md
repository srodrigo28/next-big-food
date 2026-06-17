# ASAAS - Pagamentos PIX

Documento de controle do modulo de pagamentos via ASAAS no ZapFood. O fluxo inicial cobre cobranca PIX com QR Code gerado no momento do pedido e confirmacao automatica via webhook.

Use este arquivo como checklist:

- `[x]` concluido
- `[ ]` pendente

Documento vinculado ao roteiro principal: [saas-modelo-foods.md](saas-modelo-foods.md)

---

## 1. Variaveis de Ambiente

Todas ja configuradas no `.env`:

| Variavel | Descricao |
| --- | --- |
| `API_ASAAS_URL` | URL base da API (`https://api.asaas.com/v3`) |
| `API_ASAAS_KEY` | Chave de acesso da conta ASAAS |
| `WEBHOOK_ASAAS_TOKEN` | Token de validacao dos webhooks recebidos |

- [x] Variaveis definidas no `.env`
- [ ] Variaveis definidas no ambiente de producao / Vercel
- [ ] Chave ASAAS validada em conta real (nao sandbox)

---

## 2. Arquivos Criados

| Arquivo | Funcao |
| --- | --- |
| `src/lib/asaas.ts` | Cliente da API ASAAS (customer, charge, QR code) |
| `src/app/[slug]/menu/actions/create-asaas-charge.ts` | Server action: cria cobranca e retorna QR code |
| `src/app/api/webhooks/asaas/route.ts` | Endpoint de webhook: confirma pagamento no banco |

### Arquivo modificado

| Arquivo | O que mudou |
| --- | --- |
| `prisma/schema.prisma` | Campo `asaasChargeId String?` adicionado ao model `Order` |
| `src/app/[slug]/menu/components/finish-order-dialog.tsx` | Substituiu Stripe pelo fluxo PIX ASAAS com tela de QR code |
| `src/app/[slug]/orders/components/order-list.tsx` | Exibe numero do pedido, todos os status, badge de pagamento confirmado |
| `src/app/[slug]/menu/contexts/cart.tsx` | Adicionado `clearCart()` ao contexto |

---

## 3. Fluxo Completo PIX

### 3.1 Sequencia do Cliente

```
1. Cliente abre a sacola
2. Clica em "Finalizar pedido"
3. Preenche nome e CPF
4. Clica em "Gerar QR Code PIX"
5. [server] createOrder() - cria pedido no banco com status PENDING
6. [server] createAsaasCharge():
   a. findOrCreateCustomer(nome, cpf) -> busca por CPF no ASAAS ou cria novo
   b. createPixCharge(customerId, valor, orderId, nomeRestaurante)
      -> POST /payments com billingType: PIX e externalReference: orderId
   c. salva asaasChargeId no pedido (Order.asaasChargeId)
   d. getPixQrCode(chargeId) -> GET /payments/{id}/pixQrCode
7. Tela exibe QR Code (imagem base64) e codigo copia-e-cola
8. Cliente paga pelo banco
9. ASAAS dispara webhook PAYMENT_RECEIVED
10. [server] route.ts atualiza pedido para PAYMENT_CONFIRMED
11. revalidatePath() atualiza paginas de pedidos e admin
```

### 3.2 Sequencia do Webhook

```
POST /api/webhooks/asaas
Headers: asaas-access-token: {WEBHOOK_ASAAS_TOKEN}

Body:
{
  "event": "PAYMENT_RECEIVED",
  "payment": {
    "id": "pay_xxx",
    "externalReference": "42",   <- orderId do banco
    "status": "RECEIVED"
  }
}
```

Eventos que confirmam pagamento:
- `PAYMENT_RECEIVED`
- `PAYMENT_CONFIRMED`
- `PAYMENT_APPROVED_BY_RISK_ANALYSIS`

Eventos que marcam falha:
- `PAYMENT_REFUSED`
- `PAYMENT_DELETED`

---

## 4. API ASAAS - Endpoints Usados

### 4.1 Buscar cliente por CPF

```
GET /customers?cpfCnpj={cpf}&limit=1
Headers: access_token: {API_ASAAS_KEY}

Resposta:
{
  "data": [{ "id": "cus_xxx", "name": "...", "cpfCnpj": "..." }]
}
```

### 4.2 Criar cliente

```
POST /customers
{
  "name": "Nome do Cliente",
  "cpfCnpj": "12345678901"
}

Resposta:
{ "id": "cus_xxx" }
```

### 4.3 Criar cobranca PIX

```
POST /payments
{
  "customer": "cus_xxx",
  "billingType": "PIX",
  "value": 35.90,
  "dueDate": "2026-06-14",
  "externalReference": "42",
  "description": "Pedido #42 - ZapFood"
}

Resposta:
{ "id": "pay_xxx", "status": "PENDING", ... }
```

### 4.4 Obter QR Code PIX

```
GET /payments/{pay_xxx}/pixQrCode

Resposta:
{
  "encodedImage": "base64...",    <- imagem PNG em base64
  "payload": "00020126...",       <- codigo copia-e-cola
  "expirationDate": "2026-06-14T23:59:59"
}
```

---

## 5. Campo asaasChargeId no Banco

Migration aplicada: `20260613235811_add_asaas_charge_id`

```prisma
model Order {
  ...
  asaasChargeId String?   <- id da cobranca no ASAAS (pay_xxx)
  ...
}
```

Usos atuais:
- Salvo no pedido logo apos criar a cobranca
- Pode ser usado futuramente para consultar status, cancelar ou reemitir

---

## 6. Numero do Pedido

O campo `id` do `Order` ja e auto-incremento (`Int @default(autoincrement())`).
Exibido na interface como `#0042` (padStart 4 zeros).

- [x] Exibido na tela de QR code apos finalizacao: "Pedido #42 criado!"
- [x] Exibido na lista de pedidos do cliente: `Pedido #0042`
- [x] Exibido na tela admin de pedidos: `Pedido #42`
- [ ] Exibir numero na cozinha (Kanban)
- [ ] Exibir numero na impressao do pedido (futuro)

---

## 7. Status de Pagamento

Fluxo de status relacionado ao pagamento:

| Status | Quando | Visivel para |
| --- | --- | --- |
| `PENDING` | Pedido criado, aguardando PIX | Cliente e admin |
| `PAYMENT_CONFIRMED` | Webhook recebido, PIX pago | Cliente (verde) e admin |
| `PAYMENT_FAILED` | Webhook de recusa recebido | Cliente e admin |
| `IN_PREPARATION` | Admin avancos operacao | Cliente e admin |
| `READY` | Pedido pronto | Cliente e admin |
| `DELIVERED` | Pedido entregue | Cliente e admin |
| `FINISHED` | Pedido finalizado | Cliente e admin |
| `CANCELLED` | Pedido cancelado | Cliente e admin |

Badge "Pagamento confirmado" aparece no historico do cliente sempre que o status for `PAYMENT_CONFIRMED`, `IN_PREPARATION`, `READY`, `DELIVERED` ou `FINISHED`.

---

## 8. Configuracao do Webhook no Painel ASAAS

- [x] URL do webhook definida no `.env`: `https://99dev.pro/bucket/api/asaas/webhook`
- [ ] URL registrada no painel ASAAS (Configuracoes > Integracoes > Webhooks)
- [ ] Token `WEBHOOK_ASAAS_TOKEN` configurado no painel ASAAS
- [ ] Teste de disparo manual realizado pelo painel ASAAS
- [ ] Pagamento real testado de ponta a ponta

### Como configurar no painel ASAAS

1. Acesse asaas.com > sua conta
2. Configuracoes > Integracoes > Webhooks
3. Adicionar webhook:
   - URL: `https://seu-dominio.com/api/webhooks/asaas`
   - Token de autenticacao: valor de `WEBHOOK_ASAAS_TOKEN`
   - Eventos: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_REFUSED`, `PAYMENT_DELETED`

---

## 9. Checklist de Testes

### Fluxo basico

- [ ] Cliente preenche nome e CPF valido
- [ ] Pedido e criado no banco com status `PENDING`
- [ ] Cliente ASAAS e criado ou encontrado por CPF
- [ ] Cobranca PIX e criada no ASAAS com valor correto
- [ ] `asaasChargeId` e salvo no pedido
- [ ] QR Code e exibido na tela
- [ ] Codigo copia-e-cola e copiado corretamente
- [ ] Pagamento realizado via PIX
- [ ] Webhook recebido com `PAYMENT_RECEIVED`
- [ ] Token validado no header `asaas-access-token`
- [ ] Pedido atualizado para `PAYMENT_CONFIRMED` no banco
- [ ] Lista de pedidos do cliente mostra badge verde "Pago"
- [ ] Admin ve pedido como "Pago" na tela de pedidos

### Casos de erro

- [ ] CPF invalido bloqueado pelo formulario
- [ ] Falha na API ASAAS exibe toast de erro para o cliente
- [ ] Webhook com token errado retorna 401
- [ ] Webhook com `externalReference` invalido nao quebra o sistema
- [ ] Pedido com pagamento recusado exibe status correto

### Multiplos pedidos

- [ ] Mesmo CPF gera cliente ASAAS existente (nao duplica)
- [ ] Dois pedidos do mesmo cliente geram cobranças separadas
- [ ] Webhook identifica pedido correto pelo `externalReference`

---

## 10. Proximos Passos

- [ ] Registrar webhook no painel ASAAS com a URL de producao
- [ ] Testar fluxo completo em ambiente real
- [ ] Adicionar timeout / retry na geracao do QR code
- [ ] Exibir tempo de expiracao do PIX na tela do cliente
- [ ] Permitir reemitir QR code se expirado
- [ ] Adicionar pagamento por cartao de credito via ASAAS (billingType: CREDIT_CARD)
- [ ] Adicionar boleto via ASAAS (billingType: BOLETO)
- [ ] Criar modulo de caixa admin para registrar pagamento presencial (dinheiro, cartao maquininha)
- [ ] Consultar status da cobranca ASAAS periodicamente (polling) para atualizar cliente em tempo real
- [ ] Implementar SSE ou WebSocket para push de atualizacao de status

---

## 11. Registro

### 2026-06-13

- [x] Fluxo PIX ASAAS implementado do zero
- [x] QR code exibido na tela de finalizacao do pedido
- [x] Webhook de confirmacao implementado
- [x] Numero do pedido exibido em todas as telas do cliente
- [x] Todos os status de pedido exibidos com labels e cores corretas
- [x] clearCart() adicionado ao contexto do carrinho
- [x] Campo asaasChargeId adicionado ao banco (migration aplicada)
- [ ] Webhook registrado no painel ASAAS
- [ ] Teste ponta a ponta realizado
