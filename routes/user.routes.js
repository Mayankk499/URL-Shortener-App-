import express from "express";
import  db  from "../db/index.db.js";
import { usersTable } from "../models/index.model.js";
import { signupPostRequestBodySchema } from "../utils/request.utils.js";
import { hashedPasswordWithSalt } from "../validate/hash.js";
import { getUserByEmail } from "../services/user.service.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
  }

  const { name, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);

  if (existingUser)
    return res.status(400).json({ error: `email already taken` });

  const {salt, password: hashedPassword} = hashedPasswordWithSalt(password);

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
