# Compartilhe e Ganhe - Avaliacao, Indicacao e Pontos

Documento de controle para criar um modulo de crescimento e fidelidade no ZapFood. A ideia e incentivar clientes a avaliar, compartilhar e indicar o estabelecimento, gerando pontos em uma carteira que podem ser trocados por lanches, descontos ou pagamento parcial do pedido.

Use este arquivo como checklist:

- `[x]` concluido
- `[ ]` pendente

## 1. Objetivo do Modulo

- [ ] Incentivar avaliacoes reais dos clientes
- [ ] Aumentar compartilhamentos por WhatsApp e Instagram
- [ ] Criar carteira de pontos por cliente
- [ ] Permitir trocar pontos por desconto
- [ ] Permitir pagar diferenca quando pontos nao cobrirem o pedido
- [ ] Permitir pedido totalmente pago com pontos
- [ ] Criar controle admin para regras de pontuacao
- [ ] Evitar fraude, spam e pontuacao duplicada

## 2. Ideia Central

Fluxo desejado:

1. Cliente faz um pedido
2. Cliente avalia a experiencia
3. Cliente compartilha o restaurante, produto ou pedido
4. Sistema registra a acao
5. Cliente ganha pontos na carteira
6. Cliente usa pontos em pedidos futuros
7. Se pontos forem insuficientes, paga a diferenca
8. Se pontos cobrirem o valor, pedido fica totalmente pago

## 3. Acoes que Geram Pontos

### Avaliacao

- [ ] Avaliar pedido com estrelas
- [ ] Escrever comentario opcional
- [ ] Avaliar produto individual
- [ ] Avaliar atendimento
- [ ] Avaliar tempo de preparo
- [ ] Ganhar pontos apenas uma vez por pedido avaliado
- [ ] Bloquear avaliacao sem pedido real

Pontuacao sugerida:

- Avaliar pedido: 10 pontos
- Avaliar com comentario: +5 pontos
- Avaliar produto: +3 pontos por produto

### Compartilhamento

- [ ] Compartilhar restaurante por WhatsApp
- [ ] Compartilhar restaurante por Instagram
- [ ] Compartilhar produto especifico
- [ ] Compartilhar cupom/convite pessoal
- [ ] Registrar clique no link compartilhado
- [ ] Pontuar mais quando o compartilhamento gerar novo cliente

Pontuacao sugerida:

- Clique em compartilhar: 2 pontos
- Compartilhamento com clique de outra pessoa: +8 pontos
- Indicacao que gera primeiro pedido: +50 pontos

### Indicacao

- [ ] Criar codigo de indicacao por cliente
- [ ] Criar link unico de indicacao
- [ ] Novo cliente entra pelo link
- [ ] Novo cliente faz primeiro pedido
- [ ] Cliente indicador recebe pontos
- [ ] Cliente indicado recebe bonus ou desconto

Pontuacao sugerida:

- Novo cadastro indicado: 20 pontos
- Primeiro pedido do indicado: +50 pontos
- Bonus para indicado: 10% no primeiro pedido ou pontos iniciais

## 4. Carteira de Pontos

### Regras da Carteira

- [ ] Cada cliente tem uma carteira de pontos
- [ ] Pontos entram como credito
- [ ] Pontos saem quando usados em pedido
- [ ] Cada movimentacao deve ter historico
- [ ] Pontos podem expirar
- [ ] Admin pode ajustar pontos manualmente com motivo
- [ ] Cliente pode ver saldo e extrato

### Conversao de Pontos

Exemplo inicial:

- 1 ponto = R$ 0,10
- 10 pontos = R$ 1,00
- 100 pontos = R$ 10,00

Checklist:

- [ ] Definir taxa de conversao por estabelecimento
- [ ] Permitir minimo de pontos para resgate
- [ ] Permitir maximo de desconto por pedido
- [ ] Permitir produto 100% pago com pontos
- [ ] Permitir pagar diferenca em dinheiro, PIX, cartao ou Stripe

## 5. Uso dos Pontos no Pedido

### Pagamento Parcial

Exemplo:

- Pedido: R$ 35,00
- Cliente tem pontos equivalentes a R$ 20,00
- Cliente usa pontos
- Diferenca a pagar: R$ 15,00

Checklist:

