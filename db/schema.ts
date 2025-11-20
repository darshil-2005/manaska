// src/db/schema.ts
import {
  boolean,
  timestamp,
  pgTable,
  text,
  integer,
  varchar,
  real,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "@auth/core/adapters"

// Optional enum (you had this for verification tokens)
export const typeOfTokenEnum = pgEnum("typeOfToken", ["FORGOT_PASSWORD", "VERIFY_TOKEN"])

// ---------------- USERS ----------------
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name").default("guest"),
  username: varchar("username", { length: 255 }).default(""),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  coins: integer("coins").default(0),
  hashedPassword: text("hashedPassword").default(""), // for credentials login
  createdAt: timestamp("createdAt").defaultNow(),
})

// ---------------- ACCOUNTS ----------------
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

// ---------------- SESSIONS ----------------
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

// ---------------- VERIFICATION TOKENS ----------------
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    typeOfToken: typeOfTokenEnum("typeOfToken").default("FORGOT_PASSWORD"),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

// MAP table
export const map = pgTable("map", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  userId: text("userId").references(() => users.id),
  url: text("url"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  pinned: boolean("pinned").default(false),
})

// INVOICE table
export const invoice = pgTable("invoice", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id),
  amount: real("amount"),
  purchase: varchar("purchase", { length: 255 }),
  comment: text("comment"),
  paymentId: varchar("paymentId", { length: 255 }),
})

// FEEDBACK table
export const feedback = pgTable("feedback", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id),
  response: text("response"),
  createdAt: timestamp("createdAt").defaultNow(),
})

// USER API KEYS table
export const userAPIKeys = pgTable("userAPIKeys", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => users.id),
  apiKey: varchar("apiKey", { length: 255 }),
})
