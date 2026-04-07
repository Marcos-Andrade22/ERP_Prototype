import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import * as dotenv from "dotenv";
dotenv.config();

const sqlite = new Database(process.env.DB_PATH ?? "./database.sqlite");

// Performance: WAL mode para leituras/escritas simultâneas
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
