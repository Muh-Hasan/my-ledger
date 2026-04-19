import {
  sqliteTable,
  integer,
  real,
  text,
  check,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * =========================================
 * WALLETS
 * =========================================
 * Represents where money is stored
 *
 * Examples:
 * - Bank Account
 * - Cash Wallet
 * - Easypaisa / JazzCash
 *
 * balance:
 * - current tracked balance (can be derived later if needed)
 */
export const wallets = sqliteTable(
  "wallets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    name: text("name").notNull(),

    /**
     * wallet type
     * - cash      -> physical money
     * - bank      -> bank account
     * - e-wallet  -> apps like easypaisa, jazzcash
     */
    type: text("type").notNull(),

    balance: real("balance").notNull().default(0),

    /**
     * stored as unix timestamp (seconds)
     */
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch())`),

    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => Math.floor(Date.now() / 1000)),
  },
  (table) => ({
    typeCheck: check(
      "wallet_type_check",
      sql`${table.type} in ('cash', 'bank', 'e-wallet')`
    ),
  })
);

/**
 * =========================================
 * CATEGORIES
 * =========================================
 * Used to classify transactions
 *
 * Examples:
 *
 * income:
 * - Salary
 * - Freelance
 *
 * expense:
 * - Food
 * - Rent
 * - Bills
 *
 * transfer:
 * - usually not needed, but kept for flexibility
 */
export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    name: text("name").notNull(),

    /**
     * type of category
     * - income
     * - expense
     * - transfer (optional use)
     */
    type: text("type").notNull(),

    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch())`),

    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => Math.floor(Date.now() / 1000)),
  },
  (table) => ({
    typeCheck: check(
      "category_type_check",
      sql`${table.type} in ('income', 'expense', 'transfer')`
    ),
  })
);

/**
 * =========================================
 * TRANSACTIONS
 * =========================================
 * Core table (single source of truth)
 *
 * Handles:
 * - income
 * - expense
 * - transfer
 *
 * -----------------------------------------
 * LOGIC:
 *
 * income:
 * - walletId = where money came into
 *
 * expense:
 * - walletId = where money went from
 *
 * transfer:
 * - walletId          = source wallet
 * - relatedWalletId   = destination wallet
 *
 * -----------------------------------------
 *
 * categoryId:
 * - required for income/expense
 * - optional for transfer
 *
 * merchant:
 * - where money was spent (e.g. KFC, Daraz)
 */
export const transactions = sqliteTable(
  "transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    /**
     * always positive
     * type determines direction
     */
    amount: real("amount").notNull(),

    /**
     * transaction type
     * - income
     * - expense
     * - transfer
     */
    type: text("type").notNull(),

    /**
     * main wallet involved
     */
    walletId: integer("wallet_id")
      .notNull()
      .references(() => wallets.id, { onDelete: "cascade" }),

    /**
     * only used for transfers
     * represents destination wallet
     */
    relatedWalletId: integer("related_wallet_id").references(() => wallets.id, {
      onDelete: "cascade",
    }),

    /**
     * category:
     * - required for income/expense
     * - optional for transfer
     */
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),

    /**
     * where transaction happened
     * examples:
     * - KFC
     * - Daraz
     * - Salary (company name)
     */
    merchant: text("merchant"),

    /**
     * unix timestamp (seconds)
     */
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch())`),

    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => Math.floor(Date.now() / 1000)),
  },
  (table) => ({
    /**
     * restrict valid types
     */
    typeCheck: check(
      "transaction_type_check",
      sql`${table.type} in ('income', 'expense', 'transfer')`
    ),

    /**
     * prevent invalid amounts
     */
    amountCheck: check(
      "transaction_amount_check",
      sql`${table.amount} > 0`
    ),

    /**
     * transfer must have destination wallet
     */
    transferRelatedWalletCheck: check(
      "transaction_transfer_related_wallet_check",
      sql`
        (${table.type} != 'transfer')
        or
        (${table.relatedWalletId} is not null)
      `
    ),

    /**
     * prevent same wallet transfer
     */
    differentWalletCheck: check(
      "transaction_different_wallet_check",
      sql`
        ${table.relatedWalletId} is null
        or
        ${table.relatedWalletId} != ${table.walletId}
      `
    ),

    /**
     * indexes for performance
     */
    walletIdx: index("transactions_wallet_id_idx").on(table.walletId),
    categoryIdx: index("transactions_category_id_idx").on(table.categoryId),
    typeIdx: index("transactions_type_idx").on(table.type),
  })
);