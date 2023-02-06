import fs from "node:fs";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import Redis from "ioredis";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

import { s3Client } from "../../../core/s3";
import { supabase } from "../../../core/supabaseClient";

export type EulogyInfo = {
  address: string;
  eulogy: string;
  imgData: string;
  tokenId: number;
};
const redis = new Redis(process.env.REDIS_STRING || "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "GET":
      // const data = await redis.smembers(`eulogy`);
      // const fmt = data.map((lil) => {
      //   return JSON.parse(lil);
      // });

      const data = await supabase.from("eulogies").select()
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
      res.status(200).send(data.data);
      break;

    case "POST":
      // console.log(req.body);
      // const data: EulogyInfo[] = await redis.smembers("eulogy");
      const uid = nanoid();
      const { address, eulogy, imgData, tokenId }: EulogyInfo = JSON.parse(req.body);
      const imgBuffer = Buffer.from(imgData, "base64");

      // this write the svg to disk
      // fs.writeFileSync("new-path.svg", imgBuffer, {});

      await sharp(imgBuffer).jpeg().toFile(`./public/images/${uid}.jpeg`);
      const blob = fs.readFileSync(`./public/images/${uid}.jpeg`);

      const bucketParams = {
        Bucket: "lbp-images",
        ACL: "public-read",
        Key: `${uid}.jpeg`,
        Body: blob,
      };

      try {
        await s3Client.send(new PutObjectCommand(bucketParams));
        fs.unlink(`./public/images/${uid}.jpeg`, (err) => {
          console.log(err);
        });
      } catch (err) {
        console.log("Error", err);
      }
      // redis.sadd(
      //   `eulogy-${address}`,
      //   JSON.stringify({
      //     uid,
      //     address,
      //     eulogy,
      //     imgData,
      //     tokenId,
      //   })
      // );

      const idk = await supabase
        .from("eulogies")
        .insert({
          address,
          eulogy,
          img_data: imgData,
          token_id: tokenId,
          img_url: `https://lbp-images.nyc3.cdn.digitaloceanspaces.com/${uid}.jpeg`,
        });

        console.log(idk)
      res.status(200).send("");
      break;

    default:
      res.status(400).send({});
  }
}
