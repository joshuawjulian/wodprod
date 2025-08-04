import { DATABASE_URL } from '$env/static/private';
import postgres from 'postgres';

// Create a single, shared connection pool
const sql = postgres(DATABASE_URL);

export default sql;
