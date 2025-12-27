import type { DbTxType } from '$lib/server/db';
import type { ModalityType } from '$lib/types';
import { err, ok, type Result } from 'neverthrow';

export const getModalities = async (tx: DbTxType): Promise<Result<ModalityType[], Error>> => {
	// Placeholder implementation
	try {
		const result = await tx.query.modalitiesTable.findMany({
			where: { deletedAt: { isNull: true } }
		});
		return ok(result);
	} catch (e) {
		return err(new Error('Failed to fetch modalities'));
	}
};
