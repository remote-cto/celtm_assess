// /api/save-score/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

interface SaveScoreRequest {
  academic_user_id: number;
  tenant_id: number;
  assessment_type_id: number;
  answers: { [key: string]: number };
  responseTimes: { [key: string]: number };
  questions: Array<{
    id: string;
    correctAnswer: number;
    topic: string;
    level: string;
    section: string;
  }>;
  time_started: number;
  time_completed: number;
}

// Helper function: Fetch level weights from database
async function fetchLevelWeights(client: any): Promise<Record<string, number>> {
  try {
    const res = await client.query(
      `SELECT name, weightage FROM level WHERE is_active = TRUE`
    );

    const levelWeights: Record<string, number> = {};
    for (const row of res.rows) {
      levelWeights[row.name] = row.weightage;
    }

    return levelWeights;
  } catch (error) {
    console.error("Error fetching level weights from database:", error);

    const fallbackWeights = {
      Basic: 1.0,
      Intermediate: 1.5,
      Advanced: 2.0,
    };

    return fallbackWeights;
  }
}

// Helper function: Fetch skill levels from database
async function fetchSkillLevels(
  client: any
): Promise<Array<{ id: number; level: string; description: string }>> {
  try {
    const res = await client.query(
      `SELECT id, level, description FROM skill_level WHERE is_active = TRUE ORDER BY id`
    );

    return res.rows;
  } catch (error) {
    console.error("Error fetching skill levels from database:", error);
    return [];
  }
}

// Helper function: Determine skill level based on score
function determineSkillLevelByScore(
  normalizedScore: number,
  skillLevels: Array<{ id: number; level: string; description: string }>
): { skillLevelId: number; skillLevel: string } {
  // Default fallback logic based on score ranges
  if (normalizedScore >= 80) {
    // Look for "Excellent" or highest level
    const excellentLevel = skillLevels.find((sl) =>
      sl.level.toLowerCase().includes("excellent")
    );
    if (excellentLevel) {
      return {
        skillLevelId: excellentLevel.id,
        skillLevel: excellentLevel.level,
      };
    }

    // If no "Excellent" found, use the highest ID (assuming higher ID = better level)
    const highestLevel = skillLevels.reduce(
      (max, current) => (current.id > max.id ? current : max),
      skillLevels[0]
    );
    return { skillLevelId: highestLevel.id, skillLevel: highestLevel.level };
  } else if (normalizedScore >= 60) {
    // Look for "Partial Gap" or medium level
    const partialLevel = skillLevels.find((sl) =>
      sl.level.toLowerCase().includes("partial")
    );
    if (partialLevel) {
      return { skillLevelId: partialLevel.id, skillLevel: partialLevel.level };
    }

    // If no "Partial" found, use middle level
    const sortedLevels = skillLevels.sort((a, b) => a.id - b.id);
    const middleIndex = Math.floor(sortedLevels.length / 2);
    const middleLevel = sortedLevels[middleIndex];
    return { skillLevelId: middleLevel.id, skillLevel: middleLevel.level };
  } else {
    // Look for "Gap" or lowest level
    const gapLevel = skillLevels.find(
      (sl) =>
        sl.level.toLowerCase().includes("gap") &&
        !sl.level.toLowerCase().includes("partial")
    );
    if (gapLevel) {
      return { skillLevelId: gapLevel.id, skillLevel: gapLevel.level };
    }

    // If no "Gap" found, use the lowest ID (assuming lower ID = lower level)
    const lowestLevel = skillLevels.reduce(
      (min, current) => (current.id < min.id ? current : min),
      skillLevels[0]
    );
    return { skillLevelId: lowestLevel.id, skillLevel: lowestLevel.level };
  }
}

