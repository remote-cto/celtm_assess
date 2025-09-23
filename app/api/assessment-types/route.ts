
//app/api/assessment-types/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get("org_id");
  const nameFilter = searchParams.get("name"); 

  // Validate org_id
  if (!org_id) {
    return NextResponse.json(
      { success: false, error: "Organization ID is required" },
      { status: 400 }
    );
  }
  const orgIdNumber = parseInt(org_id);
  if (isNaN(orgIdNumber)) {
    return NextResponse.json(
      { success: false, error: "Invalid organization ID format" },
      { status: 400 }
    );
  }

  let client;
  try {
    client = await pool.connect();

    // Query: Select distinct assessment types attempted by org's students
    // and include optional name-based filtering
    let sql = `
      SELECT DISTINCT
        at.id,
        at.name,
        at.description,
        ka.name AS key_area_name
      FROM assessment_type at
        LEFT JOIN key_area ka ON ka.id = at.key_area_id
        INNER JOIN section s ON s.assessment_type_id = at.id
        INNER JOIN topic t ON t.section_id = s.id
        INNER JOIN question_bank qb ON qb.topic_id = t.id
        INNER JOIN academic_log al ON al.question_bankid = qb.id
        INNER JOIN academic_user au ON au.id = al.academic_user_id
      WHERE au.org_id = $1
        AND at.is_active = TRUE
    `;
    const params: any[] = [orgIdNumber];

    if (nameFilter) {
      sql += ` AND LOWER(at.name) LIKE LOWER($2)`;
      params.push(`%${nameFilter}%`);
    }

    sql += ` ORDER BY at.name ASC`;

    const result = await client.query(sql, params);

    return NextResponse.json({
      success: true,
      assessment_types: result.rows,
      count: result.rowCount
    });

  } catch (error) {
    console.error("Error fetching assessment types:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assessment types", details: process.env.NODE_ENV === "development" ? String(error) : undefined },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

// --- POST: Create a new Assessment Type (Optional) ---
export async function POST(request: NextRequest) {
  let client;

  try {
    const body = await request.json();
    const { name, description, key_area_id, is_active = true } = body;

    // Validate the payload
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
      is_active
    ]);

    return NextResponse.json({
      success: true,
      assessment_type: result.rows[0],
      message: "Assessment type created successfully"
    });

  } catch (error) {
    console.error("Error creating assessment type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create assessment type", details: process.env.NODE_ENV === "development" ? String(error) : undefined },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}
