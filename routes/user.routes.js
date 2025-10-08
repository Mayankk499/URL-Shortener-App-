import express from "express";
import db from "../db/index.db.js";
import { usersTable } from "../models/index.model.js";
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from "../utils/request.utils.js";
import { hashedPasswordWithSalt } from "../validate/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import jwt from 'jsonwebtoken';

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

  const { salt, password: hashedPassword } = hashedPasswordWithSalt(password);

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

router.post('/login', async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

  if(validationResult.error){
    return res.status(400).json({error: validationResult.error});
  }

  const {email, password} = validationResult.data;
  const user = await getUserByEmail(email);

  if(!user){
    return res.status(404).json({error: 'User not found'});
  }

  const {password: hashedPassword} = hashedPasswordWithSalt(password, user.salt);

  if(user.password !== hashedPassword){
    return res.status(400).json({error: 'Invalid Password'});
  }

  const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);

  return res.json({token});

})

export default router;
