CREATE TABLE "feedback" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" integer,
	"response" text,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" integer,
	"amount" real,
	"purchase" varchar(255),
	"comment" text,
	"paymentId" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "map" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"description" text,
	"userId" integer,
	"url" text,
	"createdAt" date DEFAULT now(),
	"updatedAt" date DEFAULT now(),
	"pinned" date
);
--> statement-breakpoint
CREATE TABLE "oauth_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"oauth_id" varchar(255),
	"oauth_provider" varchar(255),
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "userAPIKeys" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" integer,
	"apiKey" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"username" varchar(255),
	"email" varchar(255),
	"hashedPassword" text,
	"email_verified" boolean DEFAULT false,
	"avatar" text,
	"createdAt" timestamp DEFAULT now(),
	"coins" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "verificationTokens" (
	"id" integer PRIMARY KEY NOT NULL,
	"verificationToken" varchar,
	"userId" integer,
	"createdAt" date,
	"expiryAt" date,
	"tokenUsed" boolean
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map" ADD CONSTRAINT "map_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userAPIKeys" ADD CONSTRAINT "userAPIKeys_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;