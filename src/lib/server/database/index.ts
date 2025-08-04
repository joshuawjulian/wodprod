import 'dotenv/config';

//connect with pg as a singleton not using drizzle
import { Pool } from 'pg';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

export const db = {
	query: async (text: string, params?: any[]) => {
		const client = await pool.connect();
		try {
			const res = await client.query(text, params);
			return res.rows;
		} finally {
			client.release();
		}
	},
	execute: async (text: string, params?: any[]) => {
		const client = await pool.connect();
		try {
			await client.query(text, params);
		} finally {
			client.release();
		}
	},
};
export const getPool = () => pool;
