#### Instalando

##### Prisma
* primeira dependência prisma
```
npm i prisma@6.2.1
```

* prisma client
```
npm install @prisma/client@6.2.1
```

* iniciando prisma 
```
npx prisma init
```

* formatando o prisma
```
npx prisma format
```

* rodando migration
```
npx prisma migrate dev --name first-migrate
```

* generate
npx prisma generate

* neon db
```
rodrigoexer8@gmail.com
```

#### Config caso baixe

##### neon
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

#### instalando ts-node
```
npm i -D ts-node@.9.2
```

* package.json
```
"prisma": {
    "seed": "node ./prisma/seed.ts"
},
```

* rodar a seed

#### Seed
```
npx prisma db seed
```

#### rodando novamente caso baixe
* Prisma Generate Gera os clientes Prisma para TypeScript:
```
npx prisma generate
```

* prisma push
** se quiser sincronizar sem recriar migrações:
```
npx prisma db push
```

#### ShadCN
```
npx shadcn@2.3.0 init
```

* button
```
npx shadcn@2.3.0 add button
```

* label, input
```
npx shadcn@2.3.0 add label input
```

* modal, card
```
npx shadcn@2.3.0 add badge card select sheet
```