// Helper function: Get skill level and recommendation based on normalized score
async function getSkillLevelAndRecommendation(
  client: any,
  topicId: number,
  assessmentTypeId: number,
  normalizedScore: number
): Promise<{ skillLevel: string; recommendation: string }> {
  try {
    // First, find the appropriate skill level based on percentage range
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

    if (skillLevelRes.rows.length === 0) {
      // Fallback: fetch skill levels from database and determine based on score
      const skillLevels = await fetchSkillLevels(client);

      if (skillLevels.length === 0) {
        return {
          skillLevel: "Unknown",
          recommendation: "Continue practicing to improve your skills.",
        };
      }

      const { skillLevelId, skillLevel } = determineSkillLevelByScore(
        normalizedScore,
        skillLevels
      );

      // Get recommendation for the determined skill level
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
          : "Continue practicing to improve your skills.";

      return { skillLevel, recommendation };
    }

    const skillLevelData = skillLevelRes.rows[0];

    // Get recommendation for the found skill level
    const recommendationRes = await client.query(
      `SELECT recommendation
       FROM skill_level_action
       WHERE topic_id = $1 
         AND (assessment_type_id = $2 OR assessment_type_id IS NULL)
         AND skill_level_id = $3
         AND is_active = TRUE
       ORDER BY assessment_type_id DESC NULLS LAST
       LIMIT 1`,
      [topicId, assessmentTypeId, skillLevelData.skill_level_id]
    );

    const recommendation =
      recommendationRes.rows.length > 0
        ? recommendationRes.rows[0].recommendation
        : "Continue practicing to improve your skills.";

    return {
      skillLevel: skillLevelData.level,
      recommendation,
    };
  } catch (error) {
    console.error("Error fetching skill level and recommendation:", error);

    // Fallback: try to fetch skill levels from database even in error case
    try {
      const skillLevels = await fetchSkillLevels(client);
      if (skillLevels.length > 0) {
        const { skillLevel } = determineSkillLevelByScore(
          normalizedScore,
          skillLevels
        );
        const fallbackRecommendation =
          normalizedScore >= 80
            ? "Great job! You're ready to move on."
            : normalizedScore < 60
            ? "You need to skill up in this topic."
            : "Revise key areas and practice more.";

        return { skillLevel, recommendation: fallbackRecommendation };
      }
    } catch (fallbackError) {
      console.error("Error in fallback skill level fetch:", fallbackError);
    }

    // Ultimate fallback
    return {
      skillLevel: "Unknown",
      recommendation: "Continue practicing to improve your skills.",
    };
  }
}

