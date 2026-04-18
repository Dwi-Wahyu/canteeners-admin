import { Prisma } from "@/generated/prisma";

export type TransactionClient = Omit<
  Prisma.TransactionClient,
  "$commit" | "$rollback"
>;
