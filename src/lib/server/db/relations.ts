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
		websiteRoles: r.many.websiteRolesTable({
			from: r.usersTable.id.through(r.usersToWebsiteRolesTable.userId),
			to: r.websiteRolesTable.id.through(r.usersToWebsiteRolesTable.websiteRoleId)
		})
	},
	movementsTable: {
		movementPatterns: r.many.movementsToMovementPatternsTable({
			from: r.movementsTable.id.through(r.movementsToMovementPatternsTable.movementId),
			to: r.movementPatternsTable.id.through(r.movementsToMovementPatternsTable.movementPatternId)
		})
	},
	movementPatternsTable: {
		movements: r.many.movementsToMovementPatternsTable({
			from: r.movementPatternsTable.id.through(
				r.movementsToMovementPatternsTable.movementPatternId
			),
			to: r.movementsTable.id.through(r.movementsToMovementPatternsTable.movementId)
		})
	}
}));
