CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `Alert` (
	`id` text PRIMARY KEY NOT NULL,
	`start` integer NOT NULL,
	`end` integer NOT NULL,
	`title` text,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ChangeSet` (
	`id` text PRIMARY KEY NOT NULL,
	`changes` text NOT NULL,
	`madeAt` integer NOT NULL,
	`deploymentId` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`deploymentId`) REFERENCES `Deployment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Contact` (
	`id` text PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`facebook` text NOT NULL,
	`instagram` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Deployment` (
	`id` text PRIMARY KEY NOT NULL,
	`pendingChanges` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deployedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Hours` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`open` text DEFAULT '' NOT NULL,
	`close` text DEFAULT '' NOT NULL,
	`infoId` text,
	FOREIGN KEY (`infoId`) REFERENCES `Info`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Info` (
	`id` text PRIMARY KEY NOT NULL,
	`about` text NOT NULL,
	`contactId` text NOT NULL,
	FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Menu` (
	`id` text PRIMARY KEY NOT NULL,
	`idx` integer NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '',
	`service` text DEFAULT 'dinner',
	`course` text NOT NULL,
	`disabled` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Price` (
	`id` text PRIMARY KEY NOT NULL,
	`dinner` text DEFAULT '' NOT NULL,
	`lunch` text DEFAULT '' NOT NULL,
	`hh` text DEFAULT '' NOT NULL,
	`drinks` text DEFAULT '' NOT NULL,
	`dessert` text DEFAULT '' NOT NULL,
	`menuId` text NOT NULL,
	FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Price_menuId_unique` ON `Price` (`menuId`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);