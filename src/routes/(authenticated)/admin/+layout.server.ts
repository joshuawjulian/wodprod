import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;

	// Check if user has admin or super role
	if (!user || (user.websiteRole !== 'admin' && user.websiteRole !== 'super')) {
		throw redirect(302, '/dashboard');
	}

	return {
		user
	};
};
