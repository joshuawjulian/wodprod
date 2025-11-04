import { request } from 'http';
import type { Actions } from './$types';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		// TODO log the user in
	},
	register: async (event) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
	}
} satisfies Actions;
