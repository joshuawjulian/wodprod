import { form } from '$app/server';
import z from 'zod';

export const createMovement = form(
	z.object({
		name: z.string().min(1, 'Name is required'),
		standards: z.string().min(1, 'Standards are required'),
		videoUrl: z.url('Invalid URL').optional(),
		modalityId: z.string().min(1, 'Modality is required')
	}),
	async (data) => {}
);
