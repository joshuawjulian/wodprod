ALTER TABLE "users_website_roles" ADD CONSTRAINT "users_website_roles_user_id_role_id_unique" UNIQUE("user_id","role_id");

INSERT INTO website_roles (name) values ('user'), ('super'), ('admin');