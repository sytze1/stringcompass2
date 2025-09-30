import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Get instruments with their luthier
    const instruments = await pool.query(
      `SELECT i.id, i.title, i.year_built, i.condition, i.price, i.location, 
              l.name AS luthier_name
       FROM instruments i
       LEFT JOIN luthiers l ON i.maker_id = l.id
       WHERE i.is_active = true
       ORDER BY RANDOM()
       LIMIT 10`
    );

    console.log("Fetched instruments:", instruments.rows);

    // Get media for those instruments
    const instrumentIds = instruments.rows.map((r) => r.id);
    let mediaRows: any[] = [];
    if (instrumentIds.length > 0) {
      const mediaResult = await pool.query(
        `SELECT id, instrument_id, url 
         FROM instrument_media 
         WHERE instrument_id = ANY($1::int[])`,
        [instrumentIds]
      );
      mediaRows = mediaResult.rows;
    }

    // Attach media
    const withMedia = instruments.rows.map((inst) => ({
      ...inst,
      media: mediaRows.filter((m) => m.instrument_id === inst.id),
    }));

    return NextResponse.json(withMedia);
  } catch (err: any) {
    console.error("Error fetching featured instruments:", err.message);
    return NextResponse.json({ msg: "Error fetching data", error: err.message }, { status: 500 });
  }
}
