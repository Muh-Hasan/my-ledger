DROP TABLE `investments_forex`;--> statement-breakpoint
DROP TABLE `investments_stock`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`currency` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "name", "type", "currency", "balance", "createdAt") SELECT "id", "name", "type", "currency", "balance", "createdAt" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "type", "createdAt") SELECT "id", "name", "type", "createdAt" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`fromAccountId` integer,
	`toAccountId` integer,
	`categoryId` integer,
	`incomeType` text,
	`sourceType` text,
	`sourceName` text,
	`paymentChannel` text,
	`pkrReceived` integer,
	`inflowSource` text,
	`notes` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`fromAccountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`toAccountId`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "date", "type", "amount", "currency", "fromAccountId", "toAccountId", "categoryId", "incomeType", "sourceType", "sourceName", "paymentChannel", "pkrReceived", "inflowSource", "notes", "createdAt") SELECT "id", "date", "type", "amount", "currency", "fromAccountId", "toAccountId", "categoryId", "incomeType", "sourceType", "sourceName", "paymentChannel", "pkrReceived", "inflowSource", "notes", "createdAt" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;