CREATE TABLE `esign_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`template_type` text,
	`template_vars` text,
	`content_html` text NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`signer_count` integer DEFAULT 1 NOT NULL,
	`signed_pdf_blob_key` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_esign_docs_status` ON `esign_documents` (`status`);--> statement-breakpoint
CREATE INDEX `idx_esign_docs_created` ON `esign_documents` (`created_at`);--> statement-breakpoint
CREATE TABLE `esign_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`signer_name` text NOT NULL,
	`signer_email` text NOT NULL,
	`signer_role` text DEFAULT 'primary' NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`signing_token` text,
	`token_expires_at` integer,
	`viewed_at` integer,
	`signed_at` integer,
	`signature_data` text,
	`signature_hash` text,
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
CREATE UNIQUE INDEX `esign_sessions_signing_token_unique` ON `esign_sessions` (`signing_token`);--> statement-breakpoint
CREATE INDEX `idx_esign_sess_doc` ON `esign_sessions` (`document_id`);--> statement-breakpoint
CREATE INDEX `idx_esign_sess_token` ON `esign_sessions` (`signing_token`);--> statement-breakpoint
CREATE INDEX `idx_esign_sess_status` ON `esign_sessions` (`status`);