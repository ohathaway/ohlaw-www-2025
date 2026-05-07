PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_esign_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`signer_name` text NOT NULL,
	`signer_email` text NOT NULL,
	`signer_role` text DEFAULT '1' NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`signing_token` text,
	`token_expires_at` integer,
	`viewed_at` integer,
	`signed_at` integer,
	`signature_data` text,
	`signature_hash` text,
	`field_values` text,
	`signature_certificate` text,
	`ip_address` text,
	`user_agent` text,
	`geo_country` text,
	`geo_region` text,
	`geo_city` text,
	`terms_accepted_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `esign_documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_esign_sessions`("id", "document_id", "signer_name", "signer_email", "signer_role", "status", "signing_token", "token_expires_at", "viewed_at", "signed_at", "signature_data", "signature_hash", "field_values", "signature_certificate", "ip_address", "user_agent", "geo_country", "geo_region", "geo_city", "terms_accepted_at", "created_at", "updated_at") SELECT "id", "document_id", "signer_name", "signer_email", "signer_role", "status", "signing_token", "token_expires_at", "viewed_at", "signed_at", "signature_data", "signature_hash", "field_values", "signature_certificate", "ip_address", "user_agent", "geo_country", "geo_region", "geo_city", "terms_accepted_at", "created_at", "updated_at" FROM `esign_sessions`;--> statement-breakpoint
DROP TABLE `esign_sessions`;--> statement-breakpoint
ALTER TABLE `__new_esign_sessions` RENAME TO `esign_sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `esign_sessions_signing_token_unique` ON `esign_sessions` (`signing_token`);--> statement-breakpoint
CREATE INDEX `idx_esign_sess_doc` ON `esign_sessions` (`document_id`);--> statement-breakpoint
CREATE INDEX `idx_esign_sess_token` ON `esign_sessions` (`signing_token`);--> statement-breakpoint
CREATE INDEX `idx_esign_sess_status` ON `esign_sessions` (`status`);--> statement-breakpoint
ALTER TABLE `esign_documents` ADD `cc_recipients` text;