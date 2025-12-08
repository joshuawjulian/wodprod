import { authClient } from '$lib/client';
import { fail } from '@sveltejs/kit';
import z from 'zod';
import type { Actions } from './$types';

const registerSchema = z.object({
	email: z.email(),
	password: z.string()
});

const signupSchema = registerSchema.extend({
	password_confirm: z.string()
});

export const actions = {
	login: async ({ cookies, request }) => {
		console.log('?/login');
		// TODO log the user in
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
	},
	signup: async ({ cookies, request }) => {
		console.log('?/signup');
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const password_confirm = formData.get('password_confirm');

		const signupResponse = signupSchema.safeParse({ email, password, password_confirm });

		if (signupResponse.error) return fail(400, { error: signupResponse.error });

		const parsedData = signupResponse.data;

		const { data, error } = await authClient.signUp.email({
			email: parsedData.email,
			password: parsedData.password,
			name: 'none',
			image: 'none'
		});

		console.log(data, error);
		return { success: true };
	}
} satisfies Actions;
