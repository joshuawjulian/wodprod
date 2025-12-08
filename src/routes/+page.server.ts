import type { Actions } from './$types';

export const actions = {
	login: async ({ cookies, request }) => {
		// TODO log the user in
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		console.log(`email ${email} password ${password}`)
	},
	signup: async(event) => {

	}
} satisfies Actions;