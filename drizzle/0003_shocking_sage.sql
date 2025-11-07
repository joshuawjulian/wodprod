CREATE TABLE "refresh_tokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "refresh_tokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"token" varchar NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"expires_at" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_website_roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users_website_roles" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "websiteRoleId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "one_active_refresh_token_per_user" ON "refresh_tokens" USING btree ("userId") WHERE "refresh_tokens"."is_active" = $1;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_websiteRoleId_website_roles_id_fk" FOREIGN KEY ("websiteRoleId") REFERENCES "public"."website_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "refresh_token";