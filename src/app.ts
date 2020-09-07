import express from "express";
import helmet from "helmet";
import { handlers } from "./routes/index";
import { connectDatabase } from "./service/database";
import "reflect-metadata";

// Express initialization
const app = express();

// Listening port initialization
const port: Number = Number(process.env.PORT) || 8080;

// Express configuration
app.use(helmet());
app.use(express.json());

// Route handlers
app.use("/auth", handlers.AuthRouter);

/**
 * Start listening on specified port
 */
const startServer = async () => {
  try {
    app.listen(port);
    console.log(`[✅] Express listening on: ${port}`);
  } catch (err) {
    console.error(`[❌] Express error: ${err}`);
  }
};

(async () => {
  startServer();
  connectDatabase();
})();
