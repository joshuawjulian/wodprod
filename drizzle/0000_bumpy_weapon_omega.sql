CREATE TYPE "public"."gym_membership" AS ENUM('owner', 'coach', 'member');--> statement-breakpoint
CREATE TYPE "public"."website_level" AS ENUM('user', 'editor', 'admin');--> statement-breakpoint
CREATE TABLE "gym_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"gym_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"membership" "gym_membership" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_members_gym_id_user_id_unique" UNIQUE("gym_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "gyms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"authToken" text NOT NULL,
	"auth_token_created_at" timestamp DEFAULT now() NOT NULL,
	"auth_token_expires_at" timestamp NOT NULL,
	"refreshToken" text NOT NULL,
	"refresh_token_created_at" timestamp DEFAULT now() NOT NULL,
	"refresh_token_expires_at" timestamp NOT NULL,
	CONSTRAINT "tokens_authToken_unique" UNIQUE("authToken"),
	CONSTRAINT "tokens_refreshToken_unique" UNIQUE("refreshToken")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "website_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"level" "website_level" DEFAULT 'user' NOT NULL,
	CONSTRAINT "website_levels_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "gym_members" ADD CONSTRAINT "gym_members_gym_id_gyms_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gyms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_members" ADD CONSTRAINT "gym_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website_levels" ADD CONSTRAINT "website_levels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;