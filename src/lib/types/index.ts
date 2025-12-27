import z from 'zod';

export const ModalitySchema = z.object({
	id: z.uuid(),
	code: z.string().min(1),
	name: z.string().min(1),
	intent: z.string().min(1)
});

export type ModalityType = z.infer<typeof ModalitySchema>;

export const MovementPatternSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	description: z.string().min(1)
});

export type MovementPatternType = z.infer<typeof MovementPatternSchema>;
