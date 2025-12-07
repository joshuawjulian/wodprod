// See https://svelte.dev/docs/kit/types#app.d.ts

import type { authClient } from '$lib/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: typeof authClient.$Infer.Session.session | null;
			user: typeof authClient.$Infer.User.user | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