// Helper function: Calculate all scores
async function calculateAllScores(
  client: any,
  questions: Array<{
    id: string;
    correctAnswer: number;
    topic: string;
    level: string;
    section: string;
  }>,
  answers: { [key: string]: number },
  assessmentTypeId: number,
  topicNameToId: Record<string, number>
) {
  // Fetch level weights from database
  const levelWeights = await fetchLevelWeights(client);

  // Group questions by topic
  const topicGroups = questions.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {} as Record<string, typeof questions>);

  // Calculate topic scores with database recommendations
  const topicScores = await Promise.all(
    Object.keys(topicGroups).map(async (topic) => {
      const topicQuestions = topicGroups[topic];
      const correctAnswers = topicQuestions.filter(
        (q) => answers[q.id] === q.correctAnswer
      );

      // Count correct answers by level
      const levels: Record<string, number> = {};
      correctAnswers.forEach((q) => {
        if (!levels[q.level]) levels[q.level] = 0;
        levels[q.level]++;
      });

      const totalCorrect = correctAnswers.length;
      let weightedScore = 0;

      if (totalCorrect > 0) {
        // Calculate level average using database weights
        let levelWeightedSum = 0;
        Object.keys(levels).forEach((level) => {
          const weight = levelWeights[level] || 1.0;
          levelWeightedSum += levels[level] * weight;
        });

        const levelAvg = levelWeightedSum / totalCorrect;
        weightedScore = totalCorrect * levelAvg;
      }

      const normalizedScore = Math.min(100, (weightedScore / 10) * 100);

      // Get skill level and recommendation from database
      const topicId = topicNameToId[topic];
      let skillLevel = "Unknown";
      let recommendation = "Continue practicing to improve your skills.";

      if (topicId) {
        const skillData = await getSkillLevelAndRecommendation(
          client,
          topicId,
          assessmentTypeId,
          normalizedScore
        );
        skillLevel = skillData.skillLevel;
        recommendation = skillData.recommendation;
      }

      return {
        topic,
        correct: correctAnswers.length,
        total: topicQuestions.length,
        weighted_score: weightedScore,
        normalized_score: normalizedScore,
        classification: skillLevel,
        recommendation: recommendation,
        levels,
      };
    })
  );

  // Calculate section scores from frontend data as a reliable fallback
  const sectionStats = {
    Foundational: { correct: 0, total: 0 },
    Industrial: { correct: 0, total: 0 },
  };

  questions.forEach((q) => {
    const section = q.section;
    if (section === "Foundational" || section === "Industrial") {
      sectionStats[section].total++;
      if (answers[q.id] === q.correctAnswer) {
        sectionStats[section].correct++;
      }
    }
  });

  const foundationalScore =
    sectionStats.Foundational.total > 0
      ? (sectionStats.Foundational.correct / sectionStats.Foundational.total) *
        100
      : null;

  const industrialScore =
    sectionStats.Industrial.total > 0
      ? (sectionStats.Industrial.correct / sectionStats.Industrial.total) * 100
      : null;

  // Calculate total and readiness scores
  const totalScore = topicScores.reduce((sum, t) => sum + t.weighted_score, 0);

  // Get max possible level weight for calculation
  const maxLevelWeight = Math.max(...Object.values(levelWeights), 1); // Ensure it's at least 1
  const maxPossible = questions.length * maxLevelWeight;
  const readinessScore = maxPossible > 0 ? Math.min(100, (totalScore / maxPossible) * 100) : 0;

  return {
    topicScores,
    sectionScores: {
      foundational: foundationalScore,
      industrial: industrialScore,
    },
    totalScore,
    readinessScore,
  };
}


