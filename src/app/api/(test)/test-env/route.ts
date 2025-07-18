import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    DB_HOST: process.env.DB_HOST || "TIDAK_ADA",
    DB_PORT: process.env.DB_PORT || "TIDAK_ADA",
    DB_USERNAME: process.env.DB_USERNAME || "TIDAK_ADA",
    DB_PASSWORD: process.env.DB_PASSWORD ? "ADA" : "TIDAK_ADA",
    DB_NAME: process.env.DB_NAME || "TIDAK_ADA",
    NODE_ENV: process.env.NODE_ENV,
  });
}
