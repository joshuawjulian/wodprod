import { query } from '$app/server';
import { db } from '$lib/server/db';
import { getModalities } from '$lib/server/modules/modalities';
import type { ModalityType } from '$lib/types';

export const getAllModalities = query(async (): Promise<ModalityType[]> => {
	const result = await getModalities(db);
	return result.match(
		(modalities) => modalities,
		(error) => {
			console.error('Error fetching modalities:', error);
			return [];
		}
	);
});
