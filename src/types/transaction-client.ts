import { Prisma } from "@/app/generated/prisma";

export type TransactionClient = Omit<
  Prisma.TransactionClient,
  "$commit" | "$rollback"
>;
