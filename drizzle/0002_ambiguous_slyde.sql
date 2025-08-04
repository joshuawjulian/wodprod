ALTER TABLE "sessions" RENAME COLUMN "refresh_token_hash" TO "refresh_token";--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_refresh_token_hash_unique";--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_refresh_token_unique" UNIQUE("refresh_token");