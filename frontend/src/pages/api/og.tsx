/* eslint-disable jsx-a11y/alt-text */
import { ImageResponse } from "@vercel/og";
import Redis from "ioredis";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
  matcher: "/rip",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const wallet = searchParams.get("wallet");

  if (!wallet) {
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
        {/* <h3
          style={{
            marginTop: "0px",
            marginBottom: "15px",
          }}
        >
          RIP to the almost Lil #: {data?.token_id}
        </h3>
        <img
          width="500"
          height="500"
          src={`data:image/svg+xml;base64,${data?.img_data}`}
          style={{
            borderRadius: 64,
            marginRight: "16px",
          }}
        /> */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
