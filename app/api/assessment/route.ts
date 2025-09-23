//app/api/assessment/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

// Define a common structure for the question select statement to avoid repetition
const QUESTION_SELECT_FIELDS = `
  qb.id, qb.question, qb.option_a, qb.option_b, qb.option_c, qb.option_d, qb.correct_answer,
  t.name AS topic, s.name AS section, l.name AS level,
  t.weightage AS topic_weightage, l.weightage AS level_weightage
`;

const QUESTION_JOINS = `
  FROM question_bank qb
  JOIN topic t ON qb.topic_id = t.id
  JOIN section s ON t.section_id = s.id
  JOIN level l ON qb.level_id = l.id
`;

const BASE_WHERE_CLAUSE = `
  WHERE qb.is_active = TRUE
    AND t.is_active = TRUE
    AND s.is_active = TRUE
    AND l.is_active = TRUE
    AND qb.assessment_type_id = $1
`;

export async function GET(req: NextRequest) {
  const url = new URL(req.url || "");
  const assessmentTypeId = url.searchParams.get("assessment_type_id") || "1";
  const testType = url.searchParams.get("type") || "standard";

  try {
    let query = "";

    if (testType === "adaptive") {
      query = `
        WITH adaptive_questions AS (
          -- Foundational Section (6 questions per level)
          (SELECT ${QUESTION_SELECT_FIELDS}, 'foundational' as section_type
           ${QUESTION_JOINS} 
           ${BASE_WHERE_CLAUSE} AND s.id = 1 AND l.name = 'Basic' 
           ORDER BY RANDOM() LIMIT 6)
          UNION ALL
          (SELECT ${QUESTION_SELECT_FIELDS}, 'foundational' as section_type
           ${QUESTION_JOINS} 
           ${BASE_WHERE_CLAUSE} AND s.id = 1 AND l.name = 'Intermediate' 
           ORDER BY RANDOM() LIMIT 6)
          UNION ALL
          (SELECT ${QUESTION_SELECT_FIELDS}, 'foundational' as section_type
           ${QUESTION_JOINS} 
           ${BASE_WHERE_CLAUSE} AND s.id = 1 AND l.name = 'Advanced' 
           ORDER BY RANDOM() LIMIT 6)
          UNION ALL
          -- Industrial Section (6 questions per level)
          (SELECT ${QUESTION_SELECT_FIELDS}, 'industrial' as section_type
           ${QUESTION_JOINS} 
           ${BASE_WHERE_CLAUSE} AND s.id = 2 AND l.name = 'Basic' 
           ORDER BY RANDOM() LIMIT 6)
          UNION ALL
          (SELECT ${QUESTION_SELECT_FIELDS}, 'industrial' as section_type
           ${QUESTION_JOINS} 
           ${BASE_WHERE_CLAUSE} AND s.id = 2 AND l.name = 'Intermediate' 
           ORDER BY RANDOM() LIMIT 6)
          UNION ALL
          (SELECT ${QUESTION_SELECT_FIELDS}, 'industrial' as section_type
           ${QUESTION_JOINS} 
           ${BASE_WHERE_CLAUSE} AND s.id = 2 AND l.name = 'Advanced' 
           ORDER BY RANDOM() LIMIT 6)
        )
        SELECT * FROM adaptive_questions;
      `;
    } else {
      // STANDARD: Random mix (18 per section)
      query = `
        WITH standard_questions AS (
          -- Foundational Section (Random 18)
          (SELECT ${QUESTION_SELECT_FIELDS}, 'foundational' as section_type
           ${QUESTION_JOINS}
           ${BASE_WHERE_CLAUSE} AND s.id = 1
           ORDER BY RANDOM() LIMIT 18)
          UNION ALL
          -- Industrial Section (Random 18)
          (SELECT ${QUESTION_SELECT_FIELDS}, 'industrial' as section_type
           ${QUESTION_JOINS}
           ${BASE_WHERE_CLAUSE} AND s.id = 2
           ORDER BY RANDOM() LIMIT 18)
        )
        SELECT * FROM standard_questions;
      `;
    }

    const result = await pool.query(query, [assessmentTypeId]);

    // Shuffle final results
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
        testType: testType,
      };
    });

    return NextResponse.json(
      {
        questions: formattedQuestions,
        testType: testType,
        totalQuestions: formattedQuestions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to load questions", testType: testType },
      { status: 500 }
    );
  }
}