- [ ] Mostrar saldo de pontos no checkout
- [ ] Cliente escolhe usar pontos
- [ ] Sistema calcula desconto
- [ ] Sistema mostra diferenca a pagar
- [ ] Pedido registra valor em pontos e valor em dinheiro

### Pagamento Total

Exemplo:

- Pedido: R$ 25,00
- Cliente tem pontos equivalentes a R$ 30,00
- Pedido fica 100% pago com pontos
- Sistema debita apenas R$ 25,00 em pontos

Checklist:

- [ ] Permitir pedido sem pagamento externo quando pontos cobrirem total
- [ ] Registrar pedido como pago por pontos
- [ ] Debitar pontos da carteira
- [ ] Mostrar no admin como "Pago com pontos"

## 6. Avaliacao do Cliente

### Tela de Avaliacao

- [ ] Criar rota `/{slug}/orders/{orderId}/review`
- [ ] Mostrar resumo do pedido
- [ ] Campo de estrelas de 1 a 5
- [ ] Campo de comentario
- [ ] Pergunta: "Voce indicaria este estabelecimento?"
- [ ] Botao para enviar avaliacao
- [ ] Apos avaliar, oferecer compartilhamento

### Regras da Avaliacao

- [ ] Apenas cliente do pedido pode avaliar
- [ ] Cada pedido pode ter uma avaliacao
- [ ] Avaliacao pode liberar pontos
- [ ] Admin pode visualizar avaliacoes
- [ ] Admin pode responder avaliacao no futuro

## 7. Compartilhamento

### WhatsApp

- [ ] Gerar mensagem padrao para WhatsApp
- [ ] Incluir nome do restaurante
- [ ] Incluir link de indicacao
- [ ] Incluir cupom ou beneficio quando existir
- [ ] Registrar tentativa de compartilhamento
- [ ] Registrar clique no link

Mensagem sugerida:

```txt
Acabei de pedir no {restaurantName}. Gostei muito! Use meu link para conhecer: {referralLink}
```

### Instagram

Instagram nao permite confirmar automaticamente que o cliente postou nos stories sem integracao mais avancada. Entao o fluxo inicial pode ser:

- [ ] Botao "Compartilhar no Instagram"
- [ ] Gerar imagem/story com restaurante, produto ou pedido
- [ ] Cliente baixa ou compartilha manualmente
- [ ] Sistema registra tentativa de compartilhamento
- [ ] Pontuacao maior somente se houver cupom/link usado por outra pessoa

Possibilidades futuras:

- [ ] Gerar arte de story automaticamente
- [ ] Criar QR code/cupom na imagem
- [ ] Criar codigo de indicacao visivel
- [ ] Permitir upload de print para validacao manual

## 8. Admin

### Configuracoes

- [ ] Criar tela `/admin/loyalty`
- [ ] Ativar/desativar modulo de pontos
- [ ] Configurar pontos por avaliacao
- [ ] Configurar pontos por comentario
- [ ] Configurar pontos por compartilhamento
- [ ] Configurar pontos por indicacao
- [ ] Configurar conversao ponto/real
- [ ] Configurar validade dos pontos
- [ ] Configurar limite de desconto por pedido

### Avaliacoes

- [ ] Criar tela `/admin/reviews`
- [ ] Listar avaliacoes
- [ ] Filtrar por nota
- [ ] Filtrar por data
- [ ] Filtrar por produto
- [ ] Ver comentario do cliente
- [ ] Ver pedido vinculado
- [ ] Destacar avaliacoes negativas

### Carteiras

- [ ] Criar tela `/admin/wallets`
- [ ] Ver saldo de pontos por cliente
- [ ] Ver extrato de pontos
- [ ] Ajustar pontos manualmente
- [ ] Inserir motivo do ajuste
- [ ] Auditar ajustes

## 9. Cliente

### Area do Cliente

- [ ] Mostrar saldo de pontos
- [ ] Mostrar extrato da carteira
- [ ] Mostrar pontos a expirar
- [ ] Mostrar cupons/beneficios disponiveis
- [ ] Mostrar link de indicacao
- [ ] Mostrar pedidos que ainda podem ser avaliados

### Checkout

- [ ] Mostrar saldo de pontos
- [ ] Mostrar valor convertido em reais
- [ ] Permitir aplicar pontos
- [ ] Mostrar desconto aplicado
- [ ] Mostrar diferenca a pagar
- [ ] Confirmar uso de pontos antes de finalizar

