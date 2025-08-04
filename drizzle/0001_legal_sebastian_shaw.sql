ALTER TYPE "public"."gym_membership" RENAME TO "gym_role";--> statement-breakpoint
ALTER TYPE "public"."website_level" RENAME TO "website_role";--> statement-breakpoint
ALTER TABLE "tokens" RENAME TO "sessions";--> statement-breakpoint
ALTER TABLE "website_levels" RENAME TO "website_roles";--> statement-breakpoint
ALTER TABLE "gym_members" RENAME COLUMN "membership" TO "role";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "refreshToken" TO "refresh_token_hash";--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "refresh_token_expires_at" TO "expires_at";--> statement-breakpoint
ALTER TABLE "website_roles" RENAME COLUMN "level" TO "role";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "tokens_authToken_unique";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "tokens_refreshToken_unique";--> statement-breakpoint
ALTER TABLE "website_roles" DROP CONSTRAINT "website_levels_user_id_unique";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "website_roles" DROP CONSTRAINT "website_levels_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "is_active" text DEFAULT 'true' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website_roles" ADD CONSTRAINT "website_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "authToken";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "auth_token_created_at";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "auth_token_expires_at";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "refresh_token_created_at";--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_refresh_token_hash_unique" UNIQUE("refresh_token_hash");--> statement-breakpoint
ALTER TABLE "website_roles" ADD CONSTRAINT "website_roles_user_id_unique" UNIQUE("user_id");