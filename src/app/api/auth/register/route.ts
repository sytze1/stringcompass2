import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, location } = body;

    if (!email || !password) {
      return NextResponse.json({ msg: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, location`,
      [name, email, hashedPassword, role, location]
    );

    return NextResponse.json({ msg: "User created", user: result.rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Register error:", message);
    return NextResponse.json({ msg: "Error registering" }, { status: 500 });
  }
}
