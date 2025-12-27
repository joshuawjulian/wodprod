# Database Helpers

## Soft Delete

All tables in the schema include a `deletedAt` timestamp field for soft deletes. Use the helpers in `soft-delete.ts` to work with soft deleted records.

### Usage Examples

#### Soft Delete a Record

```typescript
import { softDelete } from '$lib/server/db/helpers/soft-delete';
import { movementsTable } from '$lib/server/db/schema/schema';

// Soft delete a movement
const deleted = await softDelete(movementsTable, movementId);
```

#### Restore a Soft Deleted Record

```typescript
import { restoreSoftDelete } from '$lib/server/db/helpers/soft-delete';
import { movementsTable } from '$lib/server/db/schema/schema';

// Restore a deleted movement
const restored = await restoreSoftDelete(movementsTable, movementId);
```

#### Query Active Records (Exclude Soft Deleted)

```typescript
import { db } from '$lib/server/db';
import { movementsTable } from '$lib/server/db/schema/schema';
import { withSoftDelete } from '$lib/server/db/helpers/soft-delete';

// Get all active movements
const activeMovements = await db
  .select()
  .from(movementsTable)
  .where(withSoftDelete.where(movementsTable));

// Get active movements with additional conditions
import { eq } from 'drizzle-orm';
const activeMovementsForModality = await db
  .select()
  .from(movementsTable)
  .where(
    withSoftDelete.where(
      movementsTable,
      eq(movementsTable.modalityId, modalityId)
    )
  );
```

#### Query Only Deleted Records

```typescript
import { db } from '$lib/server/db';
import { movementsTable } from '$lib/server/db/schema/schema';
import { withSoftDelete } from '$lib/server/db/helpers/soft-delete';

// Get all deleted movements
const deletedMovements = await db
  .select()
  .from(movementsTable)
  .where(withSoftDelete.whereDeleted(movementsTable));
```

#### Using Query API (Relational Queries) ✨

**Good news!** The query API DOES support soft deletes using the `isNull` and `isNotNull` operators!

```typescript
import { db } from '$lib/server/db';

// ✅ Simple query with query API - exclude soft deleted
const movements = await db.query.movementsTable.findMany({
  where: {
    deletedAt: {
      isNull: true
    }
  }
});

// ✅ With relations (the nice part!)
const movements = await db.query.movementsTable.findMany({
  where: {
    deletedAt: {
      isNull: true
    }
  },
  with: {
    modality: true,
    movementPatterns: true,
    equipment: true
  }
});

// ✅ With additional conditions
const movements = await db.query.movementsTable.findMany({
  where: {
    deletedAt: {
      isNull: true
    },
    modalityId: 'some-id'
  },
  with: {
    modality: true
  }
});

// ✅ Query only deleted records
const deleted = await db.query.movementsTable.findMany({
  where: {
    deletedAt: {
      isNotNull: true
    }
  }
});
```

#### Using SQL-like API (Alternative)

For queries without relations, you can also use the SQL-like API:

```typescript
import { db } from '$lib/server/db';
import { movementsTable } from '$lib/server/db/schema/schema';
import { withSoftDelete } from '$lib/server/db/helpers/soft-delete';
import { eq } from 'drizzle-orm';

// Simple query
const movements = await db
  .select()
  .from(movementsTable)
  .where(withSoftDelete.where(movementsTable));

// With additional conditions
const movements = await db
  .select()
  .from(movementsTable)
  .where(
    withSoftDelete.where(
      movementsTable,
      eq(movementsTable.modalityId, modalityId)
    )
  );
```

#### Using notDeleted/onlyDeleted Directly

```typescript
import { db } from '$lib/server/db';
import { movementsTable } from '$lib/server/db/schema/schema';
import { notDeleted, onlyDeleted } from '$lib/server/db/helpers/soft-delete';
import { and, eq } from 'drizzle-orm';

// Manual usage with more complex queries
const result = await db
  .select()
  .from(movementsTable)
  .where(
    and(
      notDeleted(movementsTable),
      eq(movementsTable.modalityId, modalityId)
    )
  );

// Query only deleted records manually
const deleted = await db
  .select()
  .from(movementsTable)
  .where(onlyDeleted(movementsTable));
```

### Recommended Approach

**For relational queries (with `with` clause):**
```typescript
// ✅ Use query API with explicit isNull
const movements = await db.query.movementsTable.findMany({
  where: {
    deletedAt: { isNull: true }
  },
  with: { modality: true }
});
```

**For simple queries (no relations):**
```typescript
// ✅ Use SQL-like API with withSoftDelete.where()
const movements = await db
  .select()
  .from(movementsTable)
  .where(withSoftDelete.where(movementsTable));
```

### Best Practices

1. **Always filter by deletedAt** - By default, all queries should exclude soft deleted records using either:
   - Query API: `deletedAt: { isNull: true }`
   - SQL-like API: `withSoftDelete.where(table)`

2. **Use soft delete instead of hard delete** - Unless you have a specific reason (GDPR, etc.), always use `softDelete()` instead of `.delete()`

3. **Index usage** - All tables have an index on `deletedAt` for efficient querying

4. **Cascade considerations** - When soft deleting parent records, consider if child records should also be soft deleted

5. **Restore workflows** - Implement admin UI for restoring accidentally deleted records using `restoreSoftDelete()`
