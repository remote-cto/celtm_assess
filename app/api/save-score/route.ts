// /api/save-score/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

interface SaveScoreRequest {
  academic_user_id: number;
  tenant_id: number;
  assessment_type_id: number;
  answers: { [key: string]: number };
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
    console.log(
      "🔍 [LEVEL WEIGHTS] Attempting to fetch level weights from database..."
    );

    const res = await client.query(
      `SELECT name, weightage FROM level WHERE is_active = TRUE`
    );

    const levelWeights: Record<string, number> = {};
    for (const row of res.rows) {
      levelWeights[row.name] = row.weightage;
    }

    console.log(
      "✅ [LEVEL WEIGHTS] Successfully fetched from DATABASE:",
      levelWeights
    );
    return levelWeights;
  } catch (error) {
    console.error("❌ [LEVEL WEIGHTS] Error fetching from database:", error);
    console.log("🔄 [LEVEL WEIGHTS] Using FALLBACK weights...");

    const fallbackWeights = {
      Basic: 1.0,
      Intermediate: 1.5,
      Advanced: 2.0,
    };

    console.log(
      "⚠️ [LEVEL WEIGHTS] FALLBACK weights applied:",
      fallbackWeights
    );
    return fallbackWeights;
  }
}

// Helper function: Fetch skill levels from database
async function fetchSkillLevels(
  client: any
): Promise<Array<{ id: number; level: string; description: string }>> {
  try {
    console.log(
      "🔍 [SKILL LEVELS] Attempting to fetch skill levels from database..."
    );

    const res = await client.query(
      `SELECT id, level, description FROM skill_level WHERE is_active = TRUE ORDER BY id`
    );

    console.log(
      "✅ [SKILL LEVELS] Successfully fetched from DATABASE:",
      res.rows
    );
    return res.rows;
  } catch (error) {
    console.error("❌ [SKILL LEVELS] Error fetching from database:", error);
    console.log("⚠️ [SKILL LEVELS] Returning empty array as FALLBACK");
    return [];
  }
}

