"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  ChartColumnIncreasing,
  Landmark,
  Smartphone,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  wallets,
  transactions,
  type Wallet as WalletType,
} from "@/lib/mock-ledger";

const walletIconMap = {
  bank: Landmark,
  cash: Banknote,
  "e-wallet": Smartphone,
};

const walletAccentMap = {
  bank: "bg-muted text-foreground",
  cash: "bg-muted text-foreground",
  "e-wallet": "bg-muted text-foreground",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function WalletCard({ wallet }: { wallet: WalletType }) {
  const Icon = walletIconMap[wallet.type];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="flex items-center justify-between p-5 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {wallet.type}
          </p>
          <p className="mt-2 text-base font-medium text-foreground">
            {wallet.name}
          </p>
          <p className="mt-5 text-2xl font-semibold text-foreground">
            {formatCurrency(wallet.balance)}
          </p>
        </div>
        <span
          className={`flex size-12 items-center justify-center rounded-2xl ${walletAccentMap[wallet.type]}`}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

export function DashboardView() {
  const netWorth = wallets.reduce((total, wallet) => total + wallet.balance, 0);
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);
  const totalExpense = transactions
    .filter((item) => item.type !== "income")
    .reduce((total, item) => total + item.amount, 0);

  return (
    <div className="">
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ChartColumnIncreasing className="size-4" />
            <p className="text-xs uppercase tracking-[0.2em]">
              Monthly snapshot
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Net worth</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {formatCurrency(netWorth)}
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowUpRight className="size-4" />
                <span>Income</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowDownRight className="size-4" />
                <span>Expense</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <WalletCard key={wallet.id} wallet={wallet} />
        ))}
      </div>
    </div>
  );
}
