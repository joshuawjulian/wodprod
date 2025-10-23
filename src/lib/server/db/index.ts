import postgres from 'postgres';

export const sql = postgres(Bun.env.POSTGRES_URL || '', {
	onnotice: () => false,
	max: 10, // Single connection for migration script
});
