"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Banknote,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  Filter,
  Landmark,
  ListPlus,
  Search,
  Tags,
  Trash2,
  WalletCards,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useForm, type Control, type FieldPath, type FieldValues } from "react-hook-form"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import AddAccountForm from "@/components/account/add-account-form"

const money = new Intl.NumberFormat("en-PK", {
  currency: "PKR",
  maximumFractionDigits: 0,
  style: "currency",
})

const accountSchema = z.object({
  currency: z.string().min(1, "Choose a currency"),
  initialBalance: z.coerce.number().nonnegative("Use 0 or more"),
  name: z.string().min(2, "Account name is required"),
  type: z.string().min(1, "Choose a type"),
})

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  type: z.string().min(1, "Choose a type"),
})

const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount is required"),
  category: z.string().min(1, "Choose a category"),
  description: z.string().optional(),
  sourceAccount: z.string().min(1, "Choose an account"),
})

const incomeSchema = z.object({
  amount: z.coerce.number().positive("Amount is required"),
  currency: z.string().min(1, "Choose a currency"),
  pkrReceived: z.coerce.number().nonnegative().optional(),
  sourceName: z.string().min(2, "Source is required"),
  sourceType: z.string().min(1, "Choose a source type"),
})

const transferSchema = z.object({
  amount: z.coerce.number().positive("Amount is required"),
  fromAccount: z.string().min(1, "Choose source"),
  notes: z.string().optional(),
  toAccount: z.string().min(1, "Choose destination"),
})

const accounts = [
  { name: "HBL Main", type: "Bank", balance: 1842500, currency: "PKR" },
  { name: "Wise", type: "Payment channel", balance: 312000, currency: "PKR" },
  { name: "Cash at Home", type: "Cash", balance: 86500, currency: "PKR" },
  { name: "USD Cash", type: "Forex holding", balance: 278000, currency: "USD" },
]

const initialCategories = [
  { id: "cat-food", name: "Food", type: "Expense" },
  { id: "cat-family", name: "Family support", type: "Expense" },
  { id: "cat-bills", name: "Bills", type: "Expense" },
  { id: "cat-freelance", name: "Freelance", type: "Income" },
  { id: "cat-forex", name: "Forex", type: "Investment" },
]

const initialTransactions = [
  {
    account: "HBL Main",
    amount: 95000,
    category: "Freelance",
    currency: "PKR",
    date: "Apr 26, 2026",
    description: "Fiverr payout received",
    status: "Received",
    type: "Income",
    id: "txn-001",
  },
  {
    account: "HBL Main",
    amount: -180000,
    category: "Family support",
    currency: "PKR",
    date: "Apr 24, 2026",
    description: "Monthly family transfer",
    status: "Cleared",
    type: "Expense",
    id: "txn-002",
  },
  {
    account: "Cash at Home",
    amount: 25000,
    category: "Transfer",
    currency: "PKR",
    date: "Apr 22, 2026",
    description: "ATM withdrawal",
    status: "Internal",
    type: "Transfer",
    id: "txn-003",
  },
  {
    account: "Wise",
    amount: 142000,
    category: "Direct client",
    currency: "PKR",
    date: "Apr 18, 2026",
    description: "EUR invoice settled",
    status: "Received",
    type: "Income",
    id: "txn-004",
  },
  {
    account: "HBL Main",
    amount: -18500,
    category: "Subscriptions",
    currency: "PKR",
    date: "Apr 15, 2026",
    description: "Software tools",
    status: "Cleared",
    type: "Expense",
    id: "txn-005",
  },
  {
    account: "USD Cash",
    amount: 278000,
    category: "Forex",
    currency: "PKR",
    date: "Apr 12, 2026",
    description: "Bought physical USD",
    status: "Held",
    type: "Investment",
    id: "txn-006",
  },
  {
    account: "HBL Main",
    amount: -74000,
    category: "Food",
    currency: "PKR",
    date: "Apr 10, 2026",
    description: "Groceries and eating out",
    status: "Cleared",
    type: "Expense",
    id: "txn-007",
  },
  {
    account: "HBL Main",
    amount: -56000,
    category: "Bills",
    currency: "PKR",
    date: "Apr 07, 2026",
    description: "Utilities and mobile",
    status: "Cleared",
    type: "Expense",
    id: "txn-008",
  },
  {
    account: "Wise",
    amount: 312000,
    category: "Freelance",
    currency: "PKR",
    date: "Apr 04, 2026",
    description: "Contract milestone",
    status: "Received",
    type: "Income",
    id: "txn-009",
  },
  {
    account: "Cash at Home",
    amount: -42000,
    category: "Travel",
    currency: "PKR",
    date: "Apr 01, 2026",
    description: "Fuel and ride hailing",
    status: "Cleared",
    type: "Expense",
    id: "txn-010",
  },
]

