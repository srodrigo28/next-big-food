# Ingredientes Personalizados, Adicionais e Alergias

Documento de controle para criar um modulo de personalizacao de produtos no ZapFood. Este modulo deve permitir que o estabelecimento configure ingredientes, adicionais pagos, remocoes permitidas e alertas de alergia para o cliente montar o pedido com seguranca.

Use este arquivo como checklist:

- `[x]` concluido
- `[ ]` pendente

## 1. Objetivo do Modulo

- [x] Permitir que o admin configure ingredientes por produto
- [x] Permitir que o admin configure adicionais pagos por produto
- [x] Permitir que o admin configure remocoes permitidas por produto
- [x] Permitir que o cliente remova ingredientes do produto
- [x] Permitir que o cliente adicione ingredientes/adicionais com valor
- [x] Permitir que o cliente informe alergias
- [x] Mostrar aviso claro quando o produto nao tiver lista de personalizacao configurada
- [x] Registrar personalizacoes no pedido e mostrar para cozinha/admin

## 2. Conceitos Principais

### Ingrediente Base

Ingrediente que ja faz parte do produto.

Exemplo:

- Pao
- Carne
- Queijo
- Alface
- Molho especial

Uso esperado:

- [x] Mostrar ao cliente os ingredientes do produto
- [x] Permitir remover quando configurado pelo admin
- [x] Marcar ingredientes alergicos ou sensiveis
- [x] Mostrar remocoes no pedido enviado para cozinha

### Adicional Pago

Ingrediente ou opcional que pode ser acrescentado ao produto com valor extra.

Exemplo:

- Bacon extra: R$ 4,00
- Queijo extra: R$ 3,00
- Carne extra: R$ 8,00
- Molho extra: R$ 2,00

Uso esperado:

- [x] Admin define nome, descricao opcional e preco
- [x] Admin define quantidade maxima por adicional
- [x] Cliente escolhe os adicionais antes de adicionar na sacola
- [x] Valor do produto soma adicionais selecionados
- [x] Cozinha recebe adicionais no detalhe do item

### Remocao de Ingrediente

Opcao para o cliente pedir o produto sem algum ingrediente.

Exemplo:

- Sem cebola
- Sem picles
- Sem queijo
- Sem molho

Uso esperado:

- [x] Admin define quais ingredientes podem ser removidos
- [x] Cliente marca ingredientes que quer remover
- [x] Remocoes aparecem na sacola
- [x] Remocoes aparecem na cozinha/admin

### Alergia

Informacao de seguranca alimentar indicada pelo cliente.

Exemplo:

- Lactose
- Gluten
- Amendoim
- Ovo
- Frutos do mar
- Soja

Uso esperado:

- [x] Cliente marca se possui alergia
- [x] Quando marcar alergia, abrir checkboxes de alergias comuns
- [x] Cliente pode escrever observacao livre sobre alergia
- [x] Pedido com alergia deve aparecer destacado para admin/cozinha
- [ ] Produto deve alertar quando contem ingrediente alergico configurado

## 3. Experiencia no Cliente

### Tela do Produto

Ao abrir um produto, o cliente deve ver:

- [x] Nome, imagem, descricao e preco base
- [x] Ingredientes base do produto
- [x] Lista de ingredientes que podem ser removidos
- [x] Lista de adicionais pagos
- [x] Campo de observacao do item
- [x] Pergunta: "Possui alguma alergia?"
- [x] Se sim, mostrar checkboxes de alergias
- [x] Campo de observacao de alergia
- [x] Total atualizado com adicionais
- [x] Botao adicionar na sacola

### Quando Nao Houver Configuracao

Se o admin nao configurou ingredientes/adicionais para o produto:

- [x] Mostrar mensagem: "Este produto ainda nao possui opcoes de personalizacao configuradas."
- [x] Permitir adicionar normalmente na sacola
- [x] Manter campo de observacao do item
- [x] Manter pergunta de alergia
- [x] Nao bloquear compra

### Texto Sugerido para Cliente

Produto sem lista configurada:

```txt
Este produto ainda nao possui opcoes de personalizacao configuradas. Voce ainda pode adicionar uma observacao para o estabelecimento.
```

Alergia:

```txt
Voce possui alguma alergia alimentar?
```

Observacao de alergia:

```txt
Descreva qualquer cuidado necessario para o preparo.
```

## 4. Experiencia no Admin

### Cadastro de Ingredientes

- [x] Criar tela `/admin/ingredients`
- [x] Listar ingredientes do restaurante
- [x] Criar ingrediente
- [ ] Editar ingrediente
- [x] Marcar ingrediente como alergeno
- [x] Selecionar tipo de alergeno: lactose, gluten, amendoim, ovo, soja, frutos do mar, outro
- [x] Ativar/desativar ingrediente

### Configuracao por Produto

Na tela de produtos, o admin deve poder configurar:

- [x] Ingredientes base do produto
- [x] Ingredientes removiveis
- [x] Adicionais disponiveis
- [x] Preco de cada adicional
- [x] Quantidade maxima de cada adicional
- [ ] Se adicional e obrigatorio ou opcional
- [x] Se produto aceita observacao
- [x] Se produto deve exibir alerta de alergia

### Mensagem Admin Quando Nao Houver Lista

Se um produto ainda nao tiver personalizacao:

- [ ] Mostrar alerta no admin: "Produto sem personalizacao configurada"
- [x] Mostrar botao: "Configurar ingredientes" (botao "Personalização" em `/admin/products`)
- [x] Permitir salvar produto sem ingredientes

Texto sugerido:

```txt
Este produto ainda nao possui lista de ingredientes, adicionais ou remocoes. Configure para permitir personalizacao pelo cliente.
```

## 5. Modelagem Sugerida do Banco

### Novas Tabelas

- [x] `Ingredient`
- [x] `ProductIngredient`
- [x] `ProductAddon`
- [x] `OrderProductCustomization`
- [x] `OrderProductRemovedIngredient`
- [x] `OrderProductAddon`
- [ ] `AllergyTag` (implementado como enum `AllergyType`)
- [ ] `OrderAllergy` (implementado como campos `hasAllergy`/`allergyTypes`/`allergyNotes` em `OrderProductCustomization`)

### Ingredient

Campos sugeridos:

- [x] `id`
- [x] `name`
- [x] `description`
- [x] `restaurantId`
- [x] `isAllergen`
- [x] `allergenType`
- [x] `isActive`
- [x] `createdAt`
- [x] `updatedAt`

### ProductIngredient

Liga produto aos ingredientes base.

Campos sugeridos:

- [x] `id`
- [x] `productId`
- [x] `ingredientId`
- [x] `canRemove`
- [ ] `isDefault`

### ProductAddon

Liga produto aos adicionais pagos.

Campos sugeridos:

- [x] `id`
- [x] `productId`
- [ ] `ingredientId`
- [x] `name`
- [x] `price`
- [x] `maxQuantity`
- [x] `isActive`

### OrderProductCustomization

Guarda a personalizacao final do item no pedido.

Campos sugeridos:

- [x] `id`
- [x] `orderProductId`
- [x] `observation`
- [x] `hasAllergy`
- [x] `allergyNotes`

### OrderProductRemovedIngredient

Guarda ingredientes removidos.

Campos sugeridos:

- [x] `id`
- [x] `orderProductId` (via `customizationId`)
- [x] `ingredientId`
- [x] `nameSnapshot`

### OrderProductAddon

Guarda adicionais escolhidos.

Campos sugeridos:

- [x] `id`
- [x] `orderProductId` (via `customizationId`)
- [x] `productAddonId`
- [x] `nameSnapshot`
- [x] `quantity`
- [x] `unitPriceSnapshot`
- [x] `total`

### OrderAllergy

Guarda alertas de alergia do pedido ou item.

Campos sugeridos:

- [ ] `id`
- [ ] `orderId`
- [ ] `orderProductId`
- [ ] `type`
- [ ] `notes`

Implementado de forma simplificada via `hasAllergy`, `allergyTypes[]` e `allergyNotes`
diretamente em `OrderProductCustomization`, sem tabela dedicada.

## 6. Tipos de Alergia Sugeridos

- [x] Lactose
- [x] Gluten
- [x] Amendoim
- [x] Castanhas
- [x] Ovo
- [x] Soja
- [x] Peixe
- [x] Frutos do mar
- [x] Corantes
- [x] Outro

## 7. Regras de Negocio

- [x] Produto pode ser vendido mesmo sem personalizacao configurada
- [x] Produto pode ter ingredientes base sem adicionais pagos
- [x] Produto pode ter adicionais pagos sem permitir remocoes
- [x] Produto pode permitir observacao mesmo sem ingredientes configurados
- [x] Cliente pode marcar alergia mesmo sem personalizar ingrediente
- [x] Pedido com alergia deve ter destaque visual no admin/cozinha
- [x] Adicional pago deve alterar total do item
- [x] Total do pedido deve considerar adicionais
- [x] Remover ingrediente nao reduz preco, salvo regra futura especifica
- [x] Valores devem ser gravados como snapshot para preservar historico

## 8. Admin - Telas Necessarias

