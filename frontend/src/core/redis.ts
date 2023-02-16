import { Redis } from "@upstash/redis";

export const revalidate = 0; // disable cache

export const redisClient = new Redis({
  url: "https://us1-artistic-chipmunk-39560.upstash.io",
  token: process.env.REDIS_HTTP_TOKEN,
});
