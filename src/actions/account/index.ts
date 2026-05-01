import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AccountType, DeleteAccountType } from "./type";
import { createSafeAction } from "@/lib/create-safe-action";
import { AccountSchema, DeleteAccountSchema } from "./schema";

const createAccountHandler = async (data: AccountType) => {
  try {
    const newAccount = await db.insert(accounts).values(data).returning();
    return { data: { account: newAccount } };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during account creation",
    };
  }
};

const deleteAccountHandler = async (data: DeleteAccountType) => {
  try {
    const deletedAccount = await db
      .delete(accounts)
      .where(eq(accounts.id, data.id))
      .returning();
    return { data: { account: deletedAccount } };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during account deletion",
    };
  }
};

export const createAccount = createSafeAction(
  AccountSchema,
  createAccountHandler,
);
export const deleteAccount = createSafeAction(
  DeleteAccountSchema,
  deleteAccountHandler,
);
