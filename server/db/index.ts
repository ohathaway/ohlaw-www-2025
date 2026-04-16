// NuxtHub 0.10: Import the pre-configured
// Drizzle instance from the virtual module.
import { db } from '@nuxthub/db'
import * as schema from './schema/index'

export { db, schema }

// Backwards compat for server utils
export const useDrizzle = () => db
