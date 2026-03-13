import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const boards = sqliteTable("boards", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  color: text("color"),
  isFavorite: integer("is_favorite").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at"),
});

export const lists = sqliteTable("lists", {
  id: text("id").primaryKey(),
  boardId: text("board_id").notNull(),
  title: text("title").notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at"),
});

export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),
  listId: text("list_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["todo", "in-progress", "done", "blocked"],
  }).notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at"),
});