// src/routes/dashboard/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.session; // Ensure we await if your hook logic was async

	if (!session) {
		// Redirect unauthorized users to login
		throw redirect(302, '/');
	}

	// Pass user data to the page (optional, but useful)
	return {
		user: locals.user
	};
};
