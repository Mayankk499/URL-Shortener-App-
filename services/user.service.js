import {db} from '../db/index.db.js';
import { usersTable } from '../models/user.model.js';

export async function getUserByEmail(email) {
    const [existingUser] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email, 
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

    return existingUser;
}