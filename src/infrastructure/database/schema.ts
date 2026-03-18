import { ROLES } from '@/constants/roles'
import { relations } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  role: text('role', { enum: ROLES }).notNull(),
  createdAt: integer('created_at').notNull(),
})

export const boards = sqliteTable('boards', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  color: text('color'),
  isFavorite: integer('is_favorite', { mode: 'boolean' }).notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at'),
})

export const lists = sqliteTable('lists', {
  id: text('id').primaryKey(),
  boardId: text('board_id')
    .notNull()
    .references(() => boards.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at'),
})

export const cards = sqliteTable('cards', {
  id: text('id').primaryKey(),
  listId: text('list_id')
    .notNull()
    .references(() => lists.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().$type<'todo' | 'in-progress' | 'done' | 'blocked'>(),
  orderIndex: integer('order_index').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at'),
})

export const usersRelations = relations(users, ({ many }) => ({
  boards: many(boards),
}))

export const boardsRelations = relations(boards, ({ one, many }) => ({
  user: one(users, {
    fields: [boards.userId],
    references: [users.id],
  }),
  lists: many(lists),
}))

export const listsRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, {
    fields: [lists.boardId],
    references: [boards.id],
  }),
  cards: many(cards),
}))

export const cardsRelations = relations(cards, ({ one }) => ({
  list: one(lists, {
    fields: [cards.listId],
    references: [lists.id],
  }),
}))

export const schema = {
  users,
  boards,
  lists,
  cards,
  usersRelations,
  boardsRelations,
  listsRelations,
  cardsRelations,
}

export type UserRow = typeof users.$inferSelect
export type BoardRow = typeof boards.$inferSelect
export type ListRow = typeof lists.$inferSelect
export type CardRow = typeof cards.$inferSelect
