import { NextResponse } from "next/server";
import pool from "@/lib/db";

type LuthierRow = {
  id: number;
  user_id: number | null;
  name: string;
  type: string;
  bio: string | null;
  website: string | null;
  verified: boolean;
  created_at: string;
  photo_url: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  postcode: string | null;
  country: string | null;
  city: string | null;
  street_name: string | null;
  house_number: string | null;
  instruments: string[] | null;
};

function mapRow(row: LuthierRow) {
  const instruments = Array.isArray(row.instruments)
    ? row.instruments.filter((instrument): instrument is string => Boolean(instrument))
    : [];
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    bio: row.bio,
    website: row.website,
    verified: Boolean(row.verified),
    createdAt: row.created_at,
    photoUrl: row.photo_url,
    latitude: row.latitude == null ? null : Number(row.latitude),
    longitude: row.longitude == null ? null : Number(row.longitude),
    postcode: row.postcode,
    country: row.country,
    city: row.city,
    street: row.street_name,
    houseNumber: row.house_number,
    instruments,
  };
}

export async function GET() {
  try {
    const result = await pool.query<LuthierRow>(
      `SELECT l.id,
              l.user_id,
              l.name,
              l.type,
              l.bio,
              l.website,
              l.verified,
              l.created_at,
              l.photo_url,
              l.latitude,
              l.longitude,
              l.postcode,
              l.country,
              l.city,
              l.street_name,
              l.house_number,
              ARRAY_REMOVE(ARRAY_AGG(DISTINCT i.instrument_type), NULL) AS instruments
         FROM luthiers l
         LEFT JOIN instruments i ON i.maker_id = l.id
         WHERE l.latitude IS NOT NULL AND l.longitude IS NOT NULL
         GROUP BY l.id, l.user_id, l.name, l.type, l.bio, l.website, l.verified,
                  l.created_at, l.photo_url, l.latitude, l.longitude, l.postcode,
                  l.country, l.city, l.street_name, l.house_number`
    );

    const payload = result.rows
      .map(mapRow)
      .filter((item) => item.latitude != null && item.longitude != null);

    return NextResponse.json(payload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error fetching luthiers:", message);
    return NextResponse.json(
      { msg: "Error fetching luthiers", error: message },
      { status: 500 }
    );
  }
}
