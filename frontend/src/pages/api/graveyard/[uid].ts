import Redis from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const redis = new Redis(process.env.REDIS_STRING || "");
  const { uid } = req.query;
  const data = await redis.smembers(`eulogy`);

  return res.status(200).json({ uid });
}
