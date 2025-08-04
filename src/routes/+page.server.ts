import { insertUser, validateUserCredentials } from '$lib/server/database/users.model';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			const user = await validateUserCredentials(email, password);
			if (!user) {
				return {
					error: 'Invalid email or password',
				};
			}
		}
		return 
	},
	register: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (password !== confirmPassword) {
			return {
				error: 'Passwords do not match',
			};
		}

		try {
			const newUser = await insertUser(email, password);
		} catch (error) {
			console.error('Error inserting user:', error);
			return {
				error: 'Failed to register user',
			};
		}	
	},
};
