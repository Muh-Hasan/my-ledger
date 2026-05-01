import { z } from "zod";

export const AccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(
    [
      "bank",
      "e_wallet",
      "cash",
      "payment_channel",
      "forex_holding",
      "brokerage",
    ],
    {
      error: "Account type must be one of the allowed values",
    },
  ),
  currency: z
    .string()
    .min(3, "Currency must be a valid ISO code")
    .max(3, "Currency must be a valid ISO code"),
  balance: z.number().default(0),
});


export const DeleteAccountSchema = z.object({
  id: z.number().int().positive("Account ID must be a number"),
});