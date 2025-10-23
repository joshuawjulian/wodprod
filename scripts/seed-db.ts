import { sql } from "../src/lib/server/db";

export async function seedDb() {
  try {
    await sql`
      INSERT INTO website_roles (name)
      values 
        ('user'), ('super'), ('admin');

    `;
  } catch (error) {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	} 
}