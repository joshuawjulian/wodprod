CREATE TABLE "gym_roles" (
	"id" text PRIMARY KEY,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gyms" (
	"id" text PRIMARY KEY,
	"name" varchar NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movements" (
	"id" text PRIMARY KEY,
	"name" varchar NOT NULL CONSTRAINT "movement_name" UNIQUE,
	"standards" text NOT NULL,
	"video_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movements_to_movement_patterns" (
	"id" text PRIMARY KEY,
	"movement_pattern_id" text NOT NULL,
	"movement_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_to_website_roles" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"website_role_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "website_roles" (
	"id" text PRIMARY KEY,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "movement_patterns" DROP CONSTRAINT "mp_name";--> statement-breakpoint
ALTER TABLE "movement_patterns" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "movement_patterns" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "movement_patterns" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "movement_patterns" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "movement_patterns" ADD CONSTRAINT "movement_pattern_name" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "gyms" ADD CONSTRAINT "gyms_owner_id_users_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "movements_to_movement_patterns" ADD CONSTRAINT "movements_to_movement_patterns_79Yg0mug8eql_fkey" FOREIGN KEY ("movement_pattern_id") REFERENCES "movement_patterns"("id");--> statement-breakpoint
ALTER TABLE "movements_to_movement_patterns" ADD CONSTRAINT "movements_to_movement_patterns_movement_id_movements_id_fkey" FOREIGN KEY ("movement_id") REFERENCES "movements"("id");--> statement-breakpoint
ALTER TABLE "users_to_website_roles" ADD CONSTRAINT "users_to_website_roles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "users_to_website_roles" ADD CONSTRAINT "users_to_website_roles_website_role_id_website_roles_id_fkey" FOREIGN KEY ("website_role_id") REFERENCES "website_roles"("id");