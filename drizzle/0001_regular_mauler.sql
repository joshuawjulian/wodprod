ALTER TABLE "website_roles" RENAME COLUMN "role_name" TO "name";--> statement-breakpoint
ALTER TABLE "website_roles" DROP CONSTRAINT "website_roles_role_name_unique";--> statement-breakpoint
ALTER TABLE "website_roles" ADD CONSTRAINT "website_roles_name_unique" UNIQUE("name");