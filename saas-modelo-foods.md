# SaaS Modelo Foods - Roteiro de Evolucao

Documento de controle para transformar o projeto atual em uma plataforma SaaS para restaurantes, com modulo cliente mobile-first e modulo admin web para operacao do estabelecimento.

Use este arquivo como checklist de continuidade:

- `[x]` concluido
- `[ ]` pendente
- Atualize a data, observacoes e proximas prioridades ao final de cada ciclo

Documentos de apoio:

- [Ingredientes personalizados, adicionais e alergias](ingredientes-personalizados.md)

## Resumo Executivo

### Progresso Geral

- Modulos macro previstos: 12
- Modulos com base funcional entregue: 7
- Modulos ainda sem base funcional: 5
- Telas/rotas previstas: 26
- Telas/rotas feitas: 14
- Telas/rotas pendentes: 12
- Proxima prioridade: criar detalhe admin do pedido e filtros avancados

### Resumo por Modulo

| Modulo | Status | Feito | Proximo passo |
| --- | --- | --- | --- |
| SaaS multi-estabelecimento | Parcial | Base por restaurante/slug | Isolamento completo por tenant |
| Banco e modelagem | Parcial | Restaurante, produtos, pedidos, usuarios, mesas | Customer, pagamentos, sessoes de mesa, auditoria |
| Cliente mobile | Parcial | Home, consumo, menu, produto, sacola, pedido, historico | QR code de mesa e pedido em tempo real |
| Admin web | Parcial | Login, layout, dashboard, pedidos, cozinha, mesas, produtos, categorias | Usuarios, relatorios e configuracoes |
| Autenticacao admin | Parcial | Login, logout, sessao httpOnly, usuario vinculado ao restaurante | Recuperacao de senha e permissoes por perfil |
| Cardapio e cadastros | Parcial | Cardapio publico, CRUD admin de categorias/produtos | Ingredientes personalizados, adicionais, alergias |
| Pedidos | Parcial | Criacao, historico, admin pedidos, troca de status | Detalhe do pedido e filtros avancados |
| Mesas e QR code | Parcial | Modelo de mesa, cadastro admin, status operacional | Abrir mesa via QR e vincular pedido a mesa |
| Cozinha e preparo | Parcial | Tela cozinha com colunas e avanco de status | Setores, atrasos, notificacoes e tempos |
| Caixa e pagamentos | Pendente | Stripe opcional no checkout cliente | Caixa admin, PIX, dinheiro, cartao presencial |
| Relatorios | Pendente | Nenhum relatorio dedicado | Vendas, produtos, mesas, clientes e exportacoes |
| Operacao, testes e deploy | Pendente | Build, lint e migrations manuais | Testes E2E, logs, staging e producao |

### Resumo de Telas/Rotas

| Area | Previstas | Feitas | Pendentes |
| --- | ---: | ---: | ---: |
| Cliente | 10 | 6 | 4 |
| Admin | 16 | 8 | 8 |
| Total | 26 | 14 | 12 |

### Telas Cliente

- [x] `/`
- [x] `/{slug}`
- [x] `/{slug}/menu`
- [x] `/{slug}/menu/{productid}`
- [x] `/{slug}/orders`
- [ ] `/{slug}/order/{orderId}`
- [x] `/{slug}/table/{tableCode}`
- [ ] `/{slug}/checkout`
- [ ] `/{slug}/payment/success`
- [ ] `/{slug}/payment/cancel`

### Telas Admin

- [x] `/admin/login`
- [x] `/admin`
- [x] `/admin/dashboard`
- [x] `/admin/orders`
- [x] `/admin/kitchen`
- [x] `/admin/tables`
- [ ] `/admin/restaurants`
- [ ] `/admin/restaurants/{restaurantId}`
- [ ] `/admin/orders/{orderId}`
- [x] `/admin/products`
- [x] `/admin/categories`
- [ ] `/admin/customers`
- [ ] `/admin/reports`
- [ ] `/admin/settings`
- [ ] `/admin/users`
- [ ] `/admin/billing`

## 0. Estado Atual

