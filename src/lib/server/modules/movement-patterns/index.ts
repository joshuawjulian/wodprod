import type { DbTxType } from '$lib/server/db';
import type { MovementPatternType } from '$lib/types';
import { Result, err, ok } from 'neverthrow';

export const getAllMovementPatterns = async (
	tx: DbTxType
): Promise<Result<MovementPatternType[], Error>> => {
	try {
		const patterns = await tx.query.movementPatternsTable.findMany({
			where: { deletedAt: { isNull: true } }
		});
		return ok(patterns);
	} catch (e) {
		return err(new Error('Failed to fetch movement patterns'));
	}
};
