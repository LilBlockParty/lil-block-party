import fs from "node:fs";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import Redis from "ioredis";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

import { EulogyInfo } from "../../../components/Memeorium";
import { prisma } from "../../../core/db";
import { s3Client } from "../../../core/s3";

const redis = new Redis(process.env.REDIS_STRING || "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "GET":
      const cacheData = await redis.smembers(`eulogies`);
      const fmt = cacheData.map((lil) => {
        return JSON.parse(lil);
      });

      if (fmt.length > 0) {
        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
        return res.status(200).send(fmt);
      }

      const data = await prisma.eulogies.findMany({
        select: { eulogy: true, img_url: true, address: true, id: true },
      });

      res.status(200).send(data);
      break;

    case "POST":
      // const data: EulogyInfo[] = await redis.smembers("eulogy");
      const id = nanoid();
      const { address, eulogy, img_data, token_id }: EulogyInfo = JSON.parse(req.body);

      const imgBuffer = Buffer.from(img_data, "base64");

      // this write the svg to disk
      // fs.writeFileSync("new-path.svg", imgBuffer, {});

      await sharp(imgBuffer).jpeg().toFile(`/tmp/${id}.jpeg`);
      const blob = fs.readFileSync(`/tmp/${id}.jpeg`);

      const bucketParams = {
        Bucket: "lbp-images",
        ACL: "public-read",
        Key: `${id}.jpeg`,
        Body: blob,
      };

      try {
        await s3Client.send(new PutObjectCommand(bucketParams));
        fs.unlink(`/tmp/${id}.jpeg`, (err) => {
          console.log(err);
        });
      } catch (err) {
        console.log("Error", err);
      }
      redis.sadd(
        `eulogies`,
        JSON.stringify({
          id,
          address,
          eulogy,
          img_url: `https://lbp-images.nyc3.cdn.digitaloceanspaces.com/${id}.jpeg`,
          token_id,
        })
      );

      const postData = await prisma.eulogies.create({
        data: {
          id,
          address,
          eulogy,
          img_data,
          token_id,
          img_url: `https://lbp-images.nyc3.cdn.digitaloceanspaces.com/${id}.jpeg`,
        },
      });

      res.status(200).send(postData);
      break;

    default:
      res.status(400).send({});
  }
}
