import { Prisma } from "@prisma/client";

export type TransactionClient = Omit<
  Prisma.TransactionClient,
  "$commit" | "$rollback"
>;
