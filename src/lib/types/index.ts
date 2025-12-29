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

// Form schemas (for user input - no ID required)
export const MovementPatternFormSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
	description: z.string().min(1, 'Description is required').max(500, 'Description is too long')
});

export type MovementPatternFormType = z.infer<typeof MovementPatternFormSchema>;

export const MovementPatternUpdateSchema = MovementPatternFormSchema.partial().extend({
	id: z.string().uuid()
});

export type MovementPatternUpdateType = z.infer<typeof MovementPatternUpdateSchema>;