- [x] Projeto Next.js com TypeScript configurado
- [x] Prisma ORM configurado
- [x] Banco Neon conectado
- [x] Seed inicial com restaurante, categorias e produtos
- [x] Pagina publica por slug do restaurante
- [x] Escolha de consumo: comer no local ou para levar
- [x] Menu por categorias
- [x] Detalhe do produto
- [x] Sacola/carrinho em contexto React
- [x] Criacao de pedido com nome e CPF
- [x] Historico de pedidos por CPF
- [x] Checkout Stripe opcional
- [x] Webhook Stripe inicial
- [x] README, `.env.example` e migration de pedidos atualizados

## 1. Visao SaaS

Objetivo: permitir que varios estabelecimentos usem a mesma plataforma, cada um com seus dados, usuarios, mesas, produtos, pedidos e configuracoes.

- [ ] Definir conceito de `Tenant` ou usar `Restaurant` como entidade principal do SaaS
- [ ] Garantir isolamento de dados por restaurante
- [ ] Criar plano de permissoes por estabelecimento
- [ ] Definir dominios/subdominios por restaurante
- [ ] Definir rotas publicas por slug: `/{slug}`
- [ ] Definir rotas admin por slug: `/admin/{slug}` ou `/dashboard`
- [ ] Definir politicas de assinatura e planos
- [ ] Criar estrategia para onboarding de novos restaurantes

## 2. Modelagem do Banco

Objetivo: preparar o schema para cadastros completos, operacao de pedidos e historico.

- [x] `Restaurant`
- [x] `MenuCategory`
- [x] `Product`
- [x] `Order`
- [x] `OrderProduct`
- [x] `User`
- [x] `RestaurantUser`
- [x] `Role`
- [ ] `Permission`
- [ ] `Customer`
- [x] `Table`
- [ ] `TableSession`
- [ ] `KitchenQueue`
- [ ] `Payment`
- [ ] `Address`
- [ ] `RestaurantSettings`
- [ ] `OpeningHour`
- [ ] `AuditLog`
- [ ] `Subscription`
- [ ] `Plan`

### Campos a revisar

- [ ] Trocar dinheiro de `Float` para `Decimal`
- [ ] Padronizar CPF/telefone/email do cliente
- [ ] Adicionar numero ou codigo humano para pedido
- [x] Adicionar origem do pedido: mesa, balcao, delivery, retirada
- [ ] Adicionar timestamps de preparo: recebido, aceito, em preparo, pronto, entregue, cancelado
- [ ] Adicionar observacoes por item e por pedido
- [ ] Adicionar status de pagamento separado do status operacional

## 3. Modulo Cliente - Mobile First

Objetivo: experiencia simples para o cliente fazer pedido pelo celular via QR code, link ou slug do restaurante.

Detalhamento de personalizacao de ingredientes, adicionais e alergias: [ingredientes-personalizados.md](ingredientes-personalizados.md).

### Entrada

- [x] Acessar restaurante por slug
- [x] Escolher consumo: comer no local ou para levar
- [x] Ler mesa via QR code com parametro: `?table=10`
- [x] Validar mesa ativa
- [ ] Criar sessao de mesa
- [ ] Mostrar status da mesa
- [ ] Mostrar aviso se estabelecimento estiver fechado

### Cardapio

- [x] Listar categorias
- [x] Listar produtos por categoria
- [x] Detalhar produto
- [x] Adicionar item na sacola
- [ ] Buscar produto por texto
- [ ] Filtrar por disponibilidade
- [ ] Exibir adicionais/opcionais
- [ ] Exibir observacao por item
- [ ] Exibir produtos indisponiveis com bloqueio visual
- [ ] Exibir combos e promocoes

### Sacola

- [x] Ver itens da sacola
- [x] Alterar quantidade
- [x] Remover item
- [x] Calcular total
- [ ] Persistir sacola em `localStorage`
- [ ] Separar subtotal, taxa de servico, desconto e total
- [ ] Permitir observacao geral do pedido
- [ ] Bloquear finalizacao se produto ficar indisponivel

### Identificacao

- [x] Finalizar com nome e CPF
- [ ] Permitir telefone
- [ ] Permitir email
- [ ] Criar cadastro simples de cliente
- [ ] Permitir cliente consultar pedidos por telefone/CPF
- [ ] Permitir cliente salvar dados para proxima compra

### Pedido

