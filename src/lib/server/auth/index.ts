import { Err, Ok, type Result } from 'ts-results';
import { db } from '../db';
import { getUserByEmail } from '../db/users';
import { verifyPassword } from './utils';

export type UserTokenType = {
	id: number;
	email: string;
	websiteRole: 'user' | 'super' | 'admin';
};

export const attemptLogin = async (
	email: string,
	password_raw: string
): Promise<Result<UserTokenType, Error>> => {
	const user_result = await getUserByEmail(db, email);
	if (user_result.err) return Err(user_result.val);

	const user = user_result.val;

	const passwordResult = await verifyPassword(user.passwordHash, password_raw);
	if (passwordResult.err) return Err(Error('Incorrect Password'));

	// password is correct here -- login user

	return Ok({
		id: -1,
		email: 'n/a',
		websiteRole: 'user'
	});
};
