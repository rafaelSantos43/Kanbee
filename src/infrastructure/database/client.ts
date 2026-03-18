import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as SQLite from 'expo-sqlite'

import * as schema from './schema'

const sqlite = SQLite.openDatabaseSync('kanbee_v8.db')

sqlite.execSync('PRAGMA foreign_keys = ON;')

export const db = drizzle(sqlite, { schema })

export type { BoardRow, CardRow, ListRow, UserRow } from './schema'
