import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./config/prisma";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
}

startServer();