import { err, ok, type Result } from 'neverthrow';
import z from 'zod';

export const insertMovement = async (
	name: string,
	standards: string,
	videoUrl: string,
	movementPatternsIds: number[]
): Promise<Result<boolean, string>> => {
	const movementPatternsIdsParse = z.array(z.number()).safeParse(movementPatternsIds);
	if (movementPatternsIdsParse.error) return err(movementPatternsIdsParse.error.message);

	return ok(true);
};
