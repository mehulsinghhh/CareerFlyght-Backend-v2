import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;