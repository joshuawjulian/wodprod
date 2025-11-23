CREATE TABLE "movement_patterns" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movement_patterns_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	CONSTRAINT "movement_patterns_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "movements_movement_patterns" (
	"movement_id" integer NOT NULL,
	"movement_pattern_id" integer NOT NULL,
	CONSTRAINT "movements_movement_patterns_movement_id_movement_pattern_id_unique" UNIQUE("movement_id","movement_pattern_id")
);
--> statement-breakpoint
CREATE TABLE "movements" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"video_url" varchar(255) NOT NULL,
	"standards" varchar(1000) NOT NULL,
	CONSTRAINT "movements_name_unique" UNIQUE("name"),
	CONSTRAINT "movements_video_url_unique" UNIQUE("video_url")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "refresh_tokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"token" varchar NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"expires_at" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"websiteRoleId" integer NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "website_roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "website_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	CONSTRAINT "website_roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "movements_movement_patterns" ADD CONSTRAINT "movements_movement_patterns_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."movements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movements_movement_patterns" ADD CONSTRAINT "movements_movement_patterns_movement_pattern_id_movement_patterns_id_fk" FOREIGN KEY ("movement_pattern_id") REFERENCES "public"."movement_patterns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_websiteRoleId_website_roles_id_fk" FOREIGN KEY ("websiteRoleId") REFERENCES "public"."website_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "one_active_refresh_token_per_user" ON "refresh_tokens" USING btree ("userId") WHERE "refresh_tokens"."is_active" = true;