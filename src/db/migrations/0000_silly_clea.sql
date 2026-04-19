CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "category_type_check" CHECK("categories"."type" in ('income', 'expense', 'transfer'))
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` real NOT NULL,
	`type` text NOT NULL,
	`wallet_id` integer NOT NULL,
	`related_wallet_id` integer,
	`category_id` integer,
	`merchant` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "transaction_type_check" CHECK("transactions"."type" in ('income', 'expense', 'transfer')),
	CONSTRAINT "transaction_amount_check" CHECK("transactions"."amount" > 0),
	CONSTRAINT "transaction_transfer_related_wallet_check" CHECK(
        ("transactions"."type" != 'transfer')
        or
        ("transactions"."related_wallet_id" is not null)
      ),
	CONSTRAINT "transaction_different_wallet_check" CHECK(
        "transactions"."related_wallet_id" is null
        or
        "transactions"."related_wallet_id" != "transactions"."wallet_id"
      )
);
--> statement-breakpoint
CREATE INDEX `transactions_wallet_id_idx` ON `transactions` (`wallet_id`);--> statement-breakpoint
CREATE INDEX `transactions_category_id_idx` ON `transactions` (`category_id`);--> statement-breakpoint
CREATE INDEX `transactions_type_idx` ON `transactions` (`type`);--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`balance` real DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "wallet_type_check" CHECK("wallets"."type" in ('cash', 'bank', 'e-wallet'))
);
