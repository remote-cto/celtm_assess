import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

// Define a common structure for the question select statement to avoid repetition
const QUESTION_SELECT_FIELDS = `
  qb.id, qb.question, qb.option_a, qb.option_b, qb.option_c, qb.option_d, qb.correct_answer,
  t.name AS topic, s.name AS section, l.name AS level,
  t.weightage AS topic_weightage, l.weightage AS level_weightage,
  qb.video_url
`;

const QUESTION_JOINS = `
  FROM question_bank qb
  JOIN topic t ON qb.topic_id = t.id
  JOIN section s ON t.section_id = s.id
  JOIN level l ON qb.level_id = l.id
`;

export async function GET(req: NextRequest) {
  const url = new URL(req.url || "");
  const assessmentTypeIdParam = url.searchParams.get("assessment_type_id");
  const testType = url.searchParams.get("type") || "standard";

  if (!assessmentTypeIdParam) {
    return NextResponse.json(
      { error: "assessment_type_id is required" },
      { status: 400 },
    );
  }

  const assessmentTypeId = parseInt(assessmentTypeIdParam, 10);
  if (isNaN(assessmentTypeId)) {
    return NextResponse.json(
      { error: "Invalid assessment_type_id" },
      { status: 400 },
    );
  }

  try {
    let query = "";
    const params = [assessmentTypeId];

    // Array of assessment type IDs eligible for adaptive mode
    const adaptiveEligibleIds = [1, 2]; // 1: General Assessment, 2: Nursing Assessment

    // Check if the current test is adaptive and the assessment type is eligible
    if (
      testType === "adaptive" &&
      adaptiveEligibleIds.includes(assessmentTypeId)
    ) {
      query = `
        WITH adaptive_questions AS (
          -- Foundational Section
          (SELECT ${QUESTION_SELECT_FIELDS} ${QUESTION_JOINS} WHERE qb.assessment_type_id = $1 AND s.id = 1 AND l.name = 'Basic' AND qb.is_active = TRUE AND t.is_active = TRUE AND s.is_active = TRUE AND l.is_active = TRUE ORDER BY RANDOM())
          UNION ALL
          (SELECT ${QUESTION_SELECT_FIELDS} ${QUESTION_JOINS} WHERE qb.assessment_type_id = $1 AND s.id = 1 AND l.name = 'Intermediate' AND qb.is_active = TRUE AND t.is_active = TRUE AND s.is_active = TRUE AND l.is_active = TRUE ORDER BY RANDOM())
          UNION ALL
          (SELECT ${QUESTION_SELECT_FIELDS} ${QUESTION_JOINS} WHERE qb.assessment_type_id = $1 AND s.id = 1 AND l.name = 'Advanced' AND qb.is_active = TRUE AND t.is_active = TRUE AND s.is_active = TRUE AND l.is_active = TRUE ORDER BY RANDOM())
          UNION ALL
          -- Industrial Section
          (SELECT ${QUESTION_SELECT_FIELDS} ${QUESTION_JOINS} WHERE qb.assessment_type_id = $1 AND s.id = 2 AND l.name = 'Basic' AND qb.is_active = TRUE AND t.is_active = TRUE AND s.is_active = TRUE AND l.is_active = TRUE ORDER BY RANDOM())
          UNION ALL
          (SELECT ${QUESTION_SELECT_FIELDS} ${QUESTION_JOINS} WHERE qb.assessment_type_id = $1 AND s.id = 2 AND l.name = 'Intermediate' AND qb.is_active = TRUE AND t.is_active = TRUE AND s.is_active = TRUE AND l.is_active = TRUE ORDER BY RANDOM())
          UNION ALL
          (SELECT ${QUESTION_SELECT_FIELDS} ${QUESTION_JOINS} WHERE qb.assessment_type_id = $1 AND s.id = 2 AND l.name = 'Advanced' AND qb.is_active = TRUE AND t.is_active = TRUE AND s.is_active = TRUE AND l.is_active = TRUE ORDER BY RANDOM())
        )
        SELECT * FROM adaptive_questions;
      `;
    } else {
      // Standard test for any assessment type
      query = `
        SELECT ${QUESTION_SELECT_FIELDS}
        ${QUESTION_JOINS}
        WHERE qb.assessment_type_id = $1
          AND qb.is_active = TRUE
          AND t.is_active = TRUE
          AND s.is_active = TRUE
          AND l.is_active = TRUE
        ORDER BY RANDOM()
        LIMIT 18;
      `;
    }

    const result = await pool.query(query, params);

    // Shuffle final results to mix sections and levels
    const shuffledRows = result.rows.sort(() => Math.random() - 0.5);

    const formattedQuestions = shuffledRows.map((q: any) => {
      const correctAnswerIndex = { A: 0, B: 1, C: 2, D: 3 }[
        q.correct_answer as "A" | "B" | "C" | "D"
      ];
      return {
        id: q.id.toString(),
        topic: q.topic,
        section: q.section,
        level: q.level,
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: correctAnswerIndex,
        topicWeightage: q.topic_weightage,
        levelWeightage: q.level_weightage,
        video_url: q.video_url,
        testType: testType,
      };
    });

    return NextResponse.json(
      {
        questions: formattedQuestions,
        testType: testType,
        totalQuestions: formattedQuestions.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to load questions", testType: testType },
      { status: 500 },
    );
  }
}
