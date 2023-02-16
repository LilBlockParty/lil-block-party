import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../core/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).send("");
  }

  const data = await prisma.eulogies.findMany({
    where: { address: id },
    select: { eulogy: true, img_url: true, address: true, token_id: true, id: true },
  });

  return res.status(200).json(data);
}
