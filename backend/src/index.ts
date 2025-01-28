import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import tenantsRoute from "./routes/tenantsRoutes";
import connectDB from "./config/database";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const mongo = process.env.MONGO_URL;

app.use(express.json());
app.use("/api/tenants", tenantsRoute);

connectDB()
.then(() => app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}));

export default app;