const expenses: Array<[string, number]> = [
  ["Food", 74000],
  ["Family support", 180000],
  ["Bills", 56000],
  ["Subscriptions", 18500],
  ["Travel", 42000],
]

type Entry = { label: string; value: string }
type AccountInput = z.input<typeof accountSchema>
type AccountOutput = z.output<typeof accountSchema>
type Category = (typeof initialCategories)[number]
type CategoryInput = z.input<typeof categorySchema>
type CategoryOutput = z.output<typeof categorySchema>
type ExpenseInput = z.input<typeof expenseSchema>
type ExpenseOutput = z.output<typeof expenseSchema>
type IncomeInput = z.input<typeof incomeSchema>
type IncomeOutput = z.output<typeof incomeSchema>
type TransferInput = z.input<typeof transferSchema>
type TransferOutput = z.output<typeof transferSchema>

export default function Home() {
  const [latestEntry, setLatestEntry] = useState<Entry>({
    label: "Ready",
    value: "Create actions open in dialogs.",
  })
  const [accountFilter, setAccountFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState("5")
  const [searchQuery, setSearchQuery] = useState("")
  const [managedCategories, setManagedCategories] = useState(initialCategories)
  const [transactionRows, setTransactionRows] = useState(initialTransactions)
  const [typeFilter, setTypeFilter] = useState("all")

  const accountForm = useForm<AccountInput, unknown, AccountOutput>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currency: "PKR",
      initialBalance: 0,
      name: "",
      type: "bank",
    },
  })

  const categoryForm = useForm<CategoryInput, unknown, CategoryOutput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "Expense",
    },
  })

  const expenseForm = useForm<ExpenseInput, unknown, ExpenseOutput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 2500,
      category: "Food",
      description: "",
      sourceAccount: "HBL Main",
    },
  })

  const incomeForm = useForm<IncomeInput, unknown, IncomeOutput>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: 500,
      currency: "USD",
      pkrReceived: 0,
      sourceName: "Fiverr",
      sourceType: "platform",
    },
  })

  const transferForm = useForm<TransferInput, unknown, TransferOutput>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: 10000,
      fromAccount: "HBL Main",
      notes: "",
      toAccount: "Cash at Home",
    },
  })

  const totals = useMemo(() => {
    const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0)
    const expenseTotal = expenses.reduce((sum, item) => sum + item[1], 0)
    const income = transactionRows
      .filter((transaction) => transaction.type === "Income")
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const savings = income - expenseTotal

    return { expenseTotal, income, netWorth, savings }
  }, [transactionRows])

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return transactionRows.filter((transaction) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          transaction.account,
          transaction.category,
          transaction.date,
          transaction.description,
          transaction.type,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesType = typeFilter === "all" || transaction.type === typeFilter
      const matchesAccount = accountFilter === "all" || transaction.account === accountFilter

      return matchesSearch && matchesType && matchesAccount
    })
  }, [accountFilter, searchQuery, transactionRows, typeFilter])

  const transactionPageSize = Number(pageSize)
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / transactionPageSize))
  const currentPage = Math.min(page, pageCount)
  const pagedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionPageSize,
    currentPage * transactionPageSize
  )
  const pageStart = filteredTransactions.length
    ? (currentPage - 1) * transactionPageSize + 1
    : 0
  const pageEnd = Math.min(currentPage * transactionPageSize, filteredTransactions.length)

  function updateFilter(callback: () => void) {
    callback()
    setPage(1)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit gap-2 text-muted-foreground">
              <CircleDollarSign className="size-3.5" />
              Offline-first personal finance tracker
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                My Ledger
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                A compact dashboard for accounts, categories, transactions,
                expenses, transfers, and reports.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download />
              Export CSV
            </Button>
            <AddAccountForm />
            {/* <AccountDialog form={accountForm} setLatestEntry={setLatestEntry} /> */}
            <CategoryDialog
              categories={managedCategories}
              form={categoryForm}
              setCategories={setManagedCategories}
              setLatestEntry={setLatestEntry}
            />
            <EntryDialog
              categories={managedCategories}
              expenseForm={expenseForm}
              incomeForm={incomeForm}
              setLatestEntry={setLatestEntry}
              transferForm={transferForm}
            />
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Landmark}
            label="Net worth"
            value={money.format(totals.netWorth)}
            helper="Computed from accounts"
          />
          <Metric
            icon={ArrowDownLeft}
            label="Month income"
            value={money.format(totals.income)}
            helper="Received funds only"
          />
          <Metric
            icon={ArrowUpRight}
            label="Month expense"
            value={money.format(totals.expenseTotal)}
            helper="Categorized outflows"
          />
          <Metric
            icon={Banknote}
            label="Net savings"
            value={money.format(totals.savings)}
            helper="Income minus expense"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Balances are shown as current snapshots.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.map((account) => (
                <div key={account.name} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-xs text-muted-foreground">{account.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{money.format(account.balance)}</p>
                    <p className="text-xs text-muted-foreground">{account.currency}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <p className="text-sm">
                <span className="font-medium">{latestEntry.label}</span>
                <span className="text-muted-foreground"> - {latestEntry.value}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/80">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Current month by category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenses.map(([category, amount]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate">{category}</span>
                    <span className="shrink-0 text-muted-foreground">{money.format(amount)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.max(10, (amount / totals.expenseTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-white/10 bg-card/80">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>Income, expenses, transfers, and investments in one table.</CardDescription>
                </div>
                <Badge variant="outline" className="w-fit gap-2 text-muted-foreground">
                  <Filter className="size-3.5" />
                  {filteredTransactions.length} records
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.8fr_0.55fr]">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(event) =>
                      updateFilter(() => setSearchQuery(event.target.value))
                    }
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => updateFilter(() => setTypeFilter(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={accountFilter}
                  onValueChange={(value) => updateFilter(() => setAccountFilter(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All accounts</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.name} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={pageSize}
                  onValueChange={(value) => {
                    setPageSize(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 rows</SelectItem>
                    <SelectItem value="10">10 rows</SelectItem>
                    <SelectItem value="25">25 rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "Expense" ? "outline" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="text-muted-foreground">{transaction.account}</TableCell>
                      <TableCell
                        className={
                          transaction.amount < 0
                            ? "text-right text-destructive"
                            : "text-right text-foreground"
                        }
                      >
                        {money.format(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${transaction.description}`}
                          onClick={() => {
                            setTransactionRows((rows) =>
                              rows.filter((row) => row.id !== transaction.id)
                            )
                            setLatestEntry({
                              label: "Transaction deleted",
                              value: transaction.description,
                            })
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!pagedTransactions.length ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No transactions match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {pageStart}-{pageEnd} of {filteredTransactions.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft />
                    Previous
                  </Button>
                  <span className="min-w-20 text-center text-sm text-muted-foreground">
                    {currentPage} / {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                    disabled={currentPage === pageCount}
                  >
                    Next
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}



function CategoryDialog({
  categories,
  form,
  setCategories,
  setLatestEntry,
}: {
  categories: Category[]
  form: ReturnType<typeof useForm<CategoryInput, unknown, CategoryOutput>>
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  setLatestEntry: React.Dispatch<React.SetStateAction<Entry>>
}) {
  function resetForm() {
    form.reset({ name: "", type: "Expense" })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Tags />
          Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage categories</DialogTitle>
          <DialogDescription>Add categories and remove the ones you no longer use.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Form {...form}>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit((data) => {
                setCategories((items) => [
                  {
                    id: `cat-custom-${items.length + 1}-${data.name.toLowerCase().replaceAll(" ", "-")}`,
                    name: data.name,
                    type: data.type,
                  },
                  ...items,
                ])
                setLatestEntry({
                  label: "Category added",
                  value: `${data.name} (${data.type})`,
                })
                resetForm()
              })}
            >
              <TextField control={form.control} name="name" label="Name" />
              <SelectField
                control={form.control}
                name="type"
                label="Type"
                options={["Expense", "Income", "Investment", "Transfer"]}
              />
              <Button type="submit">Add Category</Button>
            </form>
          </Form>

          <div className="flex content-start items-start gap-2 rounded-lg border bg-muted/20 p-3">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="gap-2 py-1.5 pr-1"
              >
                <span>{category.name}</span>
                <span className="text-muted-foreground">/{category.type}</span>
                <button
                  type="button"
                  aria-label={`Delete ${category.name}`}
                  className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  onClick={() => {
                    setCategories((items) =>
                      items.filter((item) => item.id !== category.id)
                    )
                    setLatestEntry({
                      label: "Category deleted",
                      value: category.name,
                    })
                  }}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </Badge>
            ))}
            {!categories.length ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EntryDialog({
  categories,
  expenseForm,
  incomeForm,
  setLatestEntry,
  transferForm,
}: {
  categories: Category[]
  expenseForm: ReturnType<typeof useForm<ExpenseInput, unknown, ExpenseOutput>>
  incomeForm: ReturnType<typeof useForm<IncomeInput, unknown, IncomeOutput>>
  setLatestEntry: React.Dispatch<React.SetStateAction<Entry>>
  transferForm: ReturnType<typeof useForm<TransferInput, unknown, TransferOutput>>
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <ListPlus />
          Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add entry</DialogTitle>
          <DialogDescription>Record an expense, income item, or internal transfer.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="expense">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>
          <TabsContent value="expense" className="pt-4">
            <Form {...expenseForm}>
              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={expenseForm.handleSubmit((data) =>
                  setLatestEntry({
                    label: "Expense logged",
                    value: `${data.category} - ${money.format(data.amount)}`,
                  })
                )}
              >
                <NumberField control={expenseForm.control} name="amount" label="Amount" />
                <SelectField
                  control={expenseForm.control}
                  name="category"
                  label="Category"
                  options={categories
                    .filter((category) => category.type === "Expense")
                    .map((category) => category.name)}
                />
                <SelectField
                  control={expenseForm.control}
                  name="sourceAccount"
                  label="Source account"
                  options={accounts.map((account) => account.name)}
                />
                <TextField control={expenseForm.control} name="description" label="Description" />
                <Button className="sm:col-span-2" type="submit">
                  <Banknote />
                  Add Expense
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="income" className="pt-4">
            <Form {...incomeForm}>
              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={incomeForm.handleSubmit((data) =>
                  setLatestEntry({
                    label: "Income logged",
                    value: `${data.sourceName} - ${data.currency} ${data.amount}`,
                  })
                )}
              >
                <NumberField control={incomeForm.control} name="amount" label="Original amount" />
                <SelectField
                  control={incomeForm.control}
                  name="currency"
                  label="Currency"
                  options={["PKR", "USD", "EUR", "GBP", "AED", "SAR"]}
                />
                <SelectField
                  control={incomeForm.control}
                  name="sourceType"
                  label="Source type"
                  options={["platform", "direct", "employer"]}
                />
                <TextField control={incomeForm.control} name="sourceName" label="Source name" />
                <NumberField control={incomeForm.control} name="pkrReceived" label="PKR received" />
                <Button className="sm:self-end" type="submit">
                  <ArrowDownLeft />
                  Log Income
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="transfer" className="pt-4">
            <Form {...transferForm}>
              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={transferForm.handleSubmit((data) =>
                  setLatestEntry({
                    label: "Transfer recorded",
                    value: `${data.fromAccount} to ${data.toAccount}`,
                  })
                )}
              >
                <SelectField
                  control={transferForm.control}
                  name="fromAccount"
                  label="From"
                  options={accounts.map((account) => account.name)}
                />
                <SelectField
                  control={transferForm.control}
                  name="toAccount"
                  label="To"
                  options={accounts.map((account) => account.name)}
                />
                <NumberField control={transferForm.control} name="amount" label="Amount" />
                <FormField
                  control={transferForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="ATM withdrawal, wallet top-up..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="sm:col-span-2" type="submit">
                  <ArrowRightLeft />
                  Record Transfer
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function Metric({
  helper,
  icon: Icon,
  label,
  value,
}: {
  helper: string
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <Card className="border-white/10 bg-card/80">
      <CardContent className="flex items-start justify-between gap-3 pt-0">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        </div>
        <div className="rounded-md border bg-muted p-2">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}

function NumberField<T extends FieldValues>(props: {
  control: Control<T>
  label: string
  name: FieldPath<T>
}) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input type="number" inputMode="decimal" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function TextField<T extends FieldValues>(props: {
  control: Control<T>
  label: string
  name: FieldPath<T>
}) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function SelectField<T extends FieldValues>(props: {
  control: Control<T>
  label: string
  name: FieldPath<T>
  options: string[]
}) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={props.label} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
