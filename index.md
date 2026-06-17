# Index - Mapa de Evolucao do ZapFood

Este arquivo e o ponto de partida para continuar o projeto sem se perder. Ele organiza a sequencia de implementacao, os documentos de apoio e o que deve ser atualizado a cada ciclo.

## 1. Ordem de Leitura

1. [README.md](README.md)
2. [saas-modelo-foods.md](saas-modelo-foods.md)
3. [ingredientes-personalizados.md](ingredientes-personalizados.md)
4. [compartilhe-ganhe.md](compartilhe-ganhe.md)
5. [asaas-pagamentos.md](asaas-pagamentos.md)
6. [instalando.md](instalando.md)
7. [links.md](links.md)
8. [configs/dicas.md](configs/dicas.md)

## 2. Documentos Principais

| Documento | Uso | Quando abrir |
| --- | --- | --- |
| [README.md](README.md) | Setup e comandos do projeto | Para rodar, instalar, validar e lembrar credenciais locais |
| [saas-modelo-foods.md](saas-modelo-foods.md) | Roteiro principal do SaaS | Sempre antes de escolher a proxima tarefa |
| [ingredientes-personalizados.md](ingredientes-personalizados.md) | Personalizacao, adicionais e alergias | Ao mexer em produto, sacola, pedido ou cozinha |
| [compartilhe-ganhe.md](compartilhe-ganhe.md) | Avaliacao, indicacao, carteira e pontos | Ao mexer em cliente, fidelidade ou crescimento |
| [asaas-pagamentos.md](asaas-pagamentos.md) | Fluxo PIX ASAAS, webhook e checklist de testes | Ao mexer em pagamentos, cobranca ou status de pedido |
| [instalando.md](instalando.md) | Historico de comandos e setup original | Quando precisar reinstalar ou revisar Prisma/ShadCN |
| [links.md](links.md) | Referencias externas do projeto base | Quando precisar consultar Figma, aula ou repo original |
| [configs/dicas.md](configs/dicas.md) | Dicas rapidas de Prisma | Quando alterar schema ou migrations |

## 3. Sequencia Recomendada Atual

Personalizacao de produtos (Fase 1-3) concluida em 2026-06-14. Tambem em 2026-06-14,
foram resolvidos os itens pendentes de pagamento (expiracao do PIX), pedidos admin
(filtro por mesa, cancelar com motivo), cozinha (coluna entregue, destaque de
atraso), cardapio (busca e produtos indisponiveis) e dashboard (ticket medio,
produtos mais vendidos) - ver `### Fase Concluida - Pagamento, Pedidos, Cozinha,
Cardapio e Dashboard` abaixo. Proxima prioridade: finalizar validacao manual do
pagamento ASAAS (webhook em producao + teste real) e, em seguida, iniciar o modulo de
Fidelidade e Pontos ([compartilhe-ganhe.md](compartilhe-ganhe.md)).

### Fase Atual - Pagamento e Pedidos Admin

#### Pagamento ASAAS (pendente validacao)

- [ ] Registrar webhook ASAAS no painel com URL de producao
- [ ] Testar pagamento PIX real de ponta a ponta
- [ ] Validar badge "Pago" aparece no historico do cliente apos confirmacao
- [x] Exibir expiracao do QR code na tela do cliente

#### Detalhe Admin do Pedido

