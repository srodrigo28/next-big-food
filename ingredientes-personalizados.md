# Ingredientes Personalizados, Adicionais e Alergias

Documento de controle para criar um modulo de personalizacao de produtos no ZapFood. Este modulo deve permitir que o estabelecimento configure ingredientes, adicionais pagos, remocoes permitidas e alertas de alergia para o cliente montar o pedido com seguranca.

Use este arquivo como checklist:

- `[x]` concluido
- `[ ]` pendente

## 1. Objetivo do Modulo

- [ ] Permitir que o admin configure ingredientes por produto
- [ ] Permitir que o admin configure adicionais pagos por produto
- [ ] Permitir que o admin configure remocoes permitidas por produto
- [ ] Permitir que o cliente remova ingredientes do produto
- [ ] Permitir que o cliente adicione ingredientes/adicionais com valor
- [ ] Permitir que o cliente informe alergias
- [ ] Mostrar aviso claro quando o produto nao tiver lista de personalizacao configurada
- [ ] Registrar personalizacoes no pedido e mostrar para cozinha/admin

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

- [ ] Mostrar ao cliente os ingredientes do produto
- [ ] Permitir remover quando configurado pelo admin
- [ ] Marcar ingredientes alergicos ou sensiveis
- [ ] Mostrar remocoes no pedido enviado para cozinha

### Adicional Pago

Ingrediente ou opcional que pode ser acrescentado ao produto com valor extra.

Exemplo:

- Bacon extra: R$ 4,00
- Queijo extra: R$ 3,00
- Carne extra: R$ 8,00
- Molho extra: R$ 2,00

Uso esperado:

- [ ] Admin define nome, descricao opcional e preco
- [ ] Admin define quantidade maxima por adicional
- [ ] Cliente escolhe os adicionais antes de adicionar na sacola
- [ ] Valor do produto soma adicionais selecionados
- [ ] Cozinha recebe adicionais no detalhe do item

### Remocao de Ingrediente

Opcao para o cliente pedir o produto sem algum ingrediente.

Exemplo:

- Sem cebola
- Sem picles
- Sem queijo
- Sem molho

Uso esperado:

- [ ] Admin define quais ingredientes podem ser removidos
- [ ] Cliente marca ingredientes que quer remover
- [ ] Remocoes aparecem na sacola
- [ ] Remocoes aparecem na cozinha/admin

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

- [ ] Cliente marca se possui alergia
- [ ] Quando marcar alergia, abrir checkboxes de alergias comuns
- [ ] Cliente pode escrever observacao livre sobre alergia
- [ ] Pedido com alergia deve aparecer destacado para admin/cozinha
- [ ] Produto deve alertar quando contem ingrediente alergico configurado

## 3. Experiencia no Cliente

### Tela do Produto

Ao abrir um produto, o cliente deve ver:

- [ ] Nome, imagem, descricao e preco base
- [ ] Ingredientes base do produto
- [ ] Lista de ingredientes que podem ser removidos
- [ ] Lista de adicionais pagos
- [ ] Campo de observacao do item
- [ ] Pergunta: "Possui alguma alergia?"
- [ ] Se sim, mostrar checkboxes de alergias
- [ ] Campo de observacao de alergia
- [ ] Total atualizado com adicionais
- [ ] Botao adicionar na sacola

### Quando Nao Houver Configuracao

Se o admin nao configurou ingredientes/adicionais para o produto:

- [ ] Mostrar mensagem: "Este produto ainda nao possui opcoes de personalizacao configuradas."
- [ ] Permitir adicionar normalmente na sacola
- [ ] Manter campo de observacao do item
- [ ] Manter pergunta de alergia
- [ ] Nao bloquear compra

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

- [ ] Criar tela `/admin/ingredients`
- [ ] Listar ingredientes do restaurante
- [ ] Criar ingrediente
- [ ] Editar ingrediente
- [ ] Marcar ingrediente como alergeno
- [ ] Selecionar tipo de alergeno: lactose, gluten, amendoim, ovo, soja, frutos do mar, outro
- [ ] Ativar/desativar ingrediente

### Configuracao por Produto

Na tela de produtos, o admin deve poder configurar:

- [ ] Ingredientes base do produto
- [ ] Ingredientes removiveis
- [ ] Adicionais disponiveis
- [ ] Preco de cada adicional
- [ ] Quantidade maxima de cada adicional
- [ ] Se adicional e obrigatorio ou opcional
- [ ] Se produto aceita observacao
- [ ] Se produto deve exibir alerta de alergia

### Mensagem Admin Quando Nao Houver Lista

Se um produto ainda nao tiver personalizacao:

- [ ] Mostrar alerta no admin: "Produto sem personalizacao configurada"
- [ ] Mostrar botao: "Configurar ingredientes"
- [ ] Permitir salvar produto sem ingredientes

Texto sugerido:

```txt
Este produto ainda nao possui lista de ingredientes, adicionais ou remocoes. Configure para permitir personalizacao pelo cliente.
```

## 5. Modelagem Sugerida do Banco

### Novas Tabelas

- [ ] `Ingredient`
- [ ] `ProductIngredient`
- [ ] `ProductAddon`
- [ ] `OrderProductCustomization`
- [ ] `OrderProductRemovedIngredient`
- [ ] `OrderProductAddon`
- [ ] `AllergyTag`
- [ ] `OrderAllergy`

### Ingredient

Campos sugeridos:

- [ ] `id`
- [ ] `name`
- [ ] `description`
- [ ] `restaurantId`
- [ ] `isAllergen`
- [ ] `allergenType`
- [ ] `isActive`
- [ ] `createdAt`
- [ ] `updatedAt`

### ProductIngredient

Liga produto aos ingredientes base.

