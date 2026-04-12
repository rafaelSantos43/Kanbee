CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`board_id` text,
	`card_id` text,
	`user_id` text,
	`type` text NOT NULL,
	`metadata` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `al_board_idx` ON `activity_log` (`board_id`);--> statement-breakpoint
CREATE INDEX `al_card_idx` ON `activity_log` (`card_id`);--> statement-breakpoint
CREATE INDEX `al_user_idx` ON `activity_log` (`user_id`);--> statement-breakpoint
CREATE INDEX `al_type_idx` ON `activity_log` (`type`);--> statement-breakpoint
CREATE INDEX `al_created_at_idx` ON `activity_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`card_id` text NOT NULL,
	`uploaded_by` text,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `attachments_card_idx` ON `attachments` (`card_id`);--> statement-breakpoint
CREATE INDEX `attachments_user_idx` ON `attachments` (`uploaded_by`);--> statement-breakpoint
CREATE TABLE `board_members` (
	`board_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'viewer' NOT NULL,
	`invited_by` text,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`board_id`, `user_id`),
	FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`invited_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `bm_board_idx` ON `board_members` (`board_id`);--> statement-breakpoint
CREATE INDEX `bm_user_idx` ON `board_members` (`user_id`);--> statement-breakpoint
CREATE TABLE `card_labels` (
	`card_id` text NOT NULL,
	`label_id` text NOT NULL,
	PRIMARY KEY(`card_id`, `label_id`),
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cl_card_idx` ON `card_labels` (`card_id`);--> statement-breakpoint
CREATE INDEX `cl_label_idx` ON `card_labels` (`label_id`);--> statement-breakpoint
CREATE TABLE `checklist_items` (
	`id` text PRIMARY KEY NOT NULL,
	`checklist_id` text NOT NULL,
	`assigned_to` text,
	`title` text NOT NULL,
	`is_completed` integer DEFAULT false NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`due_date` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`checklist_id`) REFERENCES `checklists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ci_checklist_idx` ON `checklist_items` (`checklist_id`);--> statement-breakpoint
CREATE INDEX `ci_assigned_to_idx` ON `checklist_items` (`assigned_to`);--> statement-breakpoint
CREATE TABLE `checklists` (
	`id` text PRIMARY KEY NOT NULL,
	`card_id` text NOT NULL,
	`title` text NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `checklists_card_idx` ON `checklists` (`card_id`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`card_id` text NOT NULL,
	`user_id` text,
	`parent_id` text,
	`content` text NOT NULL,
	`is_edited` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `comments_card_idx` ON `comments` (`card_id`);--> statement-breakpoint
CREATE INDEX `comments_user_idx` ON `comments` (`user_id`);--> statement-breakpoint
CREATE INDEX `comments_parent_idx` ON `comments` (`parent_id`);--> statement-breakpoint
CREATE TABLE `labels` (
	`id` text PRIMARY KEY NOT NULL,
	`board_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `labels_board_idx` ON `labels` (`board_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `labels_board_name_unique` ON `labels` (`board_id`,`name`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`actor_id` text,
	`type` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`message` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `notif_user_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `notif_is_read_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `notif_created_at_idx` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE INDEX `notif_entity_idx` ON `notifications` (`entity_type`,`entity_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_boards` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`color` text,
	`cover_image` text,
	`is_favorite` integer DEFAULT false NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`archived_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_boards`("id", "user_id", "title", "description", "color", "cover_image", "is_favorite", "is_archived", "is_public", "created_at", "updated_at", "archived_at") SELECT "id", "user_id", "title", NULL, "color", NULL, "is_favorite", 0, 0, "created_at", "updated_at", NULL FROM `boards`;--> statement-breakpoint
DROP TABLE `boards`;--> statement-breakpoint
ALTER TABLE `__new_boards` RENAME TO `boards`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `boards_user_id_idx` ON `boards` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`list_id` text NOT NULL,
	`responsible_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'todo' NOT NULL,
	`priority` text,
	`order_index` integer NOT NULL,
	`cover_color` text,
	`cover_image` text,
	`due_date` integer,
	`start_date` integer,
	`completed_at` integer,
	`is_archived` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`archived_at` integer,
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`responsible_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_cards`("id", "list_id", "responsible_id", "title", "description", "status", "priority", "order_index", "cover_color", "cover_image", "due_date", "start_date", "completed_at", "is_archived", "created_at", "updated_at", "archived_at") SELECT "id", "list_id", NULL, "title", "description", "status", NULL, "order_index", NULL, NULL, NULL, NULL, NULL, 0, "created_at", "updated_at", NULL FROM `cards`;--> statement-breakpoint
DROP TABLE `cards`;--> statement-breakpoint
ALTER TABLE `__new_cards` RENAME TO `cards`;--> statement-breakpoint
CREATE INDEX `cards_list_id_idx` ON `cards` (`list_id`);--> statement-breakpoint
CREATE INDEX `cards_responsible_id_idx` ON `cards` (`responsible_id`);--> statement-breakpoint
CREATE INDEX `cards_order_idx` ON `cards` (`order_index`);--> statement-breakpoint
CREATE INDEX `cards_status_idx` ON `cards` (`status`);--> statement-breakpoint
CREATE INDEX `cards_due_date_idx` ON `cards` (`due_date`);--> statement-breakpoint
ALTER TABLE `lists` ADD `is_archived` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `lists` ADD `archived_at` integer;--> statement-breakpoint
CREATE INDEX `lists_board_id_idx` ON `lists` (`board_id`);--> statement-breakpoint
CREATE INDEX `lists_order_idx` ON `lists` (`order_index`);--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `deleted_at` integer;
