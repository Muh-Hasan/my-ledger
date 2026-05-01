import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ═══════════════════════════════════════════════════════════════
// 1. ACCOUNTS
// ═══════════════════════════════════════════════════════════════
// Every place where money sits: bank, e-wallet, cash, payment
// channel, forex holding, brokerage.

export const accounts = sqliteTable("accounts", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull(), // "HBL Main", "JazzCash", "Cash at Home", "USD Cash"
  type: text({
    enum: [
      "bank",
      "e_wallet",
      "cash",
      "payment_channel",
      "forex_holding",
      "brokerage",
    ],
  }).notNull(),
  currency: text().notNull(), // PKR, USD, EUR, etc.
  balance: integer().notNull().default(0), // smallest unit (paisa/cents)
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ═══════════════════════════════════════════════════════════════
// 2. CATEGORIES
// ═══════════════════════════════════════════════════════════════
// User-managed categories for expenses and inflows.
// Add, edit, delete without touching schema.

export const categories = sqliteTable("categories", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text().notNull(), // "Food", "Travel", "Family Support", "Gift", etc.
  type: text({
    enum: ["expense", "inflow"],
  }).notNull(), // which transaction type this category belongs to
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ═══════════════════════════════════════════════════════════════
// 3. TRANSACTIONS
// ═══════════════════════════════════════════════════════════════
// Unified table for ALL money movement:
//
//   type = "income"    → money earned (freelance or fulltime)
//   type = "expense"   → money spent
//   type = "inflow"    → money received but not earned (father, gift, refund)
//   type = "transfer"  → money moved between own accounts
//
// Each type uses a different subset of nullable fields.
// Account direction:
//   income/inflow  → toAccountId (where money lands)
//   expense        → fromAccountId (where money leaves)
//   transfer       → both fromAccountId and toAccountId

export const transactions = sqliteTable("transactions", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  date: integer({ mode: "timestamp" }).notNull(), // YYYY-MM-DDD

  type: text({
    enum: ["income", "expense", "inflow", "transfer"],
  }).notNull(),

  amount: integer({ mode: "number" }).notNull(), // smallest currency unit
  currency: text().notNull(), // original currency

  // ── Account references ──
  fromAccountId: integer({ mode: "number" }).references(() => accounts.id),
  toAccountId: integer({ mode: "number" }).references(() => accounts.id),

  // ── Category (expense & inflow) ──
  categoryId: integer({ mode: "number" }).references(() => categories.id),

  // ── Income fields (freelance/fulltime only) ──
  incomeType: text({
    enum: ["freelance", "fulltime"],
  }),
  sourceType: text({
    enum: ["platform", "direct", "employer"],
  }),
  sourceName: text(), // "Fiverr", "Upwork", client name, employer
  paymentChannel: text({
    enum: ["wise", "payoneer", "wire_transfer", "elevate_pay"],
  }),
  pkrReceived: integer({ mode: "number" }), // final PKR in bank (null = pending)

  // ── Inflow fields ──
  inflowSource: text(), // "Father", "Amazon Refund", etc.

  // ── Shared ──
  notes: text(),

  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ═══════════════════════════════════════════════════════════════
// 4. INVESTMENTS — STOCKS
// ═══════════════════════════════════════════════════════════════

// export const investmentsStock = sqliteTable("investments_stock", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   date: text("date").notNull(), // YYYY-MM-DD
//   action: text("action", { enum: ["buy", "sell"] }).notNull(),
//   stockSymbol: text("stock_symbol").notNull(),
//   stockName: text("stock_name"),
//   quantity: real("quantity").notNull(),
//   pricePerShare: integer("price_per_share").notNull(),
//   totalAmount: integer("total_amount").notNull(),
//   sourceAccountId: integer("source_account_id")
//     .notNull()
//     .references(() => accounts.id),
//   notes: text("notes"),
//   createdAt: text("created_at")
//     .notNull()
//     .$defaultFn(() => new Date().toISOString()),
// });

// ═══════════════════════════════════════════════════════════════
// 5. INVESTMENTS — FOREX
// ═══════════════════════════════════════════════════════════════
// Physical foreign currency cash.
// Buy: paid X PKR for Y USD. Sell: sold Y USD got X PKR.

// export const investmentsForex = sqliteTable("investments_forex", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   date: text("date").notNull(), // YYYY-MM-DD
//   action: text("action", { enum: ["buy", "sell"] }).notNull(),
//   currency: text("currency").notNull(), // USD, EUR, etc.
//   foreignAmount: integer("foreign_amount").notNull(),
//   pkrAmount: integer("pkr_amount").notNull(),
//   source: text("source"), // dealer name
//   notes: text("notes"),
//   createdAt: text("created_at")
//     .notNull()
//     .$defaultFn(() => new Date().toISOString()),
// });

// ═══════════════════════════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════════════════════════

export const accountsRelations = relations(accounts, ({ many }) => ({
  outgoingTransactions: many(transactions, { relationName: "fromAccount" }),
  incomingTransactions: many(transactions, { relationName: "toAccount" }),
  // stockInvestments: many(investmentsStock),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  fromAccount: one(accounts, {
    fields: [transactions.fromAccountId],
    references: [accounts.id],
    relationName: "fromAccount",
  }),
  toAccount: one(accounts, {
    fields: [transactions.toAccountId],
    references: [accounts.id],
    relationName: "toAccount",
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

// export const investmentsStockRelations = relations(
//   investmentsStock,
//   ({ one }) => ({
//     sourceAccount: one(accounts, {
//       fields: [investmentsStock.sourceAccountId],
//       references: [accounts.id],
//     }),
//   }),
// );
