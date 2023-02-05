import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";

type EulogyInfo = {
  address: string;
  eulogy: string;
  imgData: string;
  tokenId: number;
};

const redis = new Redis(process.env.REDIS_STRING);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "GET":
      const data = await redis.smembers("eulogy");
      const fmt = data.map((lil) => {
        return JSON.parse(lil);
      });
      res.status(200).send(fmt);
      break;

    case "POST":
      console.log(req.body);
      // const data: EulogyInfo[] = await redis.smembers("eulogy");
      const { address, eulogy, imgData, tokenId }: EulogyInfo = JSON.parse(req.body);
      redis.sadd(
        "eulogy",
        JSON.stringify({
          address,
          eulogy,
          imgData,
          tokenId,
        })
      );
      res.status(200).send("");
      break;

    default:
      res.status(400).send({});
  }
}
