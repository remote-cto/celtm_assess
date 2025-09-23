// app/api/student-topic-scores/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const student_id = searchParams.get("student_id");
    if (!student_id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

   
    const { rows: assessmentRows } = await pool.query(
      `SELECT id, assessment_type_id FROM academic_assessment_final
       WHERE academic_user_id = $1 AND is_active = TRUE
       ORDER BY create_date DESC
       LIMIT 1`,
      [student_id]
    );
    if (assessmentRows.length === 0) {
      return NextResponse.json({ scores: [] });
    }
    const { id: assessment_final_id, assessment_type_id } = assessmentRows[0];


    const { rows: topicRows } = await pool.query(
      `SELECT a.topic_id, t.name AS topic_name, a.correct_answers, a.total_questions,
              a.topic_wt_got AS weighted_score,
              CASE WHEN a.total_questions > 0 THEN (a.correct_answers::decimal / a.total_questions) * 100 ELSE 0 END AS normalized_score,
              CASE
                WHEN (a.correct_answers::decimal / a.total_questions) * 100 >= 80 THEN 'Strength'
                WHEN (a.correct_answers::decimal / a.total_questions) * 100 < 60 THEN 'Gap'
                ELSE 'Optional' END AS classification
       FROM academic_assessment_action a
       JOIN topic t ON a.topic_id = t.id
       WHERE a.academic_user_id = $1
         AND a.assessment_type_id = $2
         AND a.is_active = TRUE
       ORDER BY t.name`,
      [student_id, assessment_type_id]
    );

    return NextResponse.json({ scores: topicRows });
  } catch (error) {
    console.error("student-topic-scores error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
