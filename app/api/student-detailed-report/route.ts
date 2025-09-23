// app/api/student-detailed-report/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

interface SkillLevelData {
  id: number;
  level: string;
  description: string;
}

interface TopicRecommendation {
  topic_id: number;
  skill_level_id: number;
  recommendation: string;
}

// Helper function: Fetch skill levels from database
async function fetchSkillLevels(client: any): Promise<SkillLevelData[]> {
  try {
    console.log("🔍 [SKILL LEVELS] Fetching skill levels from database...");

    const res = await client.query(
      `SELECT id, level, description FROM skill_level WHERE is_active = TRUE ORDER BY id`
    );

    console.log("✅ [SKILL LEVELS] Successfully fetched:", res.rows);
    return res.rows;
  } catch (error) {
    console.error("❌ [SKILL LEVELS] Error fetching from database:", error);
    return [];
  }
}

// Helper function: Determine skill level based on score
function determineSkillLevelByScore(
  normalizedScore: number,
  skillLevels: SkillLevelData[]
): { skillLevelId: number; skillLevel: string } {
  console.log(
    `🎯 [SKILL DETERMINATION] Determining skill level for score: ${normalizedScore}`
  );

  if (skillLevels.length === 0) {
    return { skillLevelId: 1, skillLevel: "Unknown" };
  }

  // Default fallback logic based on score ranges
  if (normalizedScore >= 80) {
    const excellentLevel = skillLevels.find((sl) =>
      sl.level.toLowerCase().includes("excellent")
    );
    if (excellentLevel) {
      return {
        skillLevelId: excellentLevel.id,
        skillLevel: excellentLevel.level,
      };
    }

    const highestLevel = skillLevels.reduce(
      (max, current) => (current.id > max.id ? current : max),
      skillLevels[0]
    );
    return { skillLevelId: highestLevel.id, skillLevel: highestLevel.level };
  } else if (normalizedScore >= 60) {
    const partialLevel = skillLevels.find((sl) =>
      sl.level.toLowerCase().includes("partial")
    );
    if (partialLevel) {
      return { skillLevelId: partialLevel.id, skillLevel: partialLevel.level };
    }

    const sortedLevels = skillLevels.sort((a, b) => a.id - b.id);
    const middleIndex = Math.floor(sortedLevels.length / 2);
    const middleLevel = sortedLevels[middleIndex];
    return { skillLevelId: middleLevel.id, skillLevel: middleLevel.level };
  } else {
    const gapLevel = skillLevels.find(
      (sl) =>
        sl.level.toLowerCase().includes("gap") &&
        !sl.level.toLowerCase().includes("partial")
    );
    if (gapLevel) {
      return { skillLevelId: gapLevel.id, skillLevel: gapLevel.level };
    }

    const lowestLevel = skillLevels.reduce(
      (min, current) => (current.id < min.id ? current : min),
      skillLevels[0]
    );
    return { skillLevelId: lowestLevel.id, skillLevel: lowestLevel.level };
  }
}

// Helper function: Get skill level and recommendation from database
async function getSkillLevelAndRecommendation(
  client: any,
  topicId: number,
  assessmentTypeId: number,
  normalizedScore: number
): Promise<{ skillLevel: string; recommendation: string }> {
  console.log(
    `📊 [RECOMMENDATION] Getting skill level for topic ${topicId}, score: ${normalizedScore}`
  );

  try {
    const skillLevelRes = await client.query(
      `SELECT slt.skill_level_id, sl.level, sl.description
       FROM skill_level_tracker slt
       JOIN skill_level sl ON slt.skill_level_id = sl.id
       WHERE slt.topic_id = $1
         AND (slt.assessment_type_id = $2 OR slt.assessment_type_id IS NULL)
         AND slt.min_percentage <= $3
         AND slt.max_percentage >= $3
         AND slt.is_active = TRUE
         AND sl.is_active = TRUE
       ORDER BY slt.assessment_type_id DESC NULLS LAST
       LIMIT 1`,
      [topicId, assessmentTypeId, Math.round(normalizedScore)]
    );

    let skillLevelId: number;
    let skillLevel: string;

    if (skillLevelRes.rows.length === 0) {
      console.log(
        "⚠️ [RECOMMENDATION] No skill level found in tracker, using fallback..."
      );

      const skillLevels = await fetchSkillLevels(client);
      const determined = determineSkillLevelByScore(
        normalizedScore,
        skillLevels
      );
      skillLevelId = determined.skillLevelId;
      skillLevel = determined.skillLevel;
    } else {
      const skillLevelData = skillLevelRes.rows[0];
      skillLevelId = skillLevelData.skill_level_id;
      skillLevel = skillLevelData.level;
    }

    // Get recommendation for the skill level
    const recommendationRes = await client.query(
      `SELECT recommendation
       FROM skill_level_action
       WHERE topic_id = $1
         AND (assessment_type_id = $2 OR assessment_type_id IS NULL)
         AND skill_level_id = $3
         AND is_active = TRUE
       ORDER BY assessment_type_id DESC NULLS LAST
       LIMIT 1`,
      [topicId, assessmentTypeId, skillLevelId]
    );

    const recommendation =
      recommendationRes.rows.length > 0
        ? recommendationRes.rows[0].recommendation
        : generateDefaultRecommendation(skillLevel, normalizedScore);

    return { skillLevel, recommendation };
  } catch (error) {
    console.error("❌ [RECOMMENDATION] Error:", error);

    // Ultimate fallback
    const skillLevel =
      normalizedScore >= 80
        ? "Excellent"
        : normalizedScore >= 60
        ? "Partial Gap"
        : "Gap";
    const recommendation = generateDefaultRecommendation(
      skillLevel,
      normalizedScore
    );

    return { skillLevel, recommendation };
  }
}

