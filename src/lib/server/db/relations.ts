import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
	sessionsTable: {
		user: r.one.usersTable({
			from: r.sessionsTable.userId,
			to: r.usersTable.id
		})
	},
	accountsTable: {
		user: r.one.usersTable({
			from: r.accountsTable.userId,
			to: r.usersTable.id
		})
	},
	usersTable: {
		sessions: r.many.sessionsTable(),
		accounts: r.many.accountsTable(),
		websiteRole: r.one.websiteRolesTable({
			from: r.usersTable.websiteRoleId,
			to: r.websiteRolesTable.id
		})
	},
	websiteRolesTable: {
		users: r.many.usersTable()
	},
	movementsTable: {
		modality: r.one.modalitiesTable({
			from: r.movementsTable.modalityId,
			to: r.modalitiesTable.id
		}),
		movementPatterns: r.many.movementPatternsTable({
			from: r.movementsTable.id.through(r.movementsToMovementPatternsTable.movementId),
			to: r.movementPatternsTable.id.through(r.movementsToMovementPatternsTable.movementPatternId)
		}),
		equipment: r.many.equipmentTable({
			from: r.movementsTable.id.through(r.equipmentToMovementsTable.movementId),
			to: r.equipmentTable.id.through(r.equipmentToMovementsTable.equipmentId)
		})
	},
	modalitiesTable: {
		movements: r.many.movementsTable()
	},
	movementPatternsTable: {
		movements: r.many.movementsTable({
			from: r.movementPatternsTable.id.through(
				r.movementsToMovementPatternsTable.movementPatternId
			),
			to: r.movementsTable.id.through(r.movementsToMovementPatternsTable.movementId)
		})
	},
	equipmentTable: {
		movements: r.many.movementsTable({
			from: r.equipmentTable.id.through(r.equipmentToMovementsTable.equipmentId),
			to: r.movementsTable.id.through(r.equipmentToMovementsTable.movementId)
		})
	},
	movementsToMovementPatternsTable: {
		movement: r.one.movementsTable({
			from: r.movementsToMovementPatternsTable.movementId,
			to: r.movementsTable.id
		}),
		movementPattern: r.one.movementPatternsTable({
			from: r.movementsToMovementPatternsTable.movementPatternId,
			to: r.movementPatternsTable.id
		})
	},
	equipmentToMovementsTable: {
		movement: r.one.movementsTable({
			from: r.equipmentToMovementsTable.movementId,
			to: r.movementsTable.id
		}),
		equipment: r.one.equipmentTable({
			from: r.equipmentToMovementsTable.equipmentId,
			to: r.equipmentTable.id
		})
	}
}));
