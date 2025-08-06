import { form, getRequestEvent, query } from '$app/server';
import {
	hashRefreshToken,
	isRefreshTokenValid,
	refreshSessionByRefreshToken,
} from '$lib/server/services/auth.services';
import { registerUser } from '$lib/server/services/user.service';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

export const registerNewUser = form(async (data: FormData) => {
	const email = data.get('email') as string;
	const password = data.get('password') as string;
	const confirmPassword = data.get('confirmPassword') as string;

	if (password !== confirmPassword) {
		return {
			error: 'Passwords do not match',
		};
	}

	try {
		const newUser = await registerUser(email, password);
		if (!newUser) {
			return {
				error: 'User registration failed',
			};
		}
		return {
			success: true,
			user: newUser,
		};
	} catch (error) {
		console.error('Error inserting user:', error);
		return {
			error: 'Failed to register user',
		};
	}
});

export const refreshToken = query(z.void(), async () => {
	const { cookies, locals } = getRequestEvent();
	const oldRefreshToken = cookies.get('refresh_token');
	if (!oldRefreshToken) {
		error(401, 'Refresh token not found.');
	}

	const oldTokenHash = hashRefreshToken(oldRefreshToken);
	if (!isRefreshTokenValid(oldRefreshToken)) {
		cookies.delete('refresh_token', { path: '/' });
		error(401, 'Invalid or expired session.');
	}

	const { refreshToken, refreshTokenExpires, authToken } =
		await refreshSessionByRefreshToken(oldRefreshToken);
	cookies.set('refresh_token', refreshToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
		expires: refreshTokenExpires,
	});

	return {
		authToken,
		success: true,
		message: 'Token refreshed successfully',
	};
});
