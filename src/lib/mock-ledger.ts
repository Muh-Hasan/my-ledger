export type Wallet = {
  id: number;
  name: string;
  type: "bank" | "cash" | "e-wallet";
  balance: number;
};

export type Category = {
  id: number;
  name: string;
  type: "income" | "expense" | "transfer";
};

export type Transaction = {
  id: number;
  type: "income" | "expense" | "transfer";
  walletName: string;
  relatedWalletName?: string;
  category: string | null;
  merchant: string | null;
  createdAt: string;
  amount: number;
};

export const wallets: Wallet[] = [
  { id: 1, name: "Meezan Bank", type: "bank", balance: 214500 },
  { id: 2, name: "Cash Wallet", type: "cash", balance: 18500 },
  { id: 3, name: "NayaPay", type: "e-wallet", balance: 42750 },
];

export const initialCategories: Category[] = [
  { id: 1, name: "Salary", type: "income" },
  { id: 2, name: "Freelance", type: "income" },
  { id: 3, name: "Food", type: "expense" },
  { id: 4, name: "Transport", type: "expense" },
  { id: 5, name: "Bills", type: "expense" },
  { id: 6, name: "Shopping", type: "expense" },
  { id: 7, name: "Transfer", type: "transfer" },
];

export const transactions: Transaction[] = [
  { id: 1, type: "income", walletName: "Meezan Bank", category: "Freelance", merchant: "Fiverr", createdAt: "2026-04-18", amount: 78500 },
  { id: 2, type: "expense", walletName: "NayaPay", category: "Food", merchant: "Al-Fatah", createdAt: "2026-04-17", amount: 12640 },
  { id: 3, type: "transfer", walletName: "Meezan Bank", relatedWalletName: "NayaPay", category: null, merchant: null, createdAt: "2026-04-16", amount: 15000 },
  { id: 4, type: "expense", walletName: "Cash Wallet", category: "Transport", merchant: "InDrive", createdAt: "2026-04-15", amount: 6400 },
  { id: 5, type: "income", walletName: "NayaPay", category: "Salary", merchant: "Monthly Salary", createdAt: "2026-04-14", amount: 95000 },
  { id: 6, type: "expense", walletName: "Meezan Bank", category: "Bills", merchant: "K-Electric", createdAt: "2026-04-13", amount: 2500 },
  { id: 7, type: "expense", walletName: "Meezan Bank", category: "Shopping", merchant: "Daraz", createdAt: "2026-04-12", amount: 18400 },
  { id: 8, type: "income", walletName: "Meezan Bank", category: "Freelance", merchant: "Upwork", createdAt: "2026-04-09", amount: 32800 },
  { id: 9, type: "expense", walletName: "Cash Wallet", category: "Food", merchant: "Student Biryani", createdAt: "2026-04-08", amount: 2100 },
  { id: 10, type: "transfer", walletName: "NayaPay", relatedWalletName: "Cash Wallet", category: null, merchant: null, createdAt: "2026-04-05", amount: 5000 },
  { id: 11, type: "income", walletName: "Meezan Bank", category: "Salary", merchant: "Company Payroll", createdAt: "2026-03-31", amount: 120000 },
  { id: 12, type: "expense", walletName: "Meezan Bank", category: "Bills", merchant: "PTCL", createdAt: "2026-03-29", amount: 6200 },
  { id: 13, type: "expense", walletName: "NayaPay", category: "Transport", merchant: "Careem", createdAt: "2026-03-26", amount: 3100 },
  { id: 14, type: "income", walletName: "Meezan Bank", category: "Freelance", merchant: "Direct Client", createdAt: "2026-03-24", amount: 46800 },
  { id: 15, type: "expense", walletName: "Cash Wallet", category: "Food", merchant: "Naheed", createdAt: "2026-03-22", amount: 7200 },
  { id: 16, type: "transfer", walletName: "Meezan Bank", relatedWalletName: "Cash Wallet", category: null, merchant: null, createdAt: "2026-03-20", amount: 10000 },
  { id: 17, type: "expense", walletName: "Meezan Bank", category: "Shopping", merchant: "Ideas", createdAt: "2026-03-18", amount: 15400 },
  { id: 18, type: "income", walletName: "NayaPay", category: "Freelance", merchant: "Fiverr", createdAt: "2026-03-15", amount: 27500 },
];

export const incomeDistribution = [
  { label: "Salary", amount: 215000, share: 53 },
  { label: "Freelance", amount: 185600, share: 46 },
  { label: "Other", amount: 4200, share: 1 },
];

export const expenseDistribution = [
  { label: "Food", amount: 21940, share: 22 },
  { label: "Bills", amount: 8700, share: 9 },
  { label: "Transport", amount: 9500, share: 10 },
  { label: "Shopping", amount: 33800, share: 34 },
  { label: "Transfers", amount: 30000, share: 30 },
];

export const monthlyOverview = [
  { month: "Nov", income: 168000, expense: 95200, net: 72800 },
  { month: "Dec", income: 192500, expense: 110400, net: 82100 },
  { month: "Jan", income: 184000, expense: 102300, net: 81700 },
  { month: "Feb", income: 205300, expense: 118600, net: 86700 },
  { month: "Mar", income: 194300, expense: 59900, net: 134400 },
  { month: "Apr", income: 206300, expense: 57040, net: 149260 },
];
