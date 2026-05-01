import { z } from "zod";
import {
  TransactionSchema,
  DeleteTransactionSchema,
  UpdateTransactionSchema,
} from "./schema";

export type TransactionType = z.infer<typeof TransactionSchema>;
export type UpdateTransactionType = z.infer<typeof UpdateTransactionSchema>;
export type DeleteTransactionType = z.infer<typeof DeleteTransactionSchema>;
