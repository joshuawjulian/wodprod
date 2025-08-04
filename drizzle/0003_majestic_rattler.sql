ALTER TABLE "sessions" RENAME COLUMN "refresh_token" TO "refresh_token_hash";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_refresh_token_unique";--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_refresh_token_hash_unique" UNIQUE("refresh_token_hash");