Campos sugeridos:

- [ ] `id`
- [ ] `productId`
- [ ] `ingredientId`
- [ ] `canRemove`
- [ ] `isDefault`

### ProductAddon

Liga produto aos adicionais pagos.

Campos sugeridos:

- [ ] `id`
- [ ] `productId`
- [ ] `ingredientId`
- [ ] `name`
- [ ] `price`
- [ ] `maxQuantity`
- [ ] `isActive`

### OrderProductCustomization

Guarda a personalizacao final do item no pedido.

Campos sugeridos:

- [ ] `id`
- [ ] `orderProductId`
- [ ] `observation`
- [ ] `hasAllergy`
- [ ] `allergyNotes`

### OrderProductRemovedIngredient

Guarda ingredientes removidos.

Campos sugeridos:

- [ ] `id`
- [ ] `orderProductId`
- [ ] `ingredientId`
- [ ] `nameSnapshot`

### OrderProductAddon

Guarda adicionais escolhidos.

Campos sugeridos:

- [ ] `id`
- [ ] `orderProductId`
- [ ] `productAddonId`
- [ ] `nameSnapshot`
- [ ] `quantity`
- [ ] `unitPriceSnapshot`
- [ ] `total`

### OrderAllergy

Guarda alertas de alergia do pedido ou item.

Campos sugeridos:

- [ ] `id`
- [ ] `orderId`
- [ ] `orderProductId`
- [ ] `type`
- [ ] `notes`

## 6. Tipos de Alergia Sugeridos

- [ ] Lactose
- [ ] Gluten
- [ ] Amendoim
- [ ] Castanhas
- [ ] Ovo
- [ ] Soja
- [ ] Peixe
- [ ] Frutos do mar
- [ ] Corantes
- [ ] Outro

## 7. Regras de Negocio

- [ ] Produto pode ser vendido mesmo sem personalizacao configurada
- [ ] Produto pode ter ingredientes base sem adicionais pagos
- [ ] Produto pode ter adicionais pagos sem permitir remocoes
- [ ] Produto pode permitir observacao mesmo sem ingredientes configurados
- [ ] Cliente pode marcar alergia mesmo sem personalizar ingrediente
- [ ] Pedido com alergia deve ter destaque visual no admin/cozinha
- [ ] Adicional pago deve alterar total do item
- [ ] Total do pedido deve considerar adicionais
- [ ] Remover ingrediente nao reduz preco, salvo regra futura especifica
- [ ] Valores devem ser gravados como snapshot para preservar historico

## 8. Admin - Telas Necessarias

- [ ] `/admin/ingredients`
- [ ] `/admin/products/{productId}/customization`
- [ ] Bloco de ingredientes na tela `/admin/products`
- [ ] Bloco de adicionais na tela `/admin/products`
- [ ] Alerta de produto sem configuracao
- [ ] Indicador de produto com alergeno

## 9. Cliente - Telas Necessarias

- [ ] Bloco de remocao de ingredientes na tela de produto
- [ ] Bloco de adicionais pagos na tela de produto
- [ ] Pergunta de alergia na tela de produto
- [ ] Checkboxes de alergias comuns
- [ ] Campo de observacao do item
- [ ] Campo de observacao de alergia
- [ ] Resumo de personalizacao na sacola
- [ ] Resumo de personalizacao no historico do pedido

## 10. Admin/Cozinha - Visualizacao do Pedido

O pedido deve destacar:

- [ ] Ingredientes removidos
- [ ] Adicionais escolhidos
- [ ] Observacao do cliente
- [ ] Alergia marcada
- [ ] Tipo de alergia
- [ ] Observacao de alergia

Texto de alerta sugerido:

```txt
ATENCAO: pedido com alergia informada pelo cliente.
```

## 11. Sequencia Recomendada de Implementacao

### Fase 1 - Banco e Admin

- [ ] Criar tabelas de ingredientes e adicionais
- [ ] Criar migration
- [ ] Criar seed de ingredientes comuns
- [ ] Criar `/admin/ingredients`
- [ ] Criar configuracao de ingredientes por produto
- [ ] Criar configuracao de adicionais por produto

### Fase 2 - Cliente

- [ ] Mostrar ingredientes base na tela do produto
- [ ] Permitir remover ingredientes
- [ ] Permitir selecionar adicionais pagos
- [ ] Calcular preco do item com adicionais
- [ ] Permitir marcar alergia
- [ ] Permitir observacao do item
- [ ] Mostrar resumo na sacola

### Fase 3 - Pedido e Cozinha

- [ ] Salvar customizacoes no pedido
- [ ] Mostrar customizacoes no admin de pedidos
- [ ] Mostrar customizacoes na cozinha
- [ ] Destacar alergia no Kanban da cozinha
- [ ] Garantir snapshot de nomes e valores

### Fase 4 - Refinamento

- [ ] Criar validacoes por produto
- [ ] Criar limites de adicionais
- [ ] Criar relatorio de adicionais mais vendidos
- [ ] Criar auditoria de mudancas em ingredientes

## 12. Pontos de Atencao

- [ ] Nao tratar alergia como garantia de ausencia total de contaminacao cruzada
- [ ] Mostrar aviso de responsabilidade do estabelecimento
- [ ] Evitar apagar ingrediente usado em pedido historico
- [ ] Usar snapshot em pedidos para manter historico correto
- [ ] Pensar em Decimal para valores financeiros antes de escalar
- [ ] Diferenciar ingrediente base, ingrediente removivel e adicional pago

## 13. Registro

### 2026-06-13

- [x] Documento do modulo criado
- [ ] Banco ainda nao implementado
- [ ] Admin ainda nao implementado
- [ ] Cliente ainda nao implementado
