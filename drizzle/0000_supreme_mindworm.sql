CREATE TABLE "movement_patterns" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movement_patterns_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	CONSTRAINT "movement_patterns_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "movements_movement_patterns" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movements_movement_patterns_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"movement_id" integer NOT NULL,
	"movement_pattern_id" integer NOT NULL
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
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"refresh_token" varchar(255),
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users_website_roles" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"assigned_at" date DEFAULT now() NOT NULL
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
ALTER TABLE "users_website_roles" ADD CONSTRAINT "users_website_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_website_roles" ADD CONSTRAINT "users_website_roles_role_id_website_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."website_roles"("id") ON DELETE cascade ON UPDATE no action;