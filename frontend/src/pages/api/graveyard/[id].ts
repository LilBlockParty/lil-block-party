import Redis from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../core/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const redis = new Redis(process.env.REDIS_STRING || "");
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).send("");
  }

  console.log(id)

  const data = await prisma.eulogies.findMany({
    where: { address: id },
    select: { eulogy: true, img_url: true, address: true, token_id: true },
  });

  return res.status(200).json(data);
}
