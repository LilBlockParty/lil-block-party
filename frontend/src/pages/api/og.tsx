/* eslint-disable jsx-a11y/alt-text */
import { Redis } from "@upstash/redis";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

import { LilInfo } from "../rip/[wallet]";

export const config = {
  runtime: "edge",
  matcher: '/rip',
};

const redis = new Redis({
  url: "https://us1-suitable-crab-39528.upstash.io",
  token:
    "AZpoACQgYzQyZDg5NDAtZTVjNy00OGRkLWJjNDQtMTIxMzNmMDNkODkyOTc2YmIyNzEyZTVmNGU1M2EzMGJmYWQ3MjU2NTQ5NDc=",
});

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  console.log("fuck");
  const wallet = searchParams.get("wallet");

  const data = (await redis.get(wallet || "")) as LilInfo;

  if (!wallet || !data) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 48,
          color: "black",
          background: "#9EB5E1",
          width: "100%",
          height: "100%",
          paddingTop: 10,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            marginTop: "0px",
            marginBottom: "15px",
          }}
        >
          RIP to the almost Lil #: {data?.tokenId}
        </h3>
        <img
          width="500"
          height="500"
          src={`data:image/svg+xml;base64,${data?.imgData}`}
          style={{
            borderRadius: 64,
            marginRight: "16px",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
