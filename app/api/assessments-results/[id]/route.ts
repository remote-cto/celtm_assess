// app/api/assessment-results/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const assessmentId = parseInt(resolvedParams.id);

    if (!assessmentId) {
      return NextResponse.json(
        { error: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    const assessmentQuery = `
      SELECT 
        sa.*,
        s.name as student_name,
        s.email as student_email,
        q.title as questionnaire_title
      FROM student_assessments sa
      JOIN students s ON sa.student_id = s.id
      LEFT JOIN questionnaires q ON sa.questionnaire_id = q.id
      WHERE sa.id = $1
    `;

    const assessmentResult = await pool.query(assessmentQuery, [assessmentId]);

    if (assessmentResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const assessment = assessmentResult.rows[0];

    const answersQuery = `
      SELECT 
        sa.question_id,
        sa.selected_option,
        sa.is_correct,
        sa.answered_at,
        q.question,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_answer,
        t.name as topic_name,
        l.name as level_name
      FROM student_answers sa
      JOIN questions q ON sa.question_id = q.id
      JOIN topics t ON q.topic_id = t.id
      JOIN levels l ON q.level_id = l.id
      WHERE sa.student_assessment_id = $1
      ORDER BY sa.answered_at
    `;

    const answersResult = await pool.query(answersQuery, [assessmentId]);

    const topicScoresQuery = `
      SELECT 
        sts.*,
        t.name as topic_name,
        s.name as section_name
      FROM student_topic_scores sts
      JOIN topics t ON sts.topic_id = t.id
      JOIN sections s ON t.section_id = s.id
      WHERE sts.student_assessment_id = $1
      ORDER BY sts.normalized_score DESC
    `;

    const topicScoresResult = await pool.query(topicScoresQuery, [
      assessmentId,
    ]);

    const recommendationsQuery = `
      SELECT 
        sr.*,
        t.name as topic_name
      FROM student_recommendations sr
      JOIN topics t ON sr.topic_id = t.id
      WHERE sr.student_assessment_id = $1
      ORDER BY 
        CASE sr.priority 
          WHEN 'High' THEN 1 
          WHEN 'Medium' THEN 2 
          WHEN 'Low' THEN 3 
        END
    `;

    const recommendationsResult = await pool.query(recommendationsQuery, [
      assessmentId,
    ]);

    const totalQuestions = answersResult.rows.length;
    const correctAnswers = answersResult.rows.filter(
      (row) => row.is_correct
    ).length;
    const accuracy =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Group answers by topic for analysis
    const topicAnalysis = answersResult.rows.reduce((acc, row) => {
      const topic = row.topic_name;
      if (!acc[topic]) {
        acc[topic] = {
          total: 0,
          correct: 0,
          levels: { Basic: 0, Intermediate: 0, Advanced: 0 },
          questions: [],
        };
      }

      acc[topic].total++;
      if (row.is_correct) {
        acc[topic].correct++;
        acc[topic].levels[row.level_name]++;
      }

      acc[topic].questions.push({
        id: row.question_id,
        question: row.question,
        options: [row.option_a, row.option_b, row.option_c, row.option_d],
        correctAnswer: row.correct_answer,
        selectedOption: row.selected_option,
        isCorrect: row.is_correct,
        level: row.level_name,
      });

      return acc;
    }, {});

    return NextResponse.json({
      assessment: {
        id: assessment.id,
        student: {
          name: assessment.student_name,
          email: assessment.student_email,
        },
        questionnaire_title: assessment.questionnaire_title,
        started_at: assessment.started_at,
        completed_at: assessment.completed_at,
        total_score: assessment.total_score,
        readiness_score: assessment.readiness_score,
        status: assessment.status,
      },
      summary: {
        totalQuestions,
        correctAnswers,
        accuracy,
        timeTaken: assessment.completed_at
          ? Math.round(
              (new Date(assessment.completed_at).getTime() -
                new Date(assessment.started_at).getTime()) /
                1000
            )
          : 0,
      },
      answers: answersResult.rows,
      topicScores: topicScoresResult.rows,
      recommendations: recommendationsResult.rows,
      topicAnalysis,
    });
  } catch (err) {
    console.error("Error fetching assessment results:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
