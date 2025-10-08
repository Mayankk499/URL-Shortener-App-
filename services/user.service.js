import db from '../db/index.db.js';

import { eq } from 'drizzle-orm';
import { usersTable } from '../models/user.model.js';

export async function getUserByEmail(email) {
    const [existingUser] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email, 
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

    return existingUser;
}