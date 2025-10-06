import express from "express";
import { db } from "../db/index.db.js";
import { usersTable } from "../models/index.model.js";
import { eq } from "drizzle-orm";
import { randomBytes, createHmac } from "crypto";
import { runInNewContext } from "vm";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const [existingUser] = await db
    .select({
      id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser)
    return res.status(400).json({ error: `email already taken` });

  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      salt,
      password: hashedPassword,
    })
    .returning({ id: usersTable });

  return res.status(201).json({ data: { userId: user } });
});

export default router;
