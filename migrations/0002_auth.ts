import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.sql(`
      CREATE TABLE website_roles (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL	
      )
    `);

	pgm.sql(`
      INSERT INTO website_roles (name)
      values ('user'), ('super'), ('admin');
    `);

	pgm.sql(`
      CREATE TABLE users_website_roles (
        id SERIAL PRIMARY KEY,
				user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
				website_role_id INTEGER REFERENCES website_roles(id) NOT NULL
      )
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.sql(`DROP TABLE users_website_roles;`);
	pgm.sql(`DROP TABLE website_roles;`);
}
