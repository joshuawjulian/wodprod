import { env } from '$lib/server/env'; // Validation runs on import here

export async function init() {
	// You can also add other startup logic here (DB connections, etc.)
	console.log(`✅ Server initialized in ${env.NODE_ENV} mode`);
}
