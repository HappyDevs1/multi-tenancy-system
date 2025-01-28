import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

export const cacheMiddleware = (key: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    next();
  } catch (error) {
    console.error("Redis cache error:", error);
    next();
  }
};