## 10. Modelagem Sugerida do Banco

### Novas Tabelas

- [ ] `Customer`
- [ ] `CustomerWallet`
- [ ] `WalletTransaction`
- [ ] `Review`
- [ ] `ProductReview`
- [ ] `ReferralCode`
- [ ] `ReferralEvent`
- [ ] `ShareEvent`
- [ ] `LoyaltyRule`
- [ ] `PointRedemption`

### CustomerWallet

- [ ] `id`
- [ ] `customerId`
- [ ] `restaurantId`
- [ ] `pointsBalance`
- [ ] `createdAt`
- [ ] `updatedAt`

### WalletTransaction

- [ ] `id`
- [ ] `walletId`
- [ ] `type` credit/debit/adjustment/expiration
- [ ] `points`
- [ ] `reason`
- [ ] `orderId`
- [ ] `metadata`
- [ ] `createdAt`

### Review

- [ ] `id`
- [ ] `orderId`
- [ ] `customerId`
- [ ] `restaurantId`
- [ ] `rating`
- [ ] `comment`
- [ ] `wouldRecommend`
- [ ] `pointsGranted`
- [ ] `createdAt`

### ReferralEvent

- [ ] `id`
- [ ] `referrerCustomerId`
- [ ] `referredCustomerId`
- [ ] `restaurantId`
- [ ] `status`
- [ ] `pointsGranted`
- [ ] `createdAt`

### ShareEvent

- [ ] `id`
- [ ] `customerId`
- [ ] `restaurantId`
- [ ] `channel` whatsapp/instagram/copy_link
- [ ] `targetType` restaurant/product/order
- [ ] `targetId`
- [ ] `pointsGranted`
- [ ] `createdAt`

## 11. Regras Anti-Fraude

- [ ] Pontuar avaliacao apenas uma vez por pedido
- [ ] Pontuar compartilhamento simples com poucos pontos
- [ ] Pontuar indicacao forte apenas quando novo cliente faz pedido
- [ ] Bloquear autoindicacao
- [ ] Limitar pontos diarios por compartilhamento
- [ ] Registrar IP/user-agent quando fizer sentido
- [ ] Exigir pedido finalizado para liberar avaliacao
- [ ] Nao permitir pontos para pedido cancelado
- [ ] Criar auditoria de ajustes manuais

## 12. Ideias para Tornar Referencia

- [ ] Ranking de clientes mais engajados
- [ ] Nivel do cliente: bronze, prata, ouro
- [ ] Bonus no aniversario
- [ ] Campanhas por horario de baixo movimento
- [ ] Produto gratis apos X pedidos
- [ ] Cashback em pontos
- [ ] Cupom de indicacao por mesa
- [ ] Campanha "traga um amigo"
- [ ] Story automatico com arte do lanche
- [ ] Avaliacao com foto do pedido

## 13. Sequencia Recomendada de Implementacao

### Fase 1 - Base da Carteira

- [ ] Criar `Customer`
- [ ] Criar `CustomerWallet`
- [ ] Criar `WalletTransaction`
- [ ] Vincular pedido ao cliente
- [ ] Mostrar saldo de pontos no cliente

### Fase 2 - Avaliacao

- [ ] Criar tela de avaliacao do pedido
- [ ] Salvar avaliacao
- [ ] Creditar pontos por avaliacao
- [ ] Mostrar avaliacoes no admin

### Fase 3 - Compartilhamento

- [ ] Criar link de indicacao
- [ ] Criar botao WhatsApp
- [ ] Criar arte/link para Instagram
- [ ] Registrar eventos de compartilhamento
- [ ] Creditar pontos conforme regra

### Fase 4 - Resgate

- [ ] Mostrar pontos no checkout
- [ ] Aplicar pontos como desconto
- [ ] Permitir pagamento parcial
- [ ] Permitir pagamento total com pontos
- [ ] Registrar debito na carteira

### Fase 5 - Admin e Campanhas

- [ ] Criar configuracoes do programa
- [ ] Criar relatorios de pontos
- [ ] Criar relatorios de avaliacoes
- [ ] Criar campanhas de fidelidade

## 14. Registro

### 2026-06-13

- [x] Documento do modulo criado
- [ ] Banco ainda nao implementado
- [ ] Admin ainda nao implementado
- [ ] Cliente ainda nao implementado
