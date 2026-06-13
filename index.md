# Index - Mapa de Evolucao do ZapFood

Este arquivo e o ponto de partida para continuar o projeto sem se perder. Ele organiza a sequencia de implementacao, os documentos de apoio e o que deve ser atualizado a cada ciclo.

## 1. Ordem de Leitura

1. [README.md](README.md)
2. [saas-modelo-foods.md](saas-modelo-foods.md)
3. [ingredientes-personalizados.md](ingredientes-personalizados.md)
4. [compartilhe-ganhe.md](compartilhe-ganhe.md)
5. [instalando.md](instalando.md)
6. [links.md](links.md)
7. [configs/dicas.md](configs/dicas.md)

## 2. Documentos Principais

| Documento | Uso | Quando abrir |
| --- | --- | --- |
| [README.md](README.md) | Setup e comandos do projeto | Para rodar, instalar, validar e lembrar credenciais locais |
| [saas-modelo-foods.md](saas-modelo-foods.md) | Roteiro principal do SaaS | Sempre antes de escolher a proxima tarefa |
| [ingredientes-personalizados.md](ingredientes-personalizados.md) | Personalizacao, adicionais e alergias | Ao mexer em produto, sacola, pedido ou cozinha |
| [compartilhe-ganhe.md](compartilhe-ganhe.md) | Avaliacao, indicacao, carteira e pontos | Ao mexer em cliente, fidelidade ou crescimento |
| [instalando.md](instalando.md) | Historico de comandos e setup original | Quando precisar reinstalar ou revisar Prisma/ShadCN |
| [links.md](links.md) | Referencias externas do projeto base | Quando precisar consultar Figma, aula ou repo original |
| [configs/dicas.md](configs/dicas.md) | Dicas rapidas de Prisma | Quando alterar schema ou migrations |

## 3. Sequencia Recomendada Atual

### Fase Atual - Pedidos Admin

- [ ] Criar detalhe admin do pedido em `/admin/orders/{orderId}`
- [ ] Mostrar cliente, mesa, status, total e itens
- [ ] Mostrar ingredientes removidos, adicionais e observacoes quando existirem
- [ ] Mostrar alerta de alergia quando existir
- [ ] Criar filtros avancados em `/admin/orders`
- [ ] Filtrar por status
- [ ] Filtrar por mesa
- [ ] Filtrar por data
- [ ] Filtrar por cliente

### Proxima Fase - Personalizacao de Produtos

Documento guia: [ingredientes-personalizados.md](ingredientes-personalizados.md)

- [ ] Criar modelagem de ingredientes
- [ ] Criar modelagem de adicionais pagos
- [ ] Criar modelagem de remocao de ingredientes
- [ ] Criar modelagem de alergias
- [ ] Criar `/admin/ingredients`
- [ ] Criar configuracao de ingredientes por produto
- [ ] Atualizar tela do produto do cliente
- [ ] Atualizar sacola com resumo de personalizacao
- [ ] Atualizar pedido/cozinha com personalizacoes

### Fase Seguinte - Cliente e Pedido Atual

- [ ] Criar `/{slug}/order/{orderId}`
- [ ] Mostrar status atual do pedido para cliente
- [ ] Mostrar mesa vinculada
- [ ] Mostrar itens do pedido
- [ ] Mostrar historico de etapas
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
| 6 | Ingredientes e alergias | [ingredientes-personalizados.md](ingredientes-personalizados.md) | Planejado |
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
| UI | `src/components/ui` |
| Auth | `src/lib/admin-auth.ts`, `src/lib/password.ts` |
| Roteiro | `saas-modelo-foods.md`, `ingredientes-personalizados.md`, `compartilhe-ganhe.md` |

## 10. Regra de Atualizacao

Sempre que uma etapa for entregue:

- [ ] Marcar `[x]` no documento especifico
- [ ] Marcar `[x]` no [saas-modelo-foods.md](saas-modelo-foods.md)
- [ ] Ajustar totais do resumo executivo se criar novas telas/modulos
- [ ] Atualizar a proxima prioridade neste arquivo quando necessario