- [x] Criar detalhe admin do pedido em `/admin/orders/{orderId}`
- [x] Mostrar cliente, mesa, status, total e itens
- [x] Mostrar numero do pedido (#0042)
- [x] Mostrar status de pagamento (confirmado / aguardando) com ID da cobranca ASAAS
- [x] Mostrar ingredientes removidos, adicionais e observacoes quando existirem
- [x] Mostrar alerta de alergia quando existir
- [x] Criar filtros em `/admin/orders`
- [x] Filtrar por status
- [x] Filtrar por mesa
- [x] Filtrar por data (hoje, semana, mes, todos)
- [x] Buscar por nome do cliente

### Fase Concluida - Pagamento, Pedidos, Cozinha, Cardapio e Dashboard

Documento guia: [saas-modelo-foods.md](saas-modelo-foods.md) (Registro de Evolucao 2026-06-14)

- [x] Migration `add_pix_expiration_and_cancel_reason` (`pixExpiresAt`,
  `cancellationReason` em `Order`)
- [x] Exibir expiracao do QR code PIX no drawer de finalizacao e em
  `/{slug}/order/{orderId}`
- [x] Filtro por mesa em `/admin/orders`
- [x] Cancelar pedido com motivo em `/admin/orders` e `/admin/orders/{orderId}`
- [x] Coluna "Entregues" e destaque de pedidos atrasados em `/admin/kitchen`
- [x] Busca por texto e produtos indisponiveis visiveis (com badge) em `/{slug}/menu`
- [x] Metricas "Ticket medio" e "Produtos mais vendidos" em `/admin/dashboard`

### Fase Concluida - Personalizacao de Produtos

Documento guia: [ingredientes-personalizados.md](ingredientes-personalizados.md)

- [x] Criar modelagem de ingredientes
- [x] Criar modelagem de adicionais pagos
- [x] Criar modelagem de remocao de ingredientes
- [x] Criar modelagem de alergias
- [x] Criar `/admin/ingredients`
- [x] Criar configuracao de ingredientes por produto
- [x] Atualizar tela do produto do cliente
- [x] Atualizar sacola com resumo de personalizacao
- [x] Atualizar pedido/cozinha com personalizacoes

### Fase Seguinte - Cliente e Pedido Atual

- [x] Criar `/{slug}/order/{orderId}`
- [x] Mostrar status atual do pedido para cliente (progress steps com icons)
- [x] Mostrar mesa vinculada
- [x] Mostrar itens do pedido
- [x] Auto-refresh a cada 8 segundos para atualizar status
- [x] Link do numero do pedido em /{slug}/orders para /{slug}/order/{id}
- [x] Botao "Acompanhar pedido" no dialog PIX vai direto para o status
- [ ] Mostrar historico de etapas com timestamps
- [ ] Mostrar pagamento e pontos futuramente

### Fase Seguinte - Fidelidade e Pontos

Documento guia: [compartilhe-ganhe.md](compartilhe-ganhe.md)

- [ ] Criar `Customer`
- [ ] Criar carteira de pontos
- [ ] Criar extrato de pontos
- [ ] Criar avaliacao de pedido
- [ ] Creditar pontos por avaliacao
- [ ] Criar link de indicacao
- [ ] Criar compartilhamento por WhatsApp
- [ ] Criar fluxo inicial para Instagram
- [ ] Permitir usar pontos no checkout

### Fase Seguinte - Caixa e Pagamento

- [ ] Criar modulo admin de caixa
- [ ] Registrar pagamento manual
- [ ] Registrar PIX
- [ ] Registrar dinheiro
- [ ] Registrar cartao presencial
- [ ] Permitir pagamento parcial com pontos
- [ ] Permitir pagamento total com pontos
- [ ] Criar fechamento de caixa

### Fase Seguinte - Relatorios e SaaS

- [ ] Relatorio de vendas
- [ ] Relatorio de produtos
- [ ] Relatorio de mesas
- [ ] Relatorio de clientes
- [ ] Relatorio de pontos
- [ ] Planos e assinaturas
- [ ] Onboarding de estabelecimento
- [ ] Multi-tenant completo

## 4. Mapa de Modulos

| Ordem | Modulo | Documento guia | Status atual |
| ---: | --- | --- | --- |
| 1 | Base do cliente mobile | [saas-modelo-foods.md](saas-modelo-foods.md) | Parcial feito |
| 2 | Admin operacional | [saas-modelo-foods.md](saas-modelo-foods.md) | Parcial feito |
| 3 | Pedidos e cozinha | [saas-modelo-foods.md](saas-modelo-foods.md) | Parcial feito |
| 4 | Mesas e QR code | [saas-modelo-foods.md](saas-modelo-foods.md) | Parcial feito |
| 5 | Produtos e categorias | [saas-modelo-foods.md](saas-modelo-foods.md) | Parcial feito |
| 6 | Ingredientes e alergias | [ingredientes-personalizados.md](ingredientes-personalizados.md) | Concluido (Fase 1-3) |
| 7 | Avaliacao e pontos | [compartilhe-ganhe.md](compartilhe-ganhe.md) | Planejado |
| 8 | Caixa e pagamentos | [saas-modelo-foods.md](saas-modelo-foods.md) | Planejado |
| 9 | Relatorios | [saas-modelo-foods.md](saas-modelo-foods.md) | Planejado |
| 10 | SaaS comercial | [saas-modelo-foods.md](saas-modelo-foods.md) | Planejado |

## 5. Rotina de Cada Ciclo

Antes de implementar:

- [ ] Abrir este `index.md`
- [ ] Abrir [saas-modelo-foods.md](saas-modelo-foods.md)
- [ ] Conferir a proxima prioridade
- [ ] Abrir documento de apoio quando existir
- [ ] Mapear arquivos afetados

Durante a implementacao:

- [ ] Alterar schema Prisma quando necessario
- [ ] Criar migration quando alterar banco
- [ ] Criar actions server-side com validacao de restaurante/sessao
- [ ] Criar ou atualizar telas
- [ ] Atualizar roteiro/checklist

Depois de implementar:

- [ ] Rodar `npx prisma migrate deploy`
- [ ] Rodar `npx prisma generate`
- [ ] Rodar `npm run build`
- [ ] Rodar `npm run lint`
- [ ] Testar rotas principais por HTTP ou browser
- [ ] Atualizar [saas-modelo-foods.md](saas-modelo-foods.md)
- [ ] Atualizar documento de apoio correspondente
- [ ] Atualizar este `index.md` se a ordem mudar

## 6. Comandos Base

```bash
npm install
npm run dev
npm run build
npm run lint
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npx prisma studio
```

### Problema conhecido: dev server travado

Se `npm run dev` ja estiver rodando ha muito tempo (varias sessoes), requests para
rotas ainda nao compiladas (ex.: `/{slug}/menu/{productid}`, `/admin/login`) podem
travar sem resposta, mesmo com `/` e `/{slug}` respondendo normalmente. Sintoma:
varios processos `node.exe` extras e duas entradas escutando a porta 3000
(`netstat -ano | grep :3000`). Solucao: finalizar os processos que escutam a porta
3000 e rodar `npm run dev` novamente.

## 7. Rotas Importantes

### Cliente

- `/`
- `/{slug}`
- `/{slug}/table/{tableCode}`
- `/{slug}/menu?consumptionMethod=DINE_IN&table=MESA-01`
- `/{slug}/menu/{productid}`
- `/{slug}/orders`

### Admin

- `/admin/login`
- `/admin/dashboard`
- `/admin/orders`
- `/admin/kitchen`
- `/admin/tables`
- `/admin/categories`
- `/admin/products`

## 8. Credenciais Locais

Criadas pela seed:

```txt
admin@zapfood.local
admin123
```

Trocar antes de usar em producao.

## 9. Arquivos de Maior Atencao

| Area | Arquivos/Pastas |
| --- | --- |
| Prisma | `prisma/schema.prisma`, `prisma/migrations`, `prisma/seed.ts` |
| Admin | `src/app/admin` |
| Cliente | `src/app/[slug]` |
| Pedido | `src/app/[slug]/menu/actions`, `src/app/admin/actions` |
| Pagamento | `src/lib/asaas.ts`, `src/app/[slug]/menu/actions/create-asaas-charge.ts`, `src/app/api/webhooks/asaas/route.ts` |
| UI / Shell | `src/components/app-shell.tsx`, `src/components/app-shell.module.css` |
| UI | `src/components/ui` |
| Auth | `src/lib/admin-auth.ts`, `src/lib/password.ts` |
| Roteiro | `saas-modelo-foods.md`, `ingredientes-personalizados.md`, `compartilhe-ganhe.md`, `asaas-pagamentos.md` |

## 10. Regra de Atualizacao

Sempre que uma etapa for entregue:

- [ ] Marcar `[x]` no documento especifico
- [ ] Marcar `[x]` no [saas-modelo-foods.md](saas-modelo-foods.md)
- [ ] Ajustar totais do resumo executivo se criar novas telas/modulos
- [ ] Atualizar a proxima prioridade neste arquivo quando necessario
