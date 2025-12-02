import { building } from '$app/environment';
import { auth } from '$lib/server/auth'; // path to your auth file
import { env } from '$lib/server/env'; // Validation runs on import here
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function init() {
	// You can also add other startup logic here (DB connections, etc.)
	console.log(`✅ Server initialized in ${env.NODE_ENV} mode`);
}

export async function handle({ event, resolve }) {
	return svelteKitHandler({ event, resolve, auth, building });
}