- [x] `/admin/ingredients`
- [x] `/admin/products/{productId}/customization`
- [x] Bloco de ingredientes na tela `/admin/products`
- [x] Bloco de adicionais na tela `/admin/products`
- [ ] Alerta de produto sem configuracao
- [ ] Indicador de produto com alergeno

## 9. Cliente - Telas Necessarias

- [x] Bloco de remocao de ingredientes na tela de produto
- [x] Bloco de adicionais pagos na tela de produto
- [x] Pergunta de alergia na tela de produto
- [x] Checkboxes de alergias comuns
- [x] Campo de observacao do item
- [x] Campo de observacao de alergia
- [x] Resumo de personalizacao na sacola
- [x] Resumo de personalizacao no historico do pedido

## 10. Admin/Cozinha - Visualizacao do Pedido

O pedido deve destacar:

- [x] Ingredientes removidos
- [x] Adicionais escolhidos
- [x] Observacao do cliente
- [x] Alergia marcada
- [x] Tipo de alergia
- [x] Observacao de alergia

Texto de alerta sugerido:

```txt
ATENCAO: pedido com alergia informada pelo cliente.
```

## 11. Sequencia Recomendada de Implementacao

### Fase 1 - Banco e Admin

- [x] Criar tabelas de ingredientes e adicionais
- [x] Criar migration
- [ ] Criar seed de ingredientes comuns
- [x] Criar `/admin/ingredients`
- [x] Criar configuracao de ingredientes por produto
- [x] Criar configuracao de adicionais por produto

### Fase 2 - Cliente

- [x] Mostrar ingredientes base na tela do produto
- [x] Permitir remover ingredientes
- [x] Permitir selecionar adicionais pagos
- [x] Calcular preco do item com adicionais
- [x] Permitir marcar alergia
- [x] Permitir observacao do item
- [x] Mostrar resumo na sacola

### Fase 3 - Pedido e Cozinha

- [x] Salvar customizacoes no pedido
- [x] Mostrar customizacoes no admin de pedidos
- [x] Mostrar customizacoes na cozinha
- [x] Destacar alergia no Kanban da cozinha
- [x] Garantir snapshot de nomes e valores

### Fase 4 - Refinamento

- [x] Criar validacoes por produto (servidor revalida ingredientes/adicionais pertencentes ao produto)
- [x] Criar limites de adicionais (respeita `maxQuantity` no cliente e no servidor)
- [ ] Criar relatorio de adicionais mais vendidos
- [ ] Criar auditoria de mudancas em ingredientes

## 12. Pontos de Atencao

- [ ] Nao tratar alergia como garantia de ausencia total de contaminacao cruzada
- [ ] Mostrar aviso de responsabilidade do estabelecimento
- [ ] Evitar apagar ingrediente usado em pedido historico
- [x] Usar snapshot em pedidos para manter historico correto
- [ ] Pensar em Decimal para valores financeiros antes de escalar
- [x] Diferenciar ingrediente base, ingrediente removivel e adicional pago

## 13. Registro

### 2026-06-13

- [x] Documento do modulo criado
- [ ] Banco ainda nao implementado
- [ ] Admin ainda nao implementado
- [ ] Cliente ainda nao implementado

### 2026-06-14

- [x] Banco implementado: `Ingredient`, `ProductIngredient`, `ProductAddon`,
  `OrderProductCustomization`, `OrderProductRemovedIngredient`, `OrderProductAddon`,
  enum `AllergyType` (migration `add_ingredient_customization`)
- [x] Admin implementado: `/admin/ingredients` (CRUD simples + alergeno) e
  `/admin/products/{productId}/customization` (ingredientes removiveis e adicionais pagos)
- [x] Botao "Personalização" adicionado em `/admin/products`
- [x] Cliente implementado: tela de produto com remocao de ingredientes, adicionais com
  stepper de quantidade, observacao do item e pergunta de alergia (checkboxes +
  observacao livre)
- [x] Sacola mostra resumo da personalizacao (removidos, adicionais, observacao, alergia)
- [x] Pedido grava personalizacao com snapshot de nomes e precos, recalculando o preco do
  item no servidor (`createOrder`)
- [x] `/admin/orders/{orderId}`, `/admin/kitchen`, `/{slug}/order/{orderId}` e
  `/{slug}/orders` exibem a personalizacao e destacam alergia informada
- [x] Verificacao ponta a ponta feita via dados de teste (ingrediente removivel,
  ingrediente alergeno PEANUT e adicional pago no Big Mac): tela do produto exibe
  as 3 secoes novas, pedido com customizacao grava snapshot correto e aparece em
  `/admin/orders/{id}`, `/admin/kitchen`, `/{slug}/order/{id}` e `/{slug}/orders`
  com alerta de alergia. Dados de teste removidos apos a verificacao.