- [x] Criar pedido
- [x] Consultar historico por CPF
- [ ] Tela de pedido atual em tempo real
- [ ] Mostrar etapas: recebido, em preparo, pronto, entregue
- [ ] Mostrar tempo estimado
- [ ] Permitir cancelar se ainda nao aceito
- [ ] Permitir chamar atendente
- [ ] Permitir pedir mais itens na mesma mesa/sessao

### Pagamento

- [x] Checkout Stripe opcional
- [ ] Pagamento na mesa
- [ ] Pagamento no balcao
- [ ] PIX
- [ ] Cartao online
- [ ] Dividir conta por pessoa
- [ ] Registrar comprovante/transacao

## 4. Modulo Admin - Web

Objetivo: painel para o estabelecimento controlar operacao, cadastros, mesas, pedidos, cozinha e historico.

### Acesso e Usuarios

- [x] Login do admin
- [x] Logout
- [ ] Recuperacao de senha
- [x] Cadastro de usuario por estabelecimento
- [x] Perfil: dono
- [ ] Perfil: gerente
- [ ] Perfil: caixa
- [ ] Perfil: cozinha
- [ ] Perfil: garcom
- [ ] Controle de permissoes por tela/acao

### Dashboard

- [x] Resumo de pedidos do dia
- [x] Faturamento do dia
- [x] Pedidos pendentes
- [x] Pedidos em preparo
- [x] Pedidos prontos
- [ ] Ticket medio
- [ ] Produtos mais vendidos
- [ ] Alertas operacionais

### Cadastros

- [ ] Modulo de ingredientes personalizados conforme [ingredientes-personalizados.md](ingredientes-personalizados.md)
- [ ] Cadastro de restaurante
- [ ] Edicao de dados do restaurante
- [ ] Upload/URL de logo
- [ ] Upload/URL de capa
- [x] Cadastro de categorias
- [x] Cadastro de produtos
- [x] Edicao de produtos
- [x] Ativar/desativar produto
- [x] Marcar produto como indisponivel
- [ ] Cadastro de adicionais
- [ ] Cadastro de combos
- [ ] Cadastro de promocoes
- [x] Cadastro de mesas
- [ ] Geracao de QR code por mesa
- [ ] Cadastro de horarios de funcionamento
- [ ] Configuracoes de taxas

### Pedidos

- [ ] Listagem de pedidos em tempo real
- [ ] Filtros por status
- [ ] Filtros por mesa
- [ ] Filtros por data
- [ ] Filtros por cliente
- [ ] Detalhe do pedido
- [ ] Aceitar pedido
- [ ] Recusar pedido
- [x] Enviar para preparo
- [x] Marcar como pronto
- [x] Marcar como entregue
- [ ] Cancelar pedido com motivo
- [ ] Reimprimir pedido
- [ ] Adicionar item manualmente pelo admin
- [ ] Editar item antes de aceitar

### Mesas

- [x] Listagem de mesas
- [x] Status da mesa: livre
- [x] Status da mesa: ocupada
- [x] Status da mesa: aguardando pedido
- [x] Status da mesa: em atendimento
- [x] Status da mesa: aguardando pagamento
- [x] Abrir mesa manualmente
- [x] Fechar mesa
- [ ] Transferir mesa
- [ ] Juntar mesas
- [ ] Ver consumo por mesa
- [x] Liberar mesa apos pagamento

### Cozinha / Preparo

- [x] Tela Kanban de preparo
- [x] Coluna: novos pedidos
- [x] Coluna: em preparo
- [x] Coluna: pronto
- [ ] Coluna: entregue
- [x] Ordenar por horario de entrada
- [ ] Destacar pedidos atrasados
- [ ] Separar por setor: cozinha, bebidas, sobremesas
- [ ] Emitir som/notificacao para pedido novo
- [x] Botao de avancar etapa
- [ ] Historico de tempos por etapa

### Caixa e Pagamentos

- [ ] Listar pedidos aguardando pagamento
- [ ] Registrar pagamento manual
- [ ] Registrar PIX
- [ ] Registrar dinheiro
- [ ] Registrar cartao presencial
- [ ] Confirmar pagamento online
- [ ] Estornar/cancelar pagamento
- [ ] Fechamento de caixa
- [ ] Relatorio de pagamentos por metodo

### Relatorios

