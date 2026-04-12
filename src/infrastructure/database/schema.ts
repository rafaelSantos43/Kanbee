import { ROLES } from "@/constants/roles";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// ENUMS  (constantes tipadas — SQLite no tiene tipo ENUM nativo)
// ---------------------------------------------------------------------------

export const BOARD_MEMBER_ROLES = [
  "owner",
  "admin",
  "editor",
  "viewer",
] as const;
export type BoardMemberRole = (typeof BOARD_MEMBER_ROLES)[number];

export const CARD_STATUSES = [
  "todo",
  "in-progress",
  "done",
  "blocked",
] as const;
export type CardStatus = (typeof CARD_STATUSES)[number];

export const CARD_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type CardPriority = (typeof CARD_PRIORITIES)[number];

export const NOTIFICATION_TYPES = [
  "card_assigned",
  "card_due_soon",
  "card_overdue",
  "comment_added",
  "board_invited",
  "checklist_completed",
  "attachment_added",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const ACTIVITY_TYPES = [
  "card_created",
  "card_moved",
  "card_renamed",
  "card_assigned",
  "card_unassigned",
  "card_status_changed",
  "card_due_date_set",
  "card_archived",
  "card_restored",
  "comment_added",
  "comment_deleted",
  "label_added",
  "label_removed",
  "checklist_item_checked",
  "checklist_item_unchecked",
  "attachment_added",
  "attachment_removed",
  "list_created",
  "list_renamed",
  "list_archived",
  "board_created",
  "board_renamed",
  "member_added",
  "member_removed",
  "member_role_changed",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ENTITY_TYPES = ["board", "card", "comment", "checklist"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// ---------------------------------------------------------------------------
// USERS
// ---------------------------------------------------------------------------

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  role: text("role", { enum: ROLES }).notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at"),
  deletedAt: integer("deleted_at"), // soft delete
});

// ---------------------------------------------------------------------------
// BOARDS
// ---------------------------------------------------------------------------

export const boards = sqliteTable(
  "boards",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    color: text("color"),
    coverImage: text("cover_image"),
    isFavorite: integer("is_favorite", { mode: "boolean" })
      .notNull()
      .default(false),
    isArchived: integer("is_archived", { mode: "boolean" })
      .notNull()
      .default(false),
    isPublic: integer("is_public", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at"),
    archivedAt: integer("archived_at"),
  },
  (t) => [index("boards_user_id_idx").on(t.userId)],
);

// ---------------------------------------------------------------------------
// BOARD MEMBERS
// ---------------------------------------------------------------------------

export const boardMembers = sqliteTable(
  "board_members",
  {
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: BOARD_MEMBER_ROLES })
      .notNull()
      .default("viewer"),
    invitedBy: text("invited_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.boardId, t.userId] }),
    index("bm_board_idx").on(t.boardId),
    index("bm_user_idx").on(t.userId),
  ],
);

// ---------------------------------------------------------------------------
// LISTS
// ---------------------------------------------------------------------------

export const lists = sqliteTable(
  "lists",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    orderIndex: integer("order_index").notNull(),
    isArchived: integer("is_archived", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at"),
    archivedAt: integer("archived_at"),
  },
  (t) => [
    index("lists_board_id_idx").on(t.boardId),
    index("lists_order_idx").on(t.orderIndex),
  ],
);

// ---------------------------------------------------------------------------
// CARDS
// ---------------------------------------------------------------------------

export const cards = sqliteTable(
  "cards",
  {
    id: text("id").primaryKey(),
    listId: text("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    responsibleId: text("responsible_id").references(() => users.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", { enum: CARD_STATUSES }).notNull().default("todo"),
    priority: text("priority", { enum: CARD_PRIORITIES }),
    orderIndex: integer("order_index").notNull(),
    coverColor: text("cover_color"),
    coverImage: text("cover_image"),
    dueDate: integer("due_date"),
    startDate: integer("start_date"),
    completedAt: integer("completed_at"),
    isArchived: integer("is_archived", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at"),
    archivedAt: integer("archived_at"),
  },
  (t) => [
    index("cards_list_id_idx").on(t.listId),
    index("cards_responsible_id_idx").on(t.responsibleId),
    index("cards_order_idx").on(t.orderIndex),
    index("cards_status_idx").on(t.status),
    index("cards_due_date_idx").on(t.dueDate),
  ],
);

// ---------------------------------------------------------------------------
// LABELS
// ---------------------------------------------------------------------------

export const labels = sqliteTable(
  "labels",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull(),
  },
  (t) => [
    index("labels_board_idx").on(t.boardId),
    unique("labels_board_name_unique").on(t.boardId, t.name),
  ],
);

