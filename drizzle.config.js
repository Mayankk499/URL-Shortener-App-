import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './models/index.model.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
