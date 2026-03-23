import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as SQLite from 'expo-sqlite'

import * as schema from './schema'

const sqlite = SQLite.openDatabaseSync('kanbee_v8.db')

sqlite.execSync('PRAGMA foreign_keys = ON;')

// Check if tables exist, if not, run initial migration
const tables = sqlite.getAllSync("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users', 'boards', 'lists', 'cards')")
if (tables.length < 4) {
  const migrationSQL = `CREATE TABLE \`boards\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`user_id\` text NOT NULL,
	\`title\` text NOT NULL,
	\`color\` text,
	\`is_favorite\` integer DEFAULT 0 NOT NULL,
	\`created_at\` integer NOT NULL,
	\`updated_at\` integer,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE \`cards\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`list_id\` text NOT NULL,
	\`title\` text NOT NULL,
	\`description\` text,
	\`status\` text NOT NULL,
	\`order_index\` integer NOT NULL,
	\`created_at\` integer NOT NULL,
	\`updated_at\` integer,
	FOREIGN KEY (\`list_id\`) REFERENCES \`lists\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE \`lists\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`board_id\` text NOT NULL,
	\`title\` text NOT NULL,
	\`order_index\` integer NOT NULL,
	\`created_at\` integer NOT NULL,
	\`updated_at\` integer,
	FOREIGN KEY (\`board_id\`) REFERENCES \`boards\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE \`users\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`username\` text NOT NULL,
	\`email\` text NOT NULL,
	\`password\` text NOT NULL,
	\`avatar\` text,
	\`role\` text NOT NULL,
	\`created_at\` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`users_username_unique\` ON \`users\` (\`username\`);--> statement-breakpoint
CREATE UNIQUE INDEX \`users_email_unique\` ON \`users\` (\`email\`);`
  sqlite.execSync(migrationSQL)
}

export const db = drizzle(sqlite, { schema })

export type { BoardRow, CardRow, ListRow, UserRow } from './schema'

