import "dotenv/config";
import type { Express } from "express";
import { loadDatabase, saveDatabase } from "./database.js";
import { styleText } from "util";

const port = 3000;

export async function startServer(application: Express) {
  await loadDatabase();

  const server = application.listen(port, () => {
    console.info(
      styleText(
        ["green"],
        `✓ Server is up and running on http://localhost:${port}`
      )
    );
  });

  async function handleGracefulShutdown() {
    console.info(styleText(["yellow"], "💤 Server is shutting down..."));

    server.close(async () => {
      await saveDatabase();
      process.exit(0);
    });
  }

  process.once("SIGTERM", handleGracefulShutdown);
  process.once("SIGINT", handleGracefulShutdown);
}
