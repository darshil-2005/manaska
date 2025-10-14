import { pgTable, serial, text, varchar, integer, boolean, real, timestamp, date, primaryKey, foreignKey } from "drizzle-orm/pg-core";

// ---------------- USERS ----------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }),
  email: varchar("email", { length: 255 }),
  hashedPassword: text("hashedPassword"),
  email_verified: boolean("email_verified").default(false),
  avatar: text("avatar") ,
  createdAt: timestamp("createdAt").defaultNow(),
  coins: integer("coins").default(0),
});

// ---------------- OAUTH ACCOUNTS ----------------
export const oauth_accounts = pgTable("oauth_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  oauth_id: varchar("oauth_id", { length: 255 }),
  oauth_provider: varchar("oauth_provider", { length: 255 }),
  refresh_token: text("refresh_token"),
  access_token: text("access_token") ,
  expires_at: integer("expires_at") ,
  token_type: text("token_type") ,
  scope: text("scope") ,
  id_token: text("id_token") ,
  session_state: text("session_state") ,
});

// ---------------- MAP ----------------
export const map = pgTable("map", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description") ,
  userId: integer("userId").references(() => users.id),
  url: text("url") ,
  createdAt: date("createdAt").defaultNow(),
  updatedAt: date("updatedAt").defaultNow(),
  pinned: date("pinned") ,
});

// ---------------- INVOICE ----------------
export const invoice = pgTable("invoice", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: integer("userId").references(() => users.id),
  amount:  real("amount"),
  purchase: varchar("purchase", { length: 255 }),
  comment: text("comment") ,
  paymentId: varchar("paymentId", { length: 255 }) ,
});

// ---------------- FEEDBACK ----------------
export const feedback = pgTable("feedback", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: integer("userId").references(() => users.id),
  response: text("response"),
  createdAt: date("createdAt").defaultNow(),
});

// ---------------- USER API KEYS ----------------
export const userAPIKeys = pgTable("userAPIKeys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: integer("userId").references(() => users.id),
  apiKey: varchar("apiKey", { length: 255 }),
});
