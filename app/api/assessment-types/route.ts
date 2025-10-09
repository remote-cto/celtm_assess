import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get("org_id");

  // Validate org_id
  if (!org_id) {
    return NextResponse.json(
      { success: false, error: "Organization ID is required" },
      { status: 400 }
    );
  }

  let client;
  try {
    client = await pool.connect();

    // Corrected Query: Select all active assessment types that have at least one question.
    // This ensures that assessments appear even if they haven't been taken yet.
    const sql = `
      SELECT DISTINCT
        at.id,
        at.name,
        at.description
      FROM 
        assessment_type at
      INNER JOIN 
        question_bank qb ON qb.assessment_type_id = at.id
      WHERE 
        at.is_active = TRUE
      ORDER BY 
        at.name ASC;
    `;
    
  
    const result = await client.query(sql);

    return NextResponse.json({
      success: true,
      assessment_types: result.rows,
      count: result.rowCount,
    });
  } catch (error) {
    console.error("Error fetching assessment types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch assessment types",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

// --- The POST function remains unchanged ---
export async function POST(request: NextRequest) {
  let client;

  try {
    const body = await request.json();
    const { name, description, key_area_id, is_active = true } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Assessment type name is required" },
        { status: 400 }
      );
    }
    client = await pool.connect();

    const insertQuery = `
      INSERT INTO assessment_type (name, description, key_area_id, is_active, create_date)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, name, description, key_area_id, is_active, create_date
    `;
    const result = await client.query(insertQuery, [
      name,
      description || null,
      key_area_id || null,
      is_active,
    ]);

    return NextResponse.json({
      success: true,
      assessment_type: result.rows[0],
      message: "Assessment type created successfully",
    });
  } catch (error) {
    console.error("Error creating assessment type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create assessment type",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}