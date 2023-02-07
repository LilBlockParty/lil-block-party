import Redis from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "../../../core/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const redis = new Redis(process.env.REDIS_STRING || "");
  const { id } = req.query;
  const { data: eulogies, error } = await supabase
    .from("eulogies")
    .select("eulogy,img_url,address,token_id")
    .eq("id", id)
    

  return res.status(200).json(eulogies);
}