// ---------------------------------------------------------------------------
// CARD LABELS  (junction)
// ---------------------------------------------------------------------------

export const cardLabels = sqliteTable(
  "card_labels",
  {
    cardId: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.cardId, t.labelId] }),
    index("cl_card_idx").on(t.cardId),
    index("cl_label_idx").on(t.labelId),
  ],
);

// ---------------------------------------------------------------------------
// COMMENTS
// ---------------------------------------------------------------------------

export const comments = sqliteTable(
  "comments",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    parentId: text("parent_id"), // respuestas anidadas (self-ref)
    content: text("content").notNull(),
    isEdited: integer("is_edited", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at"),
    deletedAt: integer("deleted_at"), // soft delete
  },
  (t) => [
    index("comments_card_idx").on(t.cardId),
    index("comments_user_idx").on(t.userId),
    index("comments_parent_idx").on(t.parentId),
  ],
);

// ---------------------------------------------------------------------------
// CHECKLISTS  (una card puede tener varios grupos)
// ---------------------------------------------------------------------------

export const checklists = sqliteTable(
  "checklists",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at"),
  },
  (t) => [index("checklists_card_idx").on(t.cardId)],
);

// ---------------------------------------------------------------------------
// CHECKLIST ITEMS
// ---------------------------------------------------------------------------

