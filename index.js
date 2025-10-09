import express from "express";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import {authenticationMiddleware} from './middlewares/auth.middleware.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(authenticationMiddleware);

app.get("/", (req, res) => {
  return res.json({ status: "Server is up & running" });
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
}); 
