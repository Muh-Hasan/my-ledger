import { z } from "zod";
import { code as getCurrencyCode } from "currency-codes";

export const AccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(
    [
      "bank",
      "e_wallet",
      "cash",
      "forex_holding",
    ],
    {
      error: "Account type must be one of the allowed values",
    },
  ),
  currency: z
    .string()
    .min(3, "Currency must be a valid ISO code")
    .max(3, "Currency must be a valid ISO code")
    .refine((currency) => getCurrencyCode(currency), {
      message: "Currency must be a valid ISO code",
    }),
  balance: z.number({error: "Balance must be a number"}).positive("Balance must greater than or equal to 0"),
});

export const DeleteAccountSchema = z.object({
  id: z.number().int().positive("Account ID must be a number"),
});
