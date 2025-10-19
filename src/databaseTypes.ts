import type { Generated } from 'kysely';

export interface Database {
	movement_pattern: MovementPatternTable;
}

export interface MovementPatternTable {
	id: Generated<number>;
	name: string;
	description?: string | null;
}

export interface MovementTable {
	id: Generated<number>;
	name: string;
	standard: string;
}