- [ ] Relatorio de vendas por periodo
- [ ] Relatorio de produtos mais vendidos
- [ ] Relatorio de categorias
- [ ] Relatorio de mesas
- [ ] Relatorio de clientes
- [ ] Relatorio de cancelamentos
- [ ] Relatorio de tempo medio de preparo
- [ ] Exportar CSV
- [ ] Exportar PDF

## 5. Arquitetura de Rotas

### Cliente

- [x] `/`
- [x] `/{slug}`
- [x] `/{slug}/menu`
- [x] `/{slug}/menu/{productid}`
- [x] `/{slug}/orders`
- [ ] `/{slug}/order/{orderId}`
- [x] `/{slug}/table/{tableCode}`
- [ ] `/{slug}/checkout`
- [ ] `/{slug}/payment/success`
- [ ] `/{slug}/payment/cancel`

### Admin

- [x] `/admin/login`
- [x] `/admin`
- [x] `/admin/dashboard`
- [ ] `/admin/restaurants`
- [ ] `/admin/restaurants/{restaurantId}`
- [x] `/admin/orders`
- [ ] `/admin/orders/{orderId}`
- [x] `/admin/kitchen`
- [x] `/admin/tables`
- [x] `/admin/products`
- [x] `/admin/categories`
- [ ] `/admin/customers`
- [ ] `/admin/reports`
- [ ] `/admin/settings`
- [ ] `/admin/users`
- [ ] `/admin/billing`

## 6. Componentes Principais

### Cliente

- [x] `ConsumptionMethodOption`
- [x] `RestaurantHeader`
- [x] `RestaurantCategories`
- [x] `Products`
- [x] `ProductHeader`
- [x] `ProductDetails`
- [x] `CartSheet`
- [x] `CartProductItem`
- [x] `FinishOrderDialog`
- [x] `CpfForm`
- [x] `OrderList`
- [ ] `CurrentOrderStatus`
- [ ] `TableStatus`
- [ ] `ProductSearch`
- [ ] `ProductOptions`
- [ ] `PaymentMethodSelector`

### Admin

- [x] `AdminLayout`
- [x] `AdminSidebar`
- [x] `AdminHeader`
- [x] `MetricCard`
- [x] `OrdersBoard`
- [ ] `OrderDetailsDrawer`
- [x] `KitchenColumn`
- [x] `TableGrid`
- [x] `ProductForm`
- [x] `CategoryForm`
- [ ] `RestaurantForm`
- [ ] `UserForm`
- [ ] `ReportFilters`

## 7. API, Actions e Realtime

- [x] `createOrder`
- [x] `createStripeCheckout`
- [x] `stripe webhook`
- [x] `updateOrderStatus`
- [x] `cancelOrder`
- [x] `assignOrderToTable`
- [ ] `openTableSession`
- [ ] `closeTableSession`
- [x] `createProduct`
- [x] `updateProduct`
- [x] `toggleProductAvailability`
- [x] `createCategory`
- [x] `updateCategory`
- [ ] `createRestaurantUser`
- [ ] `updateRestaurantSettings`
- [ ] Realtime com polling inicial
- [ ] Realtime com WebSocket/SSE
- [ ] Notificacoes para admin
- [ ] Notificacoes para cozinha
- [ ] Notificacoes para cliente

## 8. Autenticacao e Seguranca

- [x] Escolher estrategia de auth: Auth.js, Clerk, Supabase Auth ou custom
- [x] Proteger rotas admin
- [ ] Validar permissoes por restaurante
- [x] Garantir que usuario admin so veja seu estabelecimento
- [x] Validar server-side todas as actions
- [ ] Criar auditoria de acoes criticas
- [ ] Proteger webhooks
- [ ] Sanitizar entradas
- [ ] Rate limit em endpoints sensiveis
- [ ] Revisar variaveis de ambiente

## 9. UX e Interface

- [ ] Padronizar design system
- [ ] Criar layout responsivo mobile-first para cliente
- [ ] Criar layout desktop para admin
- [ ] Criar estados vazios
- [ ] Criar estados de loading
- [ ] Criar feedback de erro
- [ ] Criar feedback de sucesso
- [ ] Melhorar acessibilidade
- [ ] Revisar textos da interface
- [ ] Revisar navegacao por teclado no admin

## 10. Observabilidade e Operacao

