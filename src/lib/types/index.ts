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
	id: z.uuid()
});

export type MovementPatternUpdateType = z.infer<typeof MovementPatternUpdateSchema>;

// Equipment schemas
export const EquipmentSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	description: z.string().min(1)
});

export type EquipmentType = z.infer<typeof EquipmentSchema>;

export const EquipmentFormSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
	description: z.string().min(1, 'Description is required').max(500, 'Description is too long')
});

export type EquipmentFormType = z.infer<typeof EquipmentFormSchema>;

export const EquipmentUpdateSchema = EquipmentFormSchema.partial().extend({
	id: z.uuid()
});

export type EquipmentUpdateType = z.infer<typeof EquipmentUpdateSchema>;

// Movement schemas
export const MovementSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	standards: z.string().min(1),
	videoUrl: z.string().nullable(),
	modalityId: z.uuid(),
	parentMovementId: z.uuid().nullable()
});

export type MovementType = z.infer<typeof MovementSchema>;

// Movement pattern association (with dominance)
export const MovementPatternAssociationSchema = z.object({
	id: z.uuid(),
	dominance: z.enum(['Primary', 'Secondary'])
});

export type MovementPatternAssociationType = z.infer<typeof MovementPatternAssociationSchema>;

// Movement with all relations (for display)
export const MovementWithRelationsSchema = MovementSchema.extend({
	modality: ModalitySchema,
	patterns: z.array(
		MovementPatternSchema.extend({
			dominance: z.enum(['Primary', 'Secondary'])
		})
	),
	equipment: z.array(EquipmentSchema),
	parentMovement: MovementSchema.nullable().optional()
});

export type MovementWithRelationsType = z.infer<typeof MovementWithRelationsSchema>;

// Form schema (for user input)
export const MovementFormSchema = z.object({
	name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
	standards: z.string().min(1, 'Standards are required').max(1000, 'Standards are too long'),
	videoUrl: z
		.string()
		.url('Must be a valid URL')
		.optional()
		.or(z.literal(''))
		.transform((val) => (val === '' ? undefined : val)),
	modalityId: z.uuid('Modality is required'),
	patterns: z
		.array(MovementPatternAssociationSchema)
		.min(1, 'At least one movement pattern is required'),
	equipmentIds: z.array(z.uuid()).default([]),
	parentMovementId: z.uuid().optional().or(z.literal(''))
});

export type MovementFormType = z.infer<typeof MovementFormSchema>;

// Update schema
export const MovementUpdateSchema = MovementFormSchema.partial().extend({
	id: z.uuid()
});

export type MovementUpdateType = z.infer<typeof MovementUpdateSchema>;