function generateDefaultRecommendation(
  skillLevel: string,
  score: number
): string {
  if (skillLevel.toLowerCase().includes("excellent")) {
    return "Great job! You're ready to move on to advanced topics.";
  } else if (skillLevel.toLowerCase().includes("partial")) {
    return "Good progress! Review key concepts and practice more to strengthen your understanding.";
  } else {
    return "Focus on building foundational knowledge in this area through additional study and practice.";
  }
}

export async function GET(req: NextRequest) {
  const client = await pool.connect();

  try {
    console.log(
      "🚀 [REPORT API] Starting student detailed report generation..."
    );

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    console.log(
      `📋 [REPORT API] Generating report for student ID: ${studentId}`
    );

    // 1. Fetch student basic information
    const studentInfoQuery = `
      SELECT id, name, email, registration_number
      FROM academic_user
      WHERE id = $1 AND is_active = TRUE
    `;

    // 2. Fetch assessment summary from academic_assessment_final
    const assessmentSummaryQuery = `
  SELECT
    aaf.id,
    aaf.readiness_score,
    aaf.foundational_assessment,
    aaf.industrial_assessment,
    aaf.create_date as attempted_at,
    at.name as assessment_type_name,
    at.id as assessment_type_id
  FROM academic_assessment_final aaf
  INNER JOIN assessment_type at ON aaf.assessment_type_id = at.id
  WHERE aaf.academic_user_id = $1
    AND aaf.is_active = true
  ORDER BY aaf.create_date DESC
  LIMIT 1
`;

    // 3. Fetch topic-wise performance from academic_assessment_action
    const topicPerformanceQuery = `
  SELECT
    aaa.topic_id,
    t.name as topic_name,
    s.name as section_name,
    aaa.correct_answers,
    aaa.total_questions,
    aaa.topic_wt_got as weighted_score,
    aaa.level_wt_got as level_weight,
    at.name as assessment_type_name,
    aaa.assessment_type_id,
    aaa.create_date,
    CASE
      WHEN aaa.total_questions > 0 AND aaa.topic_wt_got > 0
      THEN LEAST(100, (aaa.topic_wt_got / 10.0) * 100)
      ELSE 0
    END as normalized_score
  FROM academic_assessment_action aaa
  INNER JOIN topic t ON aaa.topic_id = t.id
  INNER JOIN section s ON t.section_id = s.id
  INNER JOIN assessment_type at ON aaa.assessment_type_id = at.id
  WHERE aaa.academic_user_id = $1
    AND aaa.is_active = true
    AND aaa.create_date = (
      SELECT MAX(create_date)
      FROM academic_assessment_action
      WHERE academic_user_id = $1 AND is_active = true
    )
  ORDER BY aaa.create_date DESC, s.name, t.name
`;

    // 4. Fetch question-level details from academic_log
    const questionDetailsQuery = `
  SELECT
    al.id,
    al.topic_id,
    t.name as topic_name,
    s.name as section_name,
    al.question_bankid,
    qb.question,
    qb.option_a,
    qb.option_b,
    qb.option_c,
    qb.option_d,
    qb.correct_answer,
    al.selected_answer,
    CASE
      WHEN al.selected_answer = qb.correct_answer THEN true
      ELSE false
    END as is_correct,
    al.time_taken_seconds,
    al.confidence_level,
    al.reasoning,
    al.feedback,
    l.name as difficulty_level,
    l.weightage as level_weightage,
    at.name as assessment_type_name,
    al.create_date as attempted_at
  FROM academic_log al
  INNER JOIN question_bank qb ON al.question_bankid = qb.id
  INNER JOIN topic t ON al.topic_id = t.id
  INNER JOIN section s ON t.section_id = s.id
  INNER JOIN level l ON qb.level_id = l.id
  INNER JOIN assessment_type at ON al.assessment_type_id = at.id
  WHERE al.academic_user_id = $1
    AND al.is_active = true
    AND al.create_date = (
      SELECT MAX(create_date)
      FROM academic_log
      WHERE academic_user_id = $1 AND is_active = true
    )
  ORDER BY al.create_date DESC, t.name
`;

    // Execute all queries
    console.log("🔍 [REPORT API] Executing database queries...");

    const [studentResult, assessmentResult, topicResult, questionResult] =
      await Promise.all([
        client.query(studentInfoQuery, [studentId]),
        client.query(assessmentSummaryQuery, [studentId]),
        client.query(topicPerformanceQuery, [studentId]),
        client.query(questionDetailsQuery, [studentId]),
      ]);

    // Validate student exists
    if (studentResult.rows.length === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = studentResult.rows[0];
    console.log(`✅ [REPORT API] Found student: ${student.name}`);

    // Process assessment summary
    const assessments = assessmentResult.rows.map((row) => ({
      id: row.id,
      assessment_type_id: row.assessment_type_id,
      assessment_type_name: row.assessment_type_name,
      readiness_score: parseFloat(row.readiness_score) || 0,
      foundational_score: parseFloat(row.foundational_assessment) || 0,
      industrial_score: parseFloat(row.industrial_assessment) || 0,
      attempted_at: row.attempted_at,
      status: "completed",
    }));

    console.log(`📊 [REPORT API] Found ${assessments.length} assessments`);

    // Process topic scores with skill levels and recommendations
    console.log(
      "🎯 [REPORT API] Processing topic scores with recommendations..."
    );

    const topicScores = await Promise.all(
      topicResult.rows.map(async (row) => {
        const normalizedScore = parseFloat(row.normalized_score) || 0;

        // Get skill level and recommendation from database
        const { skillLevel, recommendation } =
          await getSkillLevelAndRecommendation(
            client,
            row.topic_id,
            row.assessment_type_id,
            normalizedScore
          );

        return {
          topic_id: row.topic_id,
          topic_name: row.topic_name,
          section_name: row.section_name,
          assessment_type_name: row.assessment_type_name,
          assessment_type_id: row.assessment_type_id,
          correct: row.correct_answers,
          total: row.total_questions,
          weighted_score: row.weighted_score || 0,
          normalized_score: normalizedScore,
          classification: skillLevel,
          recommendation: recommendation,
          attempted_at: row.create_date,
        };
      })
    );

    console.log(`🎯 [REPORT API] Processed ${topicScores.length} topic scores`);

    // Process question details
    const questionDetails = questionResult.rows.map((row) => ({
      id: row.id,
      topic_id: row.topic_id,
      topic_name: row.topic_name,
      section_name: row.section_name,
      question_id: row.question_bankid,
      question: row.question,
      options: {
        A: row.option_a,
        B: row.option_b,
        C: row.option_c,
        D: row.option_d,
      },
      correct_answer: row.correct_answer,
      selected_answer: row.selected_answer,
      is_correct: row.is_correct,
      time_taken_seconds: row.time_taken_seconds,
      confidence_level: row.confidence_level,
      reasoning: row.reasoning,
      feedback: row.feedback,
      difficulty_level: row.difficulty_level,
      level_weightage: row.level_weightage,
      assessment_type_name: row.assessment_type_name,
      attempted_at: row.attempted_at,
    }));

    console.log(
      `📝 [REPORT API] Found ${questionDetails.length} question details`
    );

    // Calculate summary statistics
    const totalQuestions = topicScores.reduce(
      (sum, topic) => sum + topic.total,
      0
    );
    const totalCorrect = topicScores.reduce(
      (sum, topic) => sum + topic.correct,
      0
    );
    const averageScore =
      totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    // Topic performance summary
    const topicSummary = {
      total_topics: topicScores.length,
      strengths: topicScores.filter((t) =>
        t.classification.toLowerCase().includes("excellent")
      ).length,
      partial: topicScores.filter((t) =>
        t.classification.toLowerCase().includes("partial")
      ).length,
      gaps: topicScores.filter(
        (t) =>
          t.classification.toLowerCase().includes("gap") &&
          !t.classification.toLowerCase().includes("partial")
      ).length,
    };

    // Section-wise summary
    const sectionSummary = topicScores.reduce((acc, topic) => {
      const section = topic.section_name;
      if (!acc[section]) {
        acc[section] = {
          total_questions: 0,
          correct_answers: 0,
          topics: [],
        };
      }
      acc[section].total_questions += topic.total;
      acc[section].correct_answers += topic.correct;
      acc[section].topics.push(topic.topic_name);
      return acc;
    }, {} as Record<string, any>);

    // Add percentage calculation to section summary
    Object.keys(sectionSummary).forEach((section) => {
      const data = sectionSummary[section];
      data.percentage =
        data.total_questions > 0
          ? Math.round(
              (data.correct_answers / data.total_questions) * 100 * 100
            ) / 100
          : 0;
    });

    console.log("✅ [REPORT API] Successfully generated comprehensive report");

    return NextResponse.json({
      success: true,
      student_id: parseInt(studentId),
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        registration_number: student.registration_number,
      },
      summary: {
        total_assessments: assessments.length,
        total_questions: totalQuestions,
        total_correct: totalCorrect,
        average_score: Math.round(averageScore * 100) / 100,
        topic_summary: topicSummary,
        section_summary: sectionSummary,
      },
      assessments: assessments,
      topic_scores: topicScores,
      question_details: questionDetails,
    });
  } catch (error) {
    console.error("❌ [REPORT API] Error generating student report:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    client.release();
    console.log("🔚 [REPORT API] Database client released");
  }
}
