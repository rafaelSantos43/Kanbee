import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as SQLite from 'expo-sqlite'

import * as schema from './schema'

type SQLiteDatabaseCompat = ReturnType<typeof SQLite.openDatabaseSync> & {
  getAllSync?: (sql: string) => Array<Record<string, unknown>>
}

const sqlite = SQLite.openDatabaseSync('kanbee_v8.db') as SQLiteDatabaseCompat

const getAllSync = (sql: string) => {
  if (typeof sqlite.getAllSync === 'function') {
    return sqlite.getAllSync(sql)
  }

  return []
}

const tableExists = (tableName: string) =>
  getAllSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`).length > 0

const columnExists = (tableName: string, columnName: string) =>
  (getAllSync(`PRAGMA table_info(${tableName})`) as Array<Record<string, unknown>>).some((column) => {
    const name = typeof column['name'] === 'string' ? column['name'] : ''
    return name === columnName
  })

const ensureColumn = (tableName: string, columnName: string, definition: string) => {
  if (!columnExists(tableName, columnName)) {
    sqlite.execSync(`ALTER TABLE ${tableName} ADD COLUMN ${definition};`)
  }
}

const ensureIndex = (indexName: string, tableName: string, columns: string) => {
  sqlite.execSync(`CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${columns});`)
}

sqlite.execSync('PRAGMA foreign_keys = ON;')

sqlite.execSync(`
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY NOT NULL,
  username text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  avatar text,
  role text NOT NULL,
  created_at integer NOT NULL,
  updated_at integer,
  deleted_at integer
);

