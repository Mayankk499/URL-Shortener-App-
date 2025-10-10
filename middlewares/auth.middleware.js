import { validationUserToken } from "../validate/token.js";

export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return next();

  if (!authHeader.startsWith("Bearer"))
    return res.status(400).json({ error: "Authorization start with bearer" });

  const [_, token] = authHeader.split(' ');

  const payload = validationUserToken(token);

  req.user = payload;
  next();
}

export function ensureAuthenticated(req, res, next){
  if(!req.user || !req.user.id){
    return res.status(401).json({ error: "you have to login first" });
  }
  next();
}
