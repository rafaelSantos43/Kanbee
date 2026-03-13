import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // Ruta a tu archivo de esquema (donde definiste la tabla 'users')
  schema: './src/infrastructure/database/schema.ts',

  // Carpeta donde se guardarán los archivos .sql de las migraciones
  out: './drizzle',

  // Dialecto de la base de datos
  dialect: 'sqlite',

  dbCredentials: {
    // Ruta a tu archivo de base de datos local (.db o .sqlite)
    url: './sqlite.db',
  },
})
