// ===================================================================
// DICAS PARA DESENVOLVEDORES INICIANTES
// ===================================================================
//
// 1. Sempre rode `npx prisma generate` após alterar o schema
// 2. Use `npx prisma db push` para sincronizar com o banco (dev)
// 3. Use `npx prisma migrate dev` em produção para criar migrações
// 4. UUID vs Int: use UUID para IDs expostos publicamente (segurança)
// 5. Float para dinheiro? Em produção, prefira Decimal: `Decimal(10,2)`
// 6. @unique: garante que não haja duplicatas no banco
// 7. onDelete: Cascade remove dados relacionados automaticamente
// 8. @relation: define como as tabelas se conectam
// 9. Enums: valores fixos, ideais para status e tipos
// ===================================================================