// Helper function: Determine skill level based on score
function determineSkillLevelByScore(
  normalizedScore: number,
  skillLevels: Array<{ id: number; level: string; description: string }>
): { skillLevelId: number; skillLevel: string } {
  console.log(
    `🎯 [SKILL DETERMINATION] Determining skill level for score: ${normalizedScore}`
  );
  console.log(`🎯 [SKILL DETERMINATION] Available skill levels:`, skillLevels);

  // Default fallback logic based on score ranges
  if (normalizedScore >= 80) {
    console.log(
      "🎯 [SKILL DETERMINATION] Score >= 80, looking for 'Excellent' level..."
    );

    // Look for "Excellent" or highest level
    const excellentLevel = skillLevels.find((sl) =>
      sl.level.toLowerCase().includes("excellent")
    );
    if (excellentLevel) {
      console.log(
        "✅ [SKILL DETERMINATION] Found 'Excellent' level:",
        excellentLevel
      );
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
    console.log(
      "⚠️ [SKILL DETERMINATION] No 'Excellent' found, using highest ID level:",
      highestLevel
    );
    return { skillLevelId: highestLevel.id, skillLevel: highestLevel.level };
  } else if (normalizedScore >= 60) {
    console.log(
      "🎯 [SKILL DETERMINATION] Score >= 60, looking for 'Partial' level..."
    );

    // Look for "Partial Gap" or medium level
    const partialLevel = skillLevels.find((sl) =>
      sl.level.toLowerCase().includes("partial")
    );
    if (partialLevel) {
      console.log(
        "✅ [SKILL DETERMINATION] Found 'Partial' level:",
        partialLevel
      );
      return { skillLevelId: partialLevel.id, skillLevel: partialLevel.level };
    }

    // If no "Partial" found, use middle level
    const sortedLevels = skillLevels.sort((a, b) => a.id - b.id);
    const middleIndex = Math.floor(sortedLevels.length / 2);
    const middleLevel = sortedLevels[middleIndex];
    console.log(
      "⚠️ [SKILL DETERMINATION] No 'Partial' found, using middle level:",
      middleLevel
    );
    return { skillLevelId: middleLevel.id, skillLevel: middleLevel.level };
  } else {
    console.log(
      "🎯 [SKILL DETERMINATION] Score < 60, looking for 'Gap' level..."
    );

    // Look for "Gap" or lowest level
    const gapLevel = skillLevels.find(
      (sl) =>
        sl.level.toLowerCase().includes("gap") &&
        !sl.level.toLowerCase().includes("partial")
    );
    if (gapLevel) {
      console.log("✅ [SKILL DETERMINATION] Found 'Gap' level:", gapLevel);
      return { skillLevelId: gapLevel.id, skillLevel: gapLevel.level };
    }

    // If no "Gap" found, use the lowest ID (assuming lower ID = lower level)
    const lowestLevel = skillLevels.reduce(
      (min, current) => (current.id < min.id ? current : min),
      skillLevels[0]
    );
    console.log(
      "⚠️ [SKILL DETERMINATION] No 'Gap' found, using lowest ID level:",
      lowestLevel
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
  console.log(
    `📊 [RECOMMENDATION] Getting skill level and recommendation for:`
  );
  console.log(
    `📊 [RECOMMENDATION] Topic ID: ${topicId}, Assessment Type: ${assessmentTypeId}, Score: ${normalizedScore}`
  );

  try {
    // First, find the appropriate skill level based on percentage range
    console.log("🔍 [RECOMMENDATION] Querying skill_level_tracker table...");

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
      console.log(
        "⚠️ [RECOMMENDATION] No skill level found in skill_level_tracker, using fallback logic..."
      );

      // Fallback: fetch skill levels from database and determine based on score
      const skillLevels = await fetchSkillLevels(client);

      if (skillLevels.length === 0) {
        console.log(
          "❌ [RECOMMENDATION] No skill levels found in database, using ultimate fallback"
        );
        return {
          skillLevel: "Unknown",
          recommendation: "Continue practicing to improve your skills.",
        };
      }

      const { skillLevelId, skillLevel } = determineSkillLevelByScore(
        normalizedScore,
        skillLevels
      );
      console.log(
        `🔄 [RECOMMENDATION] FALLBACK skill level determined: ${skillLevel} (ID: ${skillLevelId})`
      );

      // Get recommendation for the determined skill level
      console.log(
        "🔍 [RECOMMENDATION] Querying skill_level_action for fallback recommendation..."
      );

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

      if (recommendationRes.rows.length > 0) {
        console.log(
          "✅ [RECOMMENDATION] FALLBACK recommendation found in DATABASE:",
          recommendation
        );
      } else {
        console.log(
          "⚠️ [RECOMMENDATION] No recommendation found in database, using default FALLBACK"
        );
      }

      return { skillLevel, recommendation };
    }

    const skillLevelData = skillLevelRes.rows[0];
    console.log(
      "✅ [RECOMMENDATION] Skill level found in DATABASE:",
      skillLevelData
    );

    // Get recommendation for the found skill level
    console.log(
      "🔍 [RECOMMENDATION] Querying skill_level_action for recommendation..."
    );

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

    if (recommendationRes.rows.length > 0) {
      console.log(
        "✅ [RECOMMENDATION] Recommendation found in DATABASE:",
        recommendation
      );
    } else {
      console.log(
        "⚠️ [RECOMMENDATION] No recommendation found in database, using default"
      );
    }

    return {
      skillLevel: skillLevelData.level,
      recommendation,
    };
  } catch (error) {
    console.error(
      "❌ [RECOMMENDATION] Error fetching skill level and recommendation:",
      error
    );
    console.log(
      "🔄 [RECOMMENDATION] Attempting fallback skill level determination..."
    );

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

        console.log(
          `⚠️ [RECOMMENDATION] ERROR FALLBACK - Skill Level: ${skillLevel}, Recommendation: ${fallbackRecommendation}`
        );
        return { skillLevel, recommendation: fallbackRecommendation };
      }
    } catch (fallbackError) {
      console.error(
        "❌ [RECOMMENDATION] Error in fallback skill level fetch:",
        fallbackError
      );
    }

    // Ultimate fallback
    console.log("❌ [RECOMMENDATION] Using ULTIMATE FALLBACK values");
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
  console.log("🧮 [CALCULATION] Starting score calculations...");

  // Fetch level weights from database
  const levelWeights = await fetchLevelWeights(client);

  // Group questions by topic
  const topicGroups = questions.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {} as Record<string, typeof questions>);

  console.log("📋 [CALCULATION] Topics to process:", Object.keys(topicGroups));

  // Calculate topic scores with database recommendations
  const topicScores = await Promise.all(
    Object.keys(topicGroups).map(async (topic) => {
      console.log(`\n🔄 [TOPIC: ${topic}] Processing topic...`);

      const topicQuestions = topicGroups[topic];
      const correctAnswers = topicQuestions.filter(
        (q) => answers[q.id] === q.correctAnswer
      );

      console.log(
        `📊 [TOPIC: ${topic}] Correct: ${correctAnswers.length}/${topicQuestions.length}`
      );

      // Count correct answers by level
      const levels: Record<string, number> = {};
      correctAnswers.forEach((q) => {
        if (!levels[q.level]) levels[q.level] = 0;
        levels[q.level]++;
      });

      console.log(`📈 [TOPIC: ${topic}] Correct answers by level:`, levels);

      const totalCorrect = correctAnswers.length;
      let weightedScore = 0;

      if (totalCorrect > 0) {
        // Calculate level average using database weights
        let levelWeightedSum = 0;
        Object.keys(levels).forEach((level) => {
          const weight = levelWeights[level] || 1.0;
          levelWeightedSum += levels[level] * weight;
          console.log(
            `⚖️ [TOPIC: ${topic}] Level ${level}: ${
              levels[level]
            } questions × weight ${weight} = ${levels[level] * weight}`
          );
        });

        const levelAvg = levelWeightedSum / totalCorrect;
        weightedScore = totalCorrect * levelAvg;

        console.log(
          `🧮 [TOPIC: ${topic}] Level weighted sum: ${levelWeightedSum}, Level avg: ${levelAvg}, Weighted score: ${weightedScore}`
        );
      }

      const normalizedScore = Math.min(100, (weightedScore / 10) * 100);
      console.log(`📊 [TOPIC: ${topic}] Normalized score: ${normalizedScore}%`);

      // Get skill level and recommendation from database
      const topicId = topicNameToId[topic];
      let skillLevel = "Unknown";
      let recommendation = "Continue practicing to improve your skills.";

      if (topicId) {
        console.log(
          `🔍 [TOPIC: ${topic}] Topic ID found: ${topicId}, getting skill level and recommendation...`
        );

        const skillData = await getSkillLevelAndRecommendation(
          client,
          topicId,
          assessmentTypeId,
          normalizedScore
        );
        skillLevel = skillData.skillLevel;
        recommendation = skillData.recommendation;

        console.log(
          `✅ [TOPIC: ${topic}] Final - Skill Level: ${skillLevel}, Recommendation: ${recommendation}`
        );
      } else {
        console.log(
          `⚠️ [TOPIC: ${topic}] Topic ID not found, using default values`
        );
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

  console.log("✅ [CALCULATION] All topic calculations completed");

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

  console.log(
    `📊 [SECTIONS] Foundational: ${foundationalScore}%, Industrial: ${industrialScore}%`
  );

  // Calculate total and readiness scores
  const totalScore = topicScores.reduce((sum, t) => sum + t.weighted_score, 0);

  // Get max possible level weight for calculation
  const maxLevelWeight = Math.max(...Object.values(levelWeights), 1); // Ensure it's at least 1
  const maxPossible = questions.length * maxLevelWeight;
  const readinessScore = maxPossible > 0 ? Math.min(100, (totalScore / maxPossible) * 100) : 0;

  console.log(
    `🎯 [FINAL SCORES] Total: ${totalScore}, Readiness: ${readinessScore}%, Max possible: ${maxPossible}`
  );

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
  console.log(
    "🔍 [SECTION DB] Attempting to fetch section information from database..."
  );

  try {
    const topicIds = Object.values(topicNameToId);
    if (topicIds.length === 0) {
        console.log("⚠️ [SECTION DB] No topic IDs to look up. Skipping.");
        return { foundational: null, industrial: null };
    }
    console.log("🔍 [SECTION DB] Topic IDs to lookup:", topicIds);

    const res = await client.query(
      `SELECT t.id as topic_id, t.name as topic_name, s.name as section_name
       FROM topic t
       JOIN section s ON t.section_id = s.id
       WHERE t.id = ANY($1) AND t.is_active = TRUE AND s.is_active = TRUE`,
      [topicIds]
    );

    console.log("✅ [SECTION DB] Section mapping found:", res.rows);

    const topicToSection: Record<string, string> = {};
    for (const row of res.rows) {
      topicToSection[row.topic_name] = row.section_name;
    }

    // Calculate correct answers by section
    const sectionStats = {
      Foundational: { correct: 0, total: 0 }, // FIX: Was "Foundation"
      Industrial: { correct: 0, total: 0 },   // FIX: Was "Industry"
    };

    questions.forEach((q) => {
      const section = topicToSection[q.topic];
      if (section === "Foundational" || section === "Industrial") { // FIX: Was "Foundation" or "Industry"
        sectionStats[section].total++;
        if (answers[q.id] === q.correctAnswer) {
          sectionStats[section].correct++;
        }
      }
    });

    const foundational =
      sectionStats.Foundational.total > 0  // FIX: Was "Foundation"
        ? (sectionStats.Foundational.correct / sectionStats.Foundational.total) * 100
        : null;

    const industrial =
      sectionStats.Industrial.total > 0    // FIX: Was "Industry"
        ? (sectionStats.Industrial.correct / sectionStats.Industrial.total) * 100
        : null;

    console.log(
      `✅ [SECTION DB] DATABASE section scores - Foundational: ${foundational}%, Industrial: ${industrial}%`
    );

    return { foundational, industrial };
  } catch (error) {
    console.error(
      "❌ [SECTION DB] Error calculating section scores from database:",
      error
    );
    console.log(
      "⚠️ [SECTION DB] Will use calculated section scores as fallback"
    );
    return { foundational: null, industrial: null };
  }
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    console.log("🚀 [API] Starting assessment save process...");
    await client.query("BEGIN");

    // Parse and validate the request
    const {
      academic_user_id,
      tenant_id,
      assessment_type_id,
      answers,
      questions,
      time_started,
      time_completed,
    }: SaveScoreRequest = await req.json();

    console.log(
      `📝 [API] Request data - User: ${academic_user_id}, Tenant: ${tenant_id}, Assessment Type: ${assessment_type_id}`
    );
    console.log(
      `📝 [API] Questions count: ${questions.length}, Answers count: ${
        Object.keys(answers).length
      }`
    );

    if (
      !academic_user_id ||
      !tenant_id ||
      !assessment_type_id ||
      !answers ||
      !questions ||
      !time_started ||
      !time_completed
    ) {
      console.log("❌ [API] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Lookup topic and level ID mappings first
    const topicNames = [...new Set(questions.map((q) => q.topic))];
    console.log("🔍 [API] Looking up topic IDs for:", topicNames);

    const resTopics = await client.query(
      `SELECT id, name FROM topic WHERE name = ANY($1) AND is_active = TRUE`,
      [topicNames]
    );
    const topicNameToId: Record<string, number> = {};
    for (const row of resTopics.rows) topicNameToId[row.name] = row.id;

    console.log("✅ [API] Topic name to ID mapping:", topicNameToId);

    const levelNames = [...new Set(questions.map((q) => q.level))];
    console.log("🔍 [API] Looking up level IDs for:", levelNames);

    const resLevels = await client.query(
      `SELECT id, name FROM level WHERE name = ANY($1) AND is_active = TRUE`,
      [levelNames]
    );
    const levelNameToId: Record<string, number> = {};
    for (const row of resLevels.rows) levelNameToId[row.name] = row.id;

    console.log("✅ [API] Level name to ID mapping:", levelNameToId);

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

    // Use DB section scores if available, otherwise use calculated ones
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

    if (
      dbSectionScores.foundational !== null ||
      dbSectionScores.industrial !== null
    ) {
      console.log(
        "✅ [API] Using DATABASE section scores:",
        finalSectionScores
      );
    } else {
      console.log(
        "⚠️ [API] Using CALCULATED section scores:",
        finalSectionScores
      );
    }

    // Insert the assessment final record
    console.log("💾 [API] Inserting assessment final record...");

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

    console.log(
      "✅ [API] Assessment final record created with ID:",
      assessmentFinalId
    );

    // Insert each question attempt log
    console.log("💾 [API] Inserting question attempt logs...");

    const logPromises = questions
      .map((q) => {
        const selectedOptionIdx = answers[q.id];
        const topicId = topicNameToId[q.topic];
        if (typeof selectedOptionIdx !== "number" || !topicId) return null;

        return client.query(
          `INSERT INTO academic_log (
          academic_user_id, assessment_type_id, topic_id, question_bankid,
          selected_answer, time_taken_seconds, confidence_level, reasoning, feedback,
          create_date, is_active
        ) VALUES ($1, $2, $3, $4, $5, NULL, NULL, NULL, NULL, NOW(), TRUE)`,
          [
            academic_user_id,
            assessment_type_id,
            topicId,
            parseInt(q.id, 10),
            String.fromCharCode(65 + selectedOptionIdx),
          ]
        );
      })
      .filter(Boolean);
    await Promise.all(logPromises);

    console.log(
      `✅ [API] Inserted ${logPromises.length} question attempt logs`
    );

    // Insert per-topic scores into academic_assessment_action
    console.log("💾 [API] Inserting topic assessment actions...");

    const topicPromises = calculatedScores.topicScores
      .map((topicData) => {
        const topic_id = topicNameToId[topicData.topic];
        if (!topic_id) {
          console.warn(
            `⚠️ [API] Topic ID not found for topic: ${topicData.topic}`
          );
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

    console.log(
      `✅ [API] Inserted ${topicPromises.length} topic assessment actions`
    );

    // Commit and respond with all calculated data
    await client.query("COMMIT");
    console.log("✅ [API] Transaction committed successfully");

    console.log("🎉 [API] Assessment save completed successfully!");

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
    console.error("❌ [API] Error saving assessment:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
    console.log("🔚 [API] Database client released");
  }
}