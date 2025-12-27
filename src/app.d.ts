// See https://svelte.dev/docs/kit/types#app.d.ts

import type { authClient } from '$lib/client';

// Extend the user type to include websiteRole from customSession
type UserWithRole = typeof authClient.$Infer.Session.user & {
	websiteRole: string;
};

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: typeof authClient.$Infer.Session.session | null;
			user: UserWithRole | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
