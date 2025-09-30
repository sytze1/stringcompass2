import { NextResponse } from "next/server";

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { msg: "Missing query parameter 'q'" },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      addressdetails: "1",
      limit: "5",
    });

    const response = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
      headers: {
        "User-Agent": "StringCompass/1.0 (contact@stringcompass.example)",
        Accept: "application/json",
      },
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`Nominatim responded with ${response.status}`);
    }

    const payload = await response.json();
    return NextResponse.json(payload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Geocoding error:", message);
    return NextResponse.json(
      { msg: "Error performing geocoding", error: message },
      { status: 500 }
    );
  }
}