- [ ] Logs de erro
- [ ] Logs de pedidos
- [ ] Logs de pagamento
- [ ] Monitoramento de webhook
- [ ] Monitoramento de performance
- [ ] Backups do banco
- [ ] Rotina de seed/dev
- [ ] Ambiente staging
- [ ] Deploy de producao

## 11. Testes

- [ ] Teste de schema Prisma
- [ ] Teste de criacao de pedido
- [ ] Teste de calculo de total
- [ ] Teste de CPF
- [ ] Teste de permissao admin
- [ ] Teste de status do pedido
- [ ] Teste de checkout sem Stripe
- [ ] Teste de webhook Stripe
- [ ] Teste E2E do fluxo cliente
- [ ] Teste E2E do fluxo cozinha
- [ ] Teste E2E do fluxo caixa

## 12. Sequencia Recomendada de Implementacao

### Fase 1 - Base SaaS e Admin Minimo

- [x] Decidir auth
- [x] Criar `User`, `RestaurantUser`, `Role`
- [x] Criar login admin
- [x] Criar layout admin
- [x] Criar dashboard inicial
- [x] Criar CRUD de categorias
- [x] Criar CRUD de produtos
- [x] Criar CRUD de mesas

### Fase 2 - Operacao de Pedidos

- [x] Criar status operacional completo
- [x] Criar tela admin de pedidos
- [ ] Criar detalhe do pedido
- [x] Criar action para atualizar status
- [x] Criar tela cozinha
- [ ] Criar fluxo de preparo
- [x] Criar fluxo de pedido pronto/entregue

### Fase 3 - Mesas e QR Code

- [x] Criar mesas no banco
- [ ] Criar sessoes de mesa
- [ ] Gerar QR code por mesa
- [x] Abrir mesa via QR
- [x] Vincular pedido a mesa
- [ ] Controlar consumo por mesa
- [x] Liberar mesa pelo admin

### Fase 4 - Cliente Completo

- [ ] Persistir sacola
- [ ] Mostrar pedido atual
- [ ] Atualizar status do pedido para cliente
- [ ] Permitir observacoes conforme [ingredientes-personalizados.md](ingredientes-personalizados.md)
- [ ] Permitir adicionais conforme [ingredientes-personalizados.md](ingredientes-personalizados.md)
- [ ] Melhorar historico de pedidos

### Fase 5 - Caixa, Relatorios e SaaS Comercial

- [ ] Criar modulo de caixa
- [ ] Criar metodos de pagamento
- [ ] Criar relatorios
- [ ] Criar planos e assinaturas
- [ ] Criar onboarding de restaurante
- [ ] Criar billing do SaaS

## 13. Decisoes Pendentes

- [ ] Auth: qual provedor usar?
- [ ] Realtime: polling, SSE ou WebSocket?
- [ ] Pagamentos: Stripe, Mercado Pago, PIX manual ou todos?
- [ ] Multi-tenant: slug, subdominio ou dominio proprio?
- [ ] Admin: rotas por `/admin/{slug}` ou por usuario logado?
- [ ] Mobile cliente: apenas PWA web ou app nativo futuro?
- [ ] Impressao: impressora termica via browser, app local ou integracao externa?

## 14. Registro de Evolucao

### 2026-06-13

- [x] Projeto base de self-checkout concluido
- [x] Fluxo cliente inicial funcionando
- [x] Pedido e historico por CPF funcionando
- [x] Roteiro SaaS criado
- [x] Admin operacional inicial criado
- [x] Dashboard admin inicial criado
- [x] Tela admin de pedidos criada
- [x] Tela cozinha criada
- [x] Tela mesas criada
- [x] Modelo inicial de mesas criado
- [x] Autenticacao admin inicial criada
- [x] Usuario admin vinculado ao restaurante criado na seed
- [x] Vinculo de pedido a mesa por QR/link criado
- [x] CRUD admin inicial de categorias criado
- [x] CRUD admin inicial de produtos criado

Proxima prioridade sugerida:

- [x] Vincular pedido do cliente a mesa via QR code
- [x] Criar CRUD de produtos e categorias
- [ ] Criar detalhe admin do pedido
- [ ] Criar filtros avancados de pedidos
- [ ] Criar permissoes por usuario do estabelecimento
