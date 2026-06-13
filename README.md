# ZapFood

Self-checkout de restaurante feito com Next.js, TypeScript, Prisma, Neon, Tailwind CSS e ShadCN UI.

## Mapa do Projeto

Use [index.md](index.md) como ponto de partida para acompanhar a sequencia de implementacao e os documentos de apoio.

## Funcionalidades

- Página pública do restaurante por `slug`
- Escolha de consumo: comer no local ou para levar
- Cardápio por categorias
- Detalhe do produto com quantidade
- Sacola de compras
- Finalização de pedido com nome e CPF
- Acompanhamento de pedidos por CPF
- Integração opcional com Stripe

## Rodando localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie o `.env` usando o exemplo:

```bash
cp .env.example .env
```

3. Configure `DATABASE_URL` no `.env`.

4. Sincronize e gere o Prisma Client:

```bash
npx prisma migrate deploy
npx prisma generate
```

5. Popule o banco:

```bash
npx prisma db seed
```

6. Rode o projeto:

```bash
npm run dev
```

Abra `http://localhost:3000`. A rota inicial mostra a tela start do ZapFood e o acesso de cliente segue para `/zap-food`.

## Stripe

Stripe é opcional no ambiente local. Sem `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, o app cria o pedido e redireciona direto para a tela de pedidos.

Para ativar checkout real, configure:

```bash
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=""
STRIPE_WEBHOOK_SECRET_KEY=""
```

## Admin

O painel admin fica em:

```bash
http://localhost:3000/admin/login
```

Credenciais iniciais criadas pela seed:

```bash
admin@zapfood.local
admin123
```

Troque a senha antes de usar em producao.

## Scripts Úteis

```bash
npm run dev
npm run build
npm run lint
npx prisma studio
```
