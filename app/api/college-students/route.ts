// app/api/college-students/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const college_id = searchParams.get("college_id");

    if (!college_id) {
      return NextResponse.json(
        { error: "College ID is required" },
        { status: 400 }
      );
    }

    const { rows: userTypeRows } = await pool.query(
      `SELECT id FROM user_type WHERE user_type_desc = 'Student' AND is_active = TRUE LIMIT 1`
    );
    if (!userTypeRows.length) {
      return NextResponse.json(
        { error: "User type 'Student' not found" },
        { status: 400 }
      );
    }
    const studentUserTypeId = userTypeRows[0].id;

    const { rows: students } = await pool.query(
      `SELECT id, name, registration_number, email
       FROM academic_user
       WHERE org_id = $1 AND user_type_id = $2 AND is_active = TRUE`,
      [college_id, studentUserTypeId]
    );

    if (students.length === 0) {
      return NextResponse.json({ students: [] });
    }

    const studentIds = students.map((s) => s.id);
    const { rows: assessmentRows } = await pool.query(
      `SELECT DISTINCT ON (academic_user_id)
        id, academic_user_id,
        readiness_score, foundational_assessment, industrial_assessment,
        create_date AS attempted_at
       FROM academic_assessment_final
       WHERE academic_user_id = ANY($1) AND is_active = TRUE
       ORDER BY academic_user_id, create_date DESC
      `,
      [studentIds]
    );

    const assessmentMap = new Map<number, any>();
    for (const row of assessmentRows) {
      assessmentMap.set(row.academic_user_id, {
        id: row.id,
        readiness_score:
          row.readiness_score !== null ? Number(row.readiness_score) : null,
        foundational_assessment:
          row.foundational_assessment !== null
            ? Number(row.foundational_assessment)
            : null,
        industrial_assessment:
          row.industrial_assessment !== null
            ? Number(row.industrial_assessment)
            : null,
        attempted_at: row.attempted_at,
        status: "completed",
      });
    }

    const studentsWithAssessments = students.map((student) => ({
      ...student,
      assessments: assessmentMap.has(student.id)
        ? [assessmentMap.get(student.id)]
        : [],
    }));

    return NextResponse.json({ students: studentsWithAssessments });
  } catch (error) {
    console.error("College students error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
