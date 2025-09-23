// app/api/college-info/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const college_id = searchParams.get("college_id");

    if (!college_id) {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, name FROM org WHERE id = $1 AND is_active = TRUE`,
      [college_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, college: result.rows[0] });
  } catch (error) {
    console.error("College info error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
