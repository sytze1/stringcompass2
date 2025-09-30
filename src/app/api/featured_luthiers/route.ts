import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, name, type, bio, location, photo_url FROM luthiers LIMIT 10"
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error fetching featured luthiers:", err);
    return NextResponse.json({ error: "Failed to fetch luthiers" }, { status: 500 });
  }
}
