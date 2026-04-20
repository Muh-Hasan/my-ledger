"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, BadgeDollarSign, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { initialCategories, transactions, wallets, type Transaction } from "@/lib/mock-ledger";
import { cn } from "@/lib/utils";

type EntryType = "income" | "expense" | "transfer";

type EntryFormProps = {
  mode?: "add" | "edit";
  initialTransaction?: Transaction | null;
  showFooter?: boolean;
};

const entryTypes: Array<{
  id: EntryType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "expense", label: "Expense", icon: ReceiptText },
  { id: "income", label: "Income", icon: BadgeDollarSign },
  { id: "transfer", label: "Transfer", icon: ArrowRightLeft },
];

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function getInitialType(transaction?: Transaction | null): EntryType {
  return transaction?.type ?? "expense";
}

function getInitialDate(transaction?: Transaction | null) {
  return new Date(transaction?.createdAt ?? "2026-04-19");
}

export function SmartEntryForm({
  mode = "add",
  initialTransaction = null,
  showFooter = true,
}: EntryFormProps) {
  const [type, setType] = useState<EntryType>(getInitialType(initialTransaction));
  const [date, setDate] = useState<Date | undefined>(getInitialDate(initialTransaction));

  const filteredCategories = useMemo(
    () => initialCategories.filter((category) => category.type === type),
    [type]
  );

  const presetMerchant =
    initialTransaction?.type === "transfer"
      ? `${initialTransaction.walletName} to ${initialTransaction.relatedWalletName ?? ""}`.trim()
      : initialTransaction?.merchant ?? "";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {entryTypes.map((entry) => {
          const Icon = entry.icon;
          const isActive = entry.id === type;

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setType(entry.id)}
              className={cn(
                "flex items-center gap-3 rounded-[1.25rem] border px-4 py-4 text-left transition-colors",
                isActive
                  ? "border-border bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              <span className="flex size-10 items-center justify-center rounded-2xl bg-muted">
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium">{entry.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-6 rounded-[1.75rem] border border-border bg-muted/30 p-5">
        <FieldGrid>
          <div className="space-y-2 md:col-span-2">
            <Label>Date</Label>
            <DatePicker value={date} onChange={setDate} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="12500" defaultValue={initialTransaction?.amount} />
          </div>

          {type !== "transfer" ? (
            <div className="space-y-2">
              <Label>Wallet</Label>
              <Select defaultValue={initialTransaction?.walletName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.name}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>From wallet</Label>
                <Select defaultValue={initialTransaction?.walletName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.name}>
                        {wallet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To wallet</Label>
                <Select defaultValue={initialTransaction?.relatedWalletName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.name}>
                        {wallet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {type !== "transfer" ? (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue={initialTransaction?.category ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" placeholder="Optional note" defaultValue={presetMerchant} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="merchant">{type === "income" ? "Source" : "Merchant"}</Label>
            <Input
              id="merchant"
              placeholder={type === "income" ? "Client or source" : "Merchant"}
              defaultValue={type === "transfer" ? "" : presetMerchant}
            />
          </div>
        </FieldGrid>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Optional note"
            className="min-h-28"
            defaultValue={mode === "edit" ? `Edit #${initialTransaction?.id ?? ""}` : ""}
          />
        </div>
      </div>

      {showFooter ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" className="rounded-2xl">
            Reset
          </Button>
          <Button className="rounded-2xl">
            {mode === "edit" ? "Save Changes" : "Save Entry"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function SmartEntryFormPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-7 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">New transaction</h1>
        </div>
        <SmartEntryForm />
      </div>
    </div>
  );
}

export function getMockTransactionById(id: number) {
  return transactions.find((transaction) => transaction.id === id) ?? null;
}
