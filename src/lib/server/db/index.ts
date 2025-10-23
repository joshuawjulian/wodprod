import postgres from 'postgres';

export const sql = postgres(Bun.env.POSTGRES_URL || '', {
	max: 1, // Single connection for migration script
});
