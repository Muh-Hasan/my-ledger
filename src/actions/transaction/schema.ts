import { z } from "zod";

export const TransactionSchema = z
  .object({
    type: z.enum(["inflow", "expense", "income", "transfer"], {
      error:
        "Transaction type must be either 'inflow', 'expense', 'income', or 'transfer'",
    }),
    date: z.number().refine((val) => !isNaN(val), {
      message: "Date must be a valid timestamp",
    }),
    amount: z.number().positive("Amount must be a positive number"),
    currency: z
      .string()
      .length(3, "Currency must be a valid 3-letter ISO code"),
    notes: z.string().optional(),
    description: z.string().optional(),

    fromAccountId: z
      .number()
      .int()
      .positive("From Account ID must be a positive integer")
      .optional(),
    toAccountId: z
      .number()
      .int()
      .positive("To Account ID must be a positive integer")
      .optional(),

    categoryId: z
      .number()
      .int()
      .positive("Category ID must be a positive integer")
      .optional(),

    incomeType: z.enum(["freelance", "fulltime"]).optional(),
    sourceType: z.enum(["platform", "direct", "employer"]).optional(),
    sourceName: z.string().optional(),
    paymentChannel: z
      .enum(["wise", "payoneer", "wire_transfer", "elevate_pay"])
      .optional(),
    pkrReceived: z
      .number()
      .positive("PKR Received must be a positive number")
      .optional(),

    inflowSource: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "income") {
      if (!data.incomeType) {
        ctx.addIssue({
          code: "custom",
          message:
            "Income transactions must specify incomeType (freelance or fulltime)",
          path: ["incomeType"],
        });
      }

      if (!data.sourceType) {
        ctx.addIssue({
          code: "custom",
          message:
            "Income transactions must specify sourceType (platform, direct, or employer)",
          path: ["sourceType"],
        });
      }

      if (!data.sourceName) {
        ctx.addIssue({
          code: "custom",
          message:
            "Income transactions must specify sourceName (e.g. Fiverr, client name, employer)",
          path: ["sourceName"],
        });
      }

      // Freelance-specific: payment channel is required
      if (data.incomeType === "freelance" && !data.paymentChannel) {
        ctx.addIssue({
          code: "custom",
          message:
            "Freelance income must specify a paymentChannel (wise, payoneer, wire_transfer, elevate_pay)",
          path: ["paymentChannel"],
        });
      }

      // Fulltime must be PKR and pkrReceived should match amount
      if (data.incomeType === "fulltime") {
        if (data.currency !== "PKR") {
          ctx.addIssue({
            code: "custom",
            message: "Full-time income currency must be PKR",
            path: ["currency"],
          });
        }

        if (!data.toAccountId) {
          ctx.addIssue({
            code: "custom",
            message:
              "Full-time income must have a destination account (toAccountId)",
            path: ["toAccountId"],
          });
        }
      }

      // If pkrReceived is filled, toAccountId must also be present
      if (data.pkrReceived && !data.toAccountId) {
        ctx.addIssue({
          code: "custom",
          message:
            "When pkrReceived is set, toAccountId (bank) must also be specified",
          path: ["toAccountId"],
        });
      }

      // Employer sourceType only valid for fulltime
      if (data.sourceType === "employer" && data.incomeType !== "fulltime") {
        ctx.addIssue({
          code: "custom",
          message: "sourceType 'employer' is only valid for fulltime income",
          path: ["sourceType"],
        });
      }

      // Platform/direct sourceType only valid for freelance
      if (
        (data.sourceType === "platform" || data.sourceType === "direct") &&
        data.incomeType === "fulltime"
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "sourceType 'platform' or 'direct' is only valid for freelance income",
          path: ["sourceType"],
        });
      }
    }

    if (data.type === "expense") {
      if (!data.fromAccountId) {
        ctx.addIssue({
          code: "custom",
          message: "Expense transactions must have a fromAccountId",
          path: ["fromAccountId"],
        });
      }

      if (!data.categoryId) {
        ctx.addIssue({
          code: "custom",
          message: "Expense transactions must have a categoryId",
          path: ["categoryId"],
        });
      }
    }

    if (data.type === "inflow") {
      if (!data.toAccountId) {
        ctx.addIssue({
          code: "custom",
          message:
            "Inflow transactions must have a toAccountId (where money was added)",
          path: ["toAccountId"],
        });
      }

      if (!data.inflowSource) {
        ctx.addIssue({
          code: "custom",
          message:
            "Inflow transactions must specify inflowSource (e.g. Father, Amazon Refund)",
          path: ["inflowSource"],
        });
      }

      if (!data.categoryId) {
        ctx.addIssue({
          code: "custom",
          message: "Inflow transactions must have a categoryId",
          path: ["categoryId"],
        });
      }
    }

    if (data.type === "transfer") {
      if (!data.fromAccountId) {
        ctx.addIssue({
          code: "custom",
          message: "Transfer must have a fromAccountId (source account)",
          path: ["fromAccountId"],
        });
      }

      if (!data.toAccountId) {
        ctx.addIssue({
          code: "custom",
          message: "Transfer must have a toAccountId (destination account)",
          path: ["toAccountId"],
        });
      }

      if (
        data.fromAccountId &&
        data.toAccountId &&
        data.fromAccountId === data.toAccountId
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Transfer source and destination cannot be the same account",
          path: ["toAccountId"],
        });
      }
    }

    if (data.type !== "income") {
      const incomeOnlyFields = [
        "incomeType",
        "sourceType",
        "sourceName",
        "paymentChannel",
        "pkrReceived",
      ] as const;

      for (const field of incomeOnlyFields) {
        if (data[field] !== undefined) {
          ctx.addIssue({
            code: "custom",
            message: `'${field}' is only valid for income transactions`,
            path: [field],
          });
        }
      }
    }

    if (data.type !== "inflow" && data.inflowSource !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "'inflowSource' is only valid for inflow transactions",
        path: ["inflowSource"],
      });
    }

    if (
      (data.type === "income" || data.type === "transfer") &&
      data.categoryId !== undefined
    ) {
      ctx.addIssue({
        code: "custom",
        message: `'categoryId' is not valid for ${data.type} transactions`,
        path: ["categoryId"],
      });
    }
  });

export const UpdateTransactionSchema = TransactionSchema.extend({
  id: z.number().int().positive("Transaction ID must be a number"),
});

export const DeleteTransactionSchema = z.object({
  id: z.number().int().positive("Transaction ID must be a number"),
});
