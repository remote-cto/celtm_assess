//app/api/colleges/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, name FROM org WHERE is_active = TRUE ORDER BY name"
    );

    console.log("Fetched colleges from DB:", result.rows);

    const colleges = result.rows.map(({ id, name }) => ({ id, name }));
    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Failed to fetch colleges:", error);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
