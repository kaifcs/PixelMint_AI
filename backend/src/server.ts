import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { startCleanupJob } from "./jobs/cleanupExpiredImages.js";

const app = createApp();

const server = app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`🚀 PixelMint AI backend started | ${env.NODE_ENV} | Port: ${env.PORT}`);

  if (env.NODE_ENV === "production") {
    startCleanupJob();
  }
});

export default server;