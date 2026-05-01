import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { createSafeAction } from "@/lib/create-safe-action";
import {
  DeleteTransactionType,
  TransactionType,
  UpdateTransactionType,
} from "./type";
import {
  DeleteTransactionSchema,
  TransactionSchema,
  UpdateTransactionSchema,
} from "./schema";
import { accounts, transactions } from "@/db/schema";

const addBalance = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  accountId: number,
  amount: number,
) => {
  await tx
    .update(accounts)
    .set({ balance: sql`${accounts.balance} + ${amount}` })
    .where(eq(accounts.id, accountId));
};

const deductBalance = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  accountId: number,
  amount: number,
) => {
  const [account] = await tx
    .select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(accounts.id, accountId));

  if (!account) throw new Error(`Account ${accountId} not found`);
  if (account.balance < amount)
    throw new Error(
      `Insufficient balance in account ${accountId}. Have: ${account.balance}, need: ${amount}`,
    );

  await tx
    .update(accounts)
    .set({ balance: sql`${accounts.balance} - ${amount}` })
    .where(eq(accounts.id, accountId));
};

const applyBalanceEffects = async (
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  data: {
    type: string;
    amount: number;
    fromAccountId?: number | null;
    toAccountId?: number | null;
    pkrReceived?: number | null;
  },
  reverse = false,
) => {
  const add = reverse ? deductBalance : addBalance;
  const deduct = reverse ? addBalance : deductBalance;

  switch (data.type) {
    case "income":
      if (data.pkrReceived && data.toAccountId) {
        await add(tx, data.toAccountId, data.pkrReceived);
      }
      break;

    case "expense":
      if (data.fromAccountId) {
        await deduct(tx, data.fromAccountId, data.amount);
      }
      break;

    case "inflow":
      if (data.toAccountId) {
        await add(tx, data.toAccountId, data.amount);
      }
      break;

    case "transfer":
      if (data.fromAccountId) {
        await deduct(tx, data.fromAccountId, data.amount);
      }
      if (data.toAccountId) {
        await add(tx, data.toAccountId, data.amount);
      }
      break;
  }
};

export const createTransactionHandler = async (data: TransactionType) => {
  try {
    const result = await db.transaction(async (tx) => {
      await applyBalanceEffects(tx, data);

      const [inserted] = await tx
        .insert(transactions)
        .values({ ...data, date: new Date(data.date) })
        .returning();

      return inserted;
    });

    return { data: { transaction: result } };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export const updateTransactionHandler = async (data: UpdateTransactionType) => {
  try {
    const result = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(transactions)
        .where(eq(transactions.id, data.id));

      if (!existing) throw new Error(`Transaction ${data.id} not found`);

      // Reverse old effects, apply new ones
      await applyBalanceEffects(tx, existing, true);
      await applyBalanceEffects(tx, data);

      const [updated] = await tx
        .update(transactions)
        .set({ ...data, date: new Date(data.date) })
        .where(eq(transactions.id, data.id))
        .returning();

      return updated;
    });

    return { data: { transaction: result } };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export const deleteTransactionHandler = async (data: DeleteTransactionType) => {
  try {
    const result = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(transactions)
        .where(eq(transactions.id, data.id));

      if (!existing) throw new Error(`Transaction ${data.id} not found`);

      await applyBalanceEffects(tx, existing, true);
      await tx.delete(transactions).where(eq(transactions.id, data.id));

      return { id: data.id };
    });

    return { data: { transaction: result } };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export const createTransaction = createSafeAction(
  TransactionSchema,
  createTransactionHandler,
);
export const updateTransaction = createSafeAction(
  UpdateTransactionSchema,
  updateTransactionHandler,
);
export const deleteTransaction = createSafeAction(
  DeleteTransactionSchema,
  deleteTransactionHandler,
);
