import 'dotenv/config';
import jwt from "jsonwebtoken";
import { userTokenSchema } from "../utils/token.utils.js";
const JWT_SECRET = process.env.JWT_SECRET;

export async function createUserToken(payload) {
  const  validationResult  = await userTokenSchema.safeParseAsync(payload);

  if (validationResult.error) throw new Error(validationResult.error.message);
  const payloadData = validationResult.data;

  const token = jwt.sign(payloadData, JWT_SECRET);
  return token;
}
