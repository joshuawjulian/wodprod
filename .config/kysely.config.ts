import { defineConfig } from 'kysely-ctl';
import { dialect } from '../src/lib/server/database';

export default defineConfig({
	dialect: dialect,
	destroyOnExit: true // Optional, can be omitted if default is desired
});