async function calculateSectionScoresFromDB(
  client: any,
  questions: Array<{
    id: string;
    correctAnswer: number;
    topic: string;
    level: string;
    section: string;
  }>,
  answers: { [key: string]: number },
  topicNameToId: Record<string, number>
) {
  try {
    const topicIds = Object.values(topicNameToId);
    if (topicIds.length === 0) {
        return { foundational: null, industrial: null };
    }

    const res = await client.query(
      `SELECT t.id as topic_id, t.name as topic_name, s.name as section_name
       FROM topic t
       JOIN section s ON t.section_id = s.id
       WHERE t.id = ANY($1) AND t.is_active = TRUE AND s.is_active = TRUE`,
      [topicIds]
    );

    const topicToSection: Record<string, string> = {};
    for (const row of res.rows) {
      topicToSection[row.topic_name] = row.section_name;
    }

    // Calculate correct answers by section
    const sectionStats = {
      Foundational: { correct: 0, total: 0 },
      Industrial: { correct: 0, total: 0 },
    };

    questions.forEach((q) => {
      const section = topicToSection[q.topic];
      if (section === "Foundational" || section === "Industrial") {
        sectionStats[section].total++;
        if (answers[q.id] === q.correctAnswer) {
          sectionStats[section].correct++;
        }
      }
    });

    const foundational =
      sectionStats.Foundational.total > 0
        ? (sectionStats.Foundational.correct / sectionStats.Foundational.total) * 100
        : null;

    const industrial =
      sectionStats.Industrial.total > 0
        ? (sectionStats.Industrial.correct / sectionStats.Industrial.total) * 100
        : null;

    return { foundational, industrial };
  } catch (error) {
    console.error("Error calculating section scores from database:", error);
    return { foundational: null, industrial: null };
  }
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Parse and validate the request
    const {
      academic_user_id,
      tenant_id,
      assessment_type_id,
      answers,
       responseTimes,
      questions,
      time_started,
      time_completed,
    }: SaveScoreRequest = await req.json();

    if (
      !academic_user_id ||
      !tenant_id ||
      !assessment_type_id ||
      !answers ||
      !questions ||
      !time_started ||
      !time_completed
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Lookup topic and level ID mappings first
    const topicNames = [...new Set(questions.map((q) => q.topic))];

    const resTopics = await client.query(
      `SELECT id, name FROM topic WHERE name = ANY($1) AND is_active = TRUE`,
      [topicNames]
    );
    const topicNameToId: Record<string, number> = {};
    for (const row of resTopics.rows) topicNameToId[row.name] = row.id;

    const levelNames = [...new Set(questions.map((q) => q.level))];

    const resLevels = await client.query(
      `SELECT id, name FROM level WHERE name = ANY($1) AND is_active = TRUE`,
      [levelNames]
    );
    const levelNameToId: Record<string, number> = {};
    for (const row of resLevels.rows) levelNameToId[row.name] = row.id;

    // Calculate all scores using backend logic
    const calculatedScores = await calculateAllScores(
      client,
      questions,
      answers,
      assessment_type_id,
      topicNameToId
    );

    // Get database section scores (fallback to calculated ones if DB lookup fails)
    const dbSectionScores = await calculateSectionScoresFromDB(
      client,
      questions,
      answers,
      topicNameToId
    );

    
    const finalSectionScores = {
      foundational:
        dbSectionScores.foundational !== null
          ? dbSectionScores.foundational
          : calculatedScores.sectionScores.foundational,
      industrial:
        dbSectionScores.industrial !== null
          ? dbSectionScores.industrial
          : calculatedScores.sectionScores.industrial,
    };

    // Insert the assessment final record
    const resFinal = await client.query(
      `INSERT INTO academic_assessment_final (
        tenant_id, assessment_type_id, academic_user_id,
        readiness_score, foundational_assessment, industrial_assessment,
        create_date, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), TRUE)
      RETURNING id;`,
      [
        tenant_id,
        assessment_type_id,
        academic_user_id,
        calculatedScores.readinessScore,
        finalSectionScores.foundational,
        finalSectionScores.industrial,
      ]
    );
    const assessmentFinalId = resFinal.rows[0].id;

    // Insert each question attempt log
    const logPromises = questions
  .map((q) => {
    const selectedOptionIdx = answers[q.id];
    const responseTime = responseTimes?.[q.id] || null; // Get response time
    const topicId = topicNameToId[q.topic];
    if (typeof selectedOptionIdx !== "number" || !topicId) return null;

    return client.query(
      `INSERT INTO academic_log (
        academic_user_id, assessment_type_id, topic_id, question_bankid,
        selected_answer, time_taken_seconds, response_time_seconds, 
        confidence_level, reasoning, feedback,
        create_date, is_active
      ) VALUES ($1, $2, $3, $4, $5, NULL, $6, NULL, NULL, NULL, NOW(), TRUE)`,
      [
        academic_user_id,
        assessment_type_id,
        topicId,
        parseInt(q.id, 10),
        String.fromCharCode(65 + selectedOptionIdx),
        responseTime, 
      ]
    );
  })
  .filter(Boolean);
    await Promise.all(logPromises);

    // Insert per-topic scores into academic_assessment_action
    const topicPromises = calculatedScores.topicScores
      .map((topicData) => {
        const topic_id = topicNameToId[topicData.topic];
        if (!topic_id) {
          return null;
        }

        return client.query(
          `INSERT INTO academic_assessment_action (
          tenant_id, assessment_type_id, academic_user_id, topic_id,
          total_questions, correct_answers, topic_wt_got, level_wt_got,
          create_date, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, NOW(), TRUE)`,
          [
            tenant_id,
            assessment_type_id,
            academic_user_id,
            topic_id,
            topicData.total,
            topicData.correct,
            Math.round(topicData.weighted_score),
          ]
        );
      })
      .filter(Boolean);
    await Promise.all(topicPromises);

    // Commit and respond with all calculated data
    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      assessment_id: assessmentFinalId,
      total_score: calculatedScores.totalScore,
      readiness_score: calculatedScores.readinessScore,
      section_scores: finalSectionScores,
      topic_scores: calculatedScores.topicScores,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error saving assessment:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}