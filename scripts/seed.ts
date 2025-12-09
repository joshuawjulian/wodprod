import { db } from '../src/lib/server/db';
import { websiteRolesTable } from '../src/lib/server/db/schema';

await db.insert(websiteRolesTable).values({ name: 'user' });
await db.insert(websiteRolesTable).values({ name: 'super' });
await db.insert(websiteRolesTable).values({ name: 'admin' });