export const checklistItems = sqliteTable(
  "checklist_items",
  {
    id: text("id").primaryKey(),
    checklistId: text("checklist_id")
      .notNull()
      .references(() => checklists.id, { onDelete: "cascade" }),
    assignedTo: text("assigned_to").references(() => users.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    isCompleted: integer("is_completed", { mode: "boolean" })
      .notNull()
      .default(false),
    orderIndex: integer("order_index").notNull().default(0),
    dueDate: integer("due_date"),
    completedAt: integer("completed_at"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at"),
  },
  (t) => [
    index("ci_checklist_idx").on(t.checklistId),
    index("ci_assigned_to_idx").on(t.assignedTo),
  ],
);

// ---------------------------------------------------------------------------
// ATTACHMENTS
// ---------------------------------------------------------------------------

export const attachments = sqliteTable(
  "attachments",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    uploadedBy: text("uploaded_by").references(() => users.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(), // nombre de display
    url: text("url").notNull(), // URL del archivo (S3, R2, etc.)
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(), // bytes
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    index("attachments_card_idx").on(t.cardId),
    index("attachments_user_idx").on(t.uploadedBy),
  ],
);

// ---------------------------------------------------------------------------
// ACTIVITY LOG
// ---------------------------------------------------------------------------

export const activityLog = sqliteTable(
  "activity_log",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id").references(() => boards.id, {
      onDelete: "cascade",
    }),
    cardId: text("card_id").references(() => cards.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    type: text("type", { enum: ACTIVITY_TYPES }).notNull(),
    // JSON con metadata del evento: { from, to, value, etc. }
    metadata: text("metadata", { mode: "json" }).$type<
      Record<string, unknown>
    >(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    index("al_board_idx").on(t.boardId),
    index("al_card_idx").on(t.cardId),
    index("al_user_idx").on(t.userId),
    index("al_type_idx").on(t.type),
    index("al_created_at_idx").on(t.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// NOTIFICATIONS
// ---------------------------------------------------------------------------

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actorId: text("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    type: text("type", { enum: NOTIFICATION_TYPES }).notNull(),
    entityType: text("entity_type", { enum: ENTITY_TYPES }),
    entityId: text("entity_id"),
    message: text("message").notNull(),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    readAt: integer("read_at"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    index("notif_user_idx").on(t.userId),
    index("notif_is_read_idx").on(t.isRead),
    index("notif_created_at_idx").on(t.createdAt),
    index("notif_entity_idx").on(t.entityType, t.entityId),
  ],
);

// ===========================================================================
// RELATIONS
// ===========================================================================

export const usersRelations = relations(users, ({ many }) => ({
  ownedBoards: many(boards),
  boardMemberships: many(boardMembers),
  assignedCards: many(cards),
  comments: many(comments),
  attachments: many(attachments),
  activityLog: many(activityLog),
  notifications: many(notifications),
  checklistItems: many(checklistItems),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
  owner: one(users, { fields: [boards.userId], references: [users.id] }),
  members: many(boardMembers),
  lists: many(lists),
  labels: many(labels),
  activityLog: many(activityLog),
}));

export const boardMembersRelations = relations(boardMembers, ({ one }) => ({
  board: one(boards, {
    fields: [boardMembers.boardId],
    references: [boards.id],
  }),
  user: one(users, { fields: [boardMembers.userId], references: [users.id] }),
  invitedBy: one(users, {
    fields: [boardMembers.invitedBy],
    references: [users.id],
  }),
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, { fields: [lists.boardId], references: [boards.id] }),
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  list: one(lists, { fields: [cards.listId], references: [lists.id] }),
  responsible: one(users, {
    fields: [cards.responsibleId],
    references: [users.id],
  }),
  labels: many(cardLabels),
  comments: many(comments),
  checklists: many(checklists),
  attachments: many(attachments),
  activityLog: many(activityLog),
}));

export const labelsRelations = relations(labels, ({ one, many }) => ({
  board: one(boards, { fields: [labels.boardId], references: [boards.id] }),
  cards: many(cardLabels),
}));

export const cardLabelsRelations = relations(cardLabels, ({ one }) => ({
  card: one(cards, { fields: [cardLabels.cardId], references: [cards.id] }),
  label: one(labels, { fields: [cardLabels.labelId], references: [labels.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  card: one(cards, { fields: [comments.cardId], references: [cards.id] }),
  author: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
}));

export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  card: one(cards, { fields: [checklists.cardId], references: [cards.id] }),
  items: many(checklistItems),
}));

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  checklist: one(checklists, {
    fields: [checklistItems.checklistId],
    references: [checklists.id],
  }),
  assignedTo: one(users, {
    fields: [checklistItems.assignedTo],
    references: [users.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  card: one(cards, { fields: [attachments.cardId], references: [cards.id] }),
  uploadedBy: one(users, {
    fields: [attachments.uploadedBy],
    references: [users.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  board: one(boards, {
    fields: [activityLog.boardId],
    references: [boards.id],
  }),
  card: one(cards, { fields: [activityLog.cardId], references: [cards.id] }),
  user: one(users, { fields: [activityLog.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  actor: one(users, {
    fields: [notifications.actorId],
    references: [users.id],
  }),
}));

// ===========================================================================
// SCHEMA EXPORT  (para drizzle.config.ts)
// ===========================================================================

export const schema = {
  // core
  users,
  boards,
  boardMembers,
  lists,
  cards,
  labels,
  cardLabels,
  // features
  comments,
  checklists,
  checklistItems,
  attachments,
  activityLog,
  notifications,
};

// ===========================================================================
// INFERRED TYPES
// ===========================================================================

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export type BoardRow = typeof boards.$inferSelect;
export type BoardInsert = typeof boards.$inferInsert;

export type BoardMemberRow = typeof boardMembers.$inferSelect;
export type BoardMemberInsert = typeof boardMembers.$inferInsert;

export type ListRow = typeof lists.$inferSelect;
export type ListInsert = typeof lists.$inferInsert;

export type CardRow = typeof cards.$inferSelect;
export type CardInsert = typeof cards.$inferInsert;

export type LabelRow = typeof labels.$inferSelect;
export type LabelInsert = typeof labels.$inferInsert;

export type CommentRow = typeof comments.$inferSelect;
export type CommentInsert = typeof comments.$inferInsert;

export type ChecklistRow = typeof checklists.$inferSelect;
export type ChecklistInsert = typeof checklists.$inferInsert;

export type ChecklistItemRow = typeof checklistItems.$inferSelect;
export type ChecklistItemInsert = typeof checklistItems.$inferInsert;

export type AttachmentRow = typeof attachments.$inferSelect;
export type AttachmentInsert = typeof attachments.$inferInsert;

export type ActivityLogRow = typeof activityLog.$inferSelect;
export type ActivityLogInsert = typeof activityLog.$inferInsert;

export type NotificationRow = typeof notifications.$inferSelect;
export type NotificationInsert = typeof notifications.$inferInsert;
