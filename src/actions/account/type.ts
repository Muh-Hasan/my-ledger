import { z } from "zod";
import { AccountSchema, DeleteAccountSchema } from "./schema";

export type AccountType = z.infer<typeof AccountSchema>;
export type DeleteAccountType = z.infer<typeof DeleteAccountSchema>;
