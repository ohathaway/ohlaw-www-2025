CREATE TABLE `esign_fees` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`filing_fee` integer NOT NULL,
	`background_check` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
