import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL as string, // Redis connection URL from .env
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err); // Logging any connection errors
});

redisClient
  .connect()
  .then(() => console.log("Connected to Redis")) // Logging successful connection
  .catch((err) => console.error("Failed to connect to Redis:", err)); // Logging connection failure

export default redisClient; // Export the client for use in other files
