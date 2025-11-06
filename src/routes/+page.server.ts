import { db } from '$lib/server/db';
import { verifyLogin } from '$lib/server/db/users';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';

const emailSchema = z
	.string({ error: 'Email is required' })
	.min(1, { message: 'Email cannot be empty' })
	.email({ message: 'Must be a valid email address' });

const passwordSchema = z.string().min(1);

const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema
});

export const actions = {
	login: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { emailForm, passwordForm } = formData;

		const result = loginSchema.safeParse({
			email: emailForm,
			password: passwordForm
		});

		if (result.error) return fail(400, result.error);

		const { email, password } = result.data;

		const loginResult = await verifyLogin(db, email, password);

		if (loginResult.err)
			return fail(400, { email: 'Email/Password Incorrect' });

		const loginUser = loginResult.val;
	},
	register: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (email === null)
			return fail(400, { email, error: 'Email and password are required.' });
		if (password === null)
			return fail(400, { password, error: 'Email and password are required.' });

		if (!response.ok) {
			return fail(400, { error: 'Invalid credentials' });
		}

		const { accessToken, refreshToken } = await response.json();

		// Set HTTP-only, secure, same-site cookie for refresh token
		cookies.set('refreshToken', refreshToken, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // Use secure in production
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});

		// You might store the accessToken in a Svelte store or similar for client-side use
		// For this example, we'll just redirect
		throw redirect(302, '/dashboard');
	}
} satisfies Actions;