CREATE TABLE IF NOT EXISTS boards (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  title text NOT NULL,
  description text,
  color text,
  cover_image text,
  is_favorite integer NOT NULL DEFAULT 0,
  is_archived integer NOT NULL DEFAULT 0,
  is_public integer NOT NULL DEFAULT 0,
  created_at integer NOT NULL,
  updated_at integer,
  archived_at integer,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS board_members (
  board_id text NOT NULL,
  user_id text NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  invited_by text,
  created_at integer NOT NULL,
  PRIMARY KEY (board_id, user_id),
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lists (
  id text PRIMARY KEY NOT NULL,
  board_id text NOT NULL,
  title text NOT NULL,
  order_index integer NOT NULL,
  is_archived integer NOT NULL DEFAULT 0,
  created_at integer NOT NULL,
  updated_at integer,
  archived_at integer,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cards (
  id text PRIMARY KEY NOT NULL,
  list_id text NOT NULL,
  responsible_id text,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text,
  order_index integer NOT NULL,
  cover_color text,
  cover_image text,
  due_date integer,
  start_date integer,
  completed_at integer,
  is_archived integer NOT NULL DEFAULT 0,
  created_at integer NOT NULL,
  updated_at integer,
  archived_at integer,
  FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
  FOREIGN KEY (responsible_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS labels (
  id text PRIMARY KEY NOT NULL,
  board_id text NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS card_labels (
  card_id text NOT NULL,
  label_id text NOT NULL,
  PRIMARY KEY (card_id, label_id),
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id text PRIMARY KEY NOT NULL,
  card_id text NOT NULL,
  user_id text,
  parent_id text,
  content text NOT NULL,
  is_edited integer NOT NULL DEFAULT 0,
  created_at integer NOT NULL,
  updated_at integer,
  deleted_at integer,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS checklists (
  id text PRIMARY KEY NOT NULL,
  card_id text NOT NULL,
  title text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at integer NOT NULL,
  updated_at integer,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id text PRIMARY KEY NOT NULL,
  checklist_id text NOT NULL,
  assigned_to text,
  title text NOT NULL,
  is_completed integer NOT NULL DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0,
  due_date integer,
  completed_at integer,
  created_at integer NOT NULL,
  updated_at integer,
  FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS attachments (
  id text PRIMARY KEY NOT NULL,
  card_id text NOT NULL,
  uploaded_by text,
  name text NOT NULL,
  url text NOT NULL,
  mime_type text NOT NULL,
  size integer NOT NULL,
  created_at integer NOT NULL,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS activity_log (
  id text PRIMARY KEY NOT NULL,
  board_id text,
  card_id text,
  user_id text,
  type text NOT NULL,
  metadata text,
  created_at integer NOT NULL,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  actor_id text,
  type text NOT NULL,
  entity_type text,
  entity_id text,
  message text NOT NULL,
  is_read integer NOT NULL DEFAULT 0,
  read_at integer,
  created_at integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users (username);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);
CREATE INDEX IF NOT EXISTS boards_user_id_idx ON boards (user_id);
CREATE INDEX IF NOT EXISTS bm_board_idx ON board_members (board_id);
CREATE INDEX IF NOT EXISTS bm_user_idx ON board_members (user_id);
CREATE INDEX IF NOT EXISTS lists_board_id_idx ON lists (board_id);
CREATE INDEX IF NOT EXISTS lists_order_idx ON lists (order_index);
CREATE INDEX IF NOT EXISTS cards_list_id_idx ON cards (list_id);
CREATE INDEX IF NOT EXISTS cards_order_idx ON cards (order_index);
CREATE INDEX IF NOT EXISTS cards_status_idx ON cards (status);
CREATE INDEX IF NOT EXISTS labels_board_idx ON labels (board_id);
CREATE UNIQUE INDEX IF NOT EXISTS labels_board_name_unique ON labels (board_id, name);
CREATE INDEX IF NOT EXISTS cl_card_idx ON card_labels (card_id);
CREATE INDEX IF NOT EXISTS cl_label_idx ON card_labels (label_id);
CREATE INDEX IF NOT EXISTS comments_card_idx ON comments (card_id);
CREATE INDEX IF NOT EXISTS comments_user_idx ON comments (user_id);
CREATE INDEX IF NOT EXISTS comments_parent_idx ON comments (parent_id);
CREATE INDEX IF NOT EXISTS checklists_card_idx ON checklists (card_id);
CREATE INDEX IF NOT EXISTS ci_checklist_idx ON checklist_items (checklist_id);
CREATE INDEX IF NOT EXISTS ci_assigned_to_idx ON checklist_items (assigned_to);
CREATE INDEX IF NOT EXISTS attachments_card_idx ON attachments (card_id);
CREATE INDEX IF NOT EXISTS attachments_user_idx ON attachments (uploaded_by);
CREATE INDEX IF NOT EXISTS al_board_idx ON activity_log (board_id);
CREATE INDEX IF NOT EXISTS al_card_idx ON activity_log (card_id);
CREATE INDEX IF NOT EXISTS al_user_idx ON activity_log (user_id);
CREATE INDEX IF NOT EXISTS al_type_idx ON activity_log (type);
CREATE INDEX IF NOT EXISTS al_created_at_idx ON activity_log (created_at);
CREATE INDEX IF NOT EXISTS notif_user_idx ON notifications (user_id);
CREATE INDEX IF NOT EXISTS notif_is_read_idx ON notifications (is_read);
CREATE INDEX IF NOT EXISTS notif_created_at_idx ON notifications (created_at);
CREATE INDEX IF NOT EXISTS notif_entity_idx ON notifications (entity_type, entity_id);
`)

if (tableExists('users')) {
  ensureColumn('users', 'updated_at', 'updated_at integer')
  ensureColumn('users', 'deleted_at', 'deleted_at integer')
}

if (tableExists('boards')) {
  ensureColumn('boards', 'description', 'description text')
  ensureColumn('boards', 'cover_image', 'cover_image text')
  ensureColumn('boards', 'is_archived', 'is_archived integer NOT NULL DEFAULT 0')
  ensureColumn('boards', 'is_public', 'is_public integer NOT NULL DEFAULT 0')
  ensureColumn('boards', 'archived_at', 'archived_at integer')
}

if (tableExists('lists')) {
  ensureColumn('lists', 'is_archived', 'is_archived integer NOT NULL DEFAULT 0')
  ensureColumn('lists', 'archived_at', 'archived_at integer')
}

if (tableExists('cards')) {
  ensureColumn('cards', 'responsible_id', 'responsible_id text')
  ensureColumn('cards', 'priority', 'priority text')
  ensureColumn('cards', 'cover_color', 'cover_color text')
  ensureColumn('cards', 'cover_image', 'cover_image text')
  ensureColumn('cards', 'due_date', 'due_date integer')
  ensureColumn('cards', 'start_date', 'start_date integer')
  ensureColumn('cards', 'completed_at', 'completed_at integer')
  ensureColumn('cards', 'is_archived', 'is_archived integer NOT NULL DEFAULT 0')
  ensureColumn('cards', 'archived_at', 'archived_at integer')
  ensureIndex('cards_responsible_id_idx', 'cards', 'responsible_id')
  ensureIndex('cards_due_date_idx', 'cards', 'due_date')
}

export const db = drizzle(sqlite, { schema })

export type {
  ActivityLogInsert,
  ActivityLogRow,
  AttachmentInsert,
  AttachmentRow,
  BoardInsert,
  BoardMemberInsert,
  BoardMemberRow,
  BoardRow,
  CardInsert,
  CardRow,
  ChecklistInsert,
  ChecklistItemInsert,
  ChecklistItemRow,
  ChecklistRow,
  CommentInsert,
  CommentRow,
  LabelInsert,
  LabelRow,
  ListInsert,
  ListRow,
  NotificationInsert,
  NotificationRow,
  UserInsert,
  UserRow,
} from './schema'
