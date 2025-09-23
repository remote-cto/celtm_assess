// components/AssessmentResult.tsx
"use client";

import React, { useEffect } from "react";
import Chart from "chart.js/auto";

interface TopicScore {
  topic_id: number;
  topic_name: string;
  correct_answers: number;
  total_questions: number;
  weighted_score: number;
  normalized_score: number;
  classification: string;
   recommendation?: string;
}

interface AssessmentResult {
  id: number;
  score: number;
  total_questions: number;
  score_percent: number;
  attempted_at: string;
  total_score?: number;
  readiness_score?: number;
  foundational_score?: number | null;
  industrial_score?: number | null;
  status?: string;
}

interface Props {
  student: {
    id: number;
    name: string;
    email: string;
    registration_number: string;
  };
  assessments: AssessmentResult[];
  topicScores: TopicScore[];
}

// Helper function to clear cookie
function clearCookie(name: string): void {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// Helper function to get cookie by name
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// Function to check if user is from dean dashboard
function isDeanView(): boolean {
  try {
    const deanSessionCookie = getCookie("deanSession");
    const selectedStudentCookie = getCookie("selectedStudent");
    return !!(deanSessionCookie && selectedStudentCookie);
  } catch (error) {
    console.error("Error checking dean view:", error);
    return false;
  }
}

const AssessmentResult: React.FC<Props> = ({
  student,
  assessments,
  topicScores,
}) => {
  const latestAssessment =
    assessments.length > 0
      ? assessments.reduce((latest, current) =>
          new Date(current.attempted_at) > new Date(latest.attempted_at)
            ? current
            : latest
        )
      : null;

  const readiness = latestAssessment?.readiness_score || 0;
  // const totalScore = latestAssessment?.total_score || 0;
  const foundationalScore = latestAssessment?.foundational_score;
  const industrialScore = latestAssessment?.industrial_score;

  const uniqueTopicsMap = new Map();
  topicScores.forEach((t) => {
    if (!uniqueTopicsMap.has(t.topic_name)) {
      uniqueTopicsMap.set(t.topic_name, t);
    }
  });
  const uniqueTopics = Array.from(uniqueTopicsMap.values());
  const radarLabels = uniqueTopics.map((t) => t.topic_name);
  const radarData = uniqueTopics.map((t) => Number(t.normalized_score || 0));

  const strengths = topicScores
    .filter(
      (topic) =>
        topic.classification === "Strength" ||
        Number(topic.normalized_score || 0) >= 80
    )
    .map((topic) => topic.topic_name);

  const gaps = topicScores
    .filter(
      (topic) =>
        topic.classification === "Gap" ||
        Number(topic.normalized_score || 0) < 60
    )
    .map((topic) => topic.topic_name);

  useEffect(() => {
    if (topicScores.length === 0) return;

    const canvas = document.getElementById("radarChart") as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: "radar",
      data: {
        labels: radarLabels,
        datasets: [
          {
            label: "Skill Level (%)",
            data: radarData,
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "rgba(99, 102, 241, 1)",
            pointBackgroundColor: "rgba(99, 102, 241, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(99, 102, 241, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            grid: { color: "#ddd" },
            pointLabels: {
              font: { size: 12 },
              color: "#374151",
            },
            ticks: {
              color: "#6b7280",
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.parsed.r.toFixed(1)}%`;
              },
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [radarLabels, radarData]);

  const placementStatus =
    readiness >= 80
      ? "Ready"
      : readiness >= 60
      ? "Almost Ready"
      : "Needs Improvement";

  const getStatusColor = () => {
    if (readiness >= 80) return "bg-green-100 text-green-800";
    if (readiness >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Strength":
        return "bg-green-100 text-green-800 border-green-200";
      case "Gap":
        return "bg-red-100 text-red-800 border-red-200";
      case "Optional":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleLogout = () => {
    const isDean = isDeanView();

    if (isDean) {
      // Clear selected student cookie but keep dean session
      clearCookie("selectedStudent");
      window.location.href = "/dean-dashboard";
    } else {
      // Clear student session cookie
      clearCookie("studentSession");
      window.location.href = "/Login";
    }
  };

  if (!latestAssessment) {
    return (
      <div className="max-w-5xl mx-auto p-6 sm:p-10">
        <div className="text-center">
          <h1 className="text-xl md:text-4xl font-bold text-indigo-700 mb-4">
            🚀 Skill Assessment Report
          </h1>
          <p className="text-gray-500">
            No assessment data available for this student.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10 space-y-10">
      {/* Logout/Back Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        {isDeanView() ? "Back to Dashboard" : "Logout"}
      </button>

      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-lg md:text-4xl font-bold text-indigo-700 mb-2">
          🚀 Skill Assessment Report
        </h1>
        <p className="text-sm text-gray-500">
          Generated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Student Profile */}
      <div className="grid sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
        <div className="space-y-2">
          <p className="text-lg">
            <strong className="text-gray-700 text-xs md:text-lg">Name:</strong>{" "}
            <span className="text-gray-900 text-xs md:text-lg">{student.name}</span>
          </p>
          <p className="text-lg">
            <strong className="text-gray-700 text-xs md:text-lg">Email:</strong>{" "}
            <span className="text-gray-900 text-xs md:text-lg">{student.email}</span>
          </p>
          <p className="text-lg">
            <strong className="text-gray-700 text-xs md:text-lg">Registration No:</strong>{" "}
            <span className="text-gray-900 text-xs md:text-lg">{student.registration_number}</span>
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-lg text-indigo-700 font-semibold mb-2">
            🎯 Industry Readiness
          </p>
          <p className="text-5xl font-bold text-indigo-600 mb-2">
            {readiness.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">
            Assessment Date:{" "}
            {new Date(latestAssessment.attempted_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Assessment Summary - Updated to include section scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-700">Basic Score</h3>
          <p
            className={`text-2xl font-bold ${getScoreColor(
              latestAssessment.score_percent
            )}`}
          >
            {latestAssessment.score}/{latestAssessment.total_questions}
          </p>
          <p className="text-sm text-gray-600">
            {latestAssessment?.score_percent != null &&
            !isNaN(Number(latestAssessment.score_percent))
              ? `(${Number(latestAssessment.score_percent).toFixed(1)}%)`
              : "(N/A)"}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-700">
            Readiness Score
          </h3>
          <p className={`text-2xl font-bold ${getScoreColor(readiness)}`}>
            {readiness.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Industry Ready</p>
        </div>

        {/* Foundational Score */}
        {foundationalScore !== null && foundationalScore !== undefined && (
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <h3 className="text-xs md:text-lg font-semibold text-orange-700">
              Foundational
            </h3>
            <p
              className={`text-2xl font-bold ${getScoreColor(
                foundationalScore
              )}`}
            >
              {foundationalScore.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Core Skills</p>
          </div>
        )}

        {/* Industrial Score */}
        {industrialScore !== null && industrialScore !== undefined && (
          <div className="bg-cyan-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-cyan-700">Industrial</h3>
            <p
              className={`text-2xl font-bold ${getScoreColor(industrialScore)}`}
            >
              {industrialScore.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Industry Skills</p>
          </div>
        )}
      </div>

      {/* Section Analysis - New section */}
      {(foundationalScore !== null || industrialScore !== null) && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📋 Section-wise Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {foundationalScore !== null && foundationalScore !== undefined && (
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-bold text-orange-700 mb-3 flex items-center">
                  <span className="mr-2">🏗️</span> Foundational Skills
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-800 font-medium">Score:</span>
                    <span
                      className={`text-2xl font-bold ${getScoreColor(
                        foundationalScore
                      )}`}
                    >
                      {foundationalScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        foundationalScore >= 80
                          ? "bg-green-500"
                          : foundationalScore >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(foundationalScore, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-orange-700">
                    {foundationalScore >= 80
                      ? "Excellent foundation! You have strong core skills."
                      : foundationalScore >= 60
                      ? "Good foundation with room for improvement."
                      : "Focus on strengthening your foundational knowledge."}
                  </p>
                </div>
              </div>
            )}

            {industrialScore !== null && industrialScore !== undefined && (
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <h3 className="text-lg font-bold text-cyan-700 mb-3 flex items-center">
                  <span className="mr-2">🏭</span> Industrial Skills
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-800 font-medium">Score:</span>
                    <span
                      className={`text-2xl font-bold ${getScoreColor(
                        industrialScore
                      )}`}
                    >
                      {industrialScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-cyan-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        industrialScore >= 80
                          ? "bg-green-500"
                          : industrialScore >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(industrialScore, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-cyan-700">
                    {industrialScore >= 80
                      ? "Outstanding industry readiness! You're well-prepared for the workforce."
                      : industrialScore >= 60
                      ? "Good industry skills with some areas to develop."
                      : "Focus on building practical industry-relevant skills."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Radar Chart */}
      {topicScores.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📌 Skill Radar Overview
          </h2>
          <div className="relative h-80">
            <canvas id="radarChart"></canvas>
          </div>
        </div>
      )}

      {/* Topic-wise Breakdown with Progress Bars */}
      {topicScores.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📊 Topic-wise Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicScores.map((topic, i) => {
              const normalizedScore = Number(topic.normalized_score || 0);
              const weightedScore = Number(topic.weighted_score || 0);

              return (
                <div
                  key={`${topic.topic_id}-${i}`}
                  className="bg-gray-50 p-4 rounded-lg border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-700 flex-1">
                      {topic.topic_name}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getClassificationColor(
                        topic.classification
                      )}`}
                    >
                      {topic.classification}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Correct:</span>
                      <span className="font-medium">
                        {topic.correct_answers}/{topic.total_questions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weighted Score:</span>
                      <span
                        className={`font-medium ${getScoreColor(
                          weightedScore
                        )}`}
                      >
                        {weightedScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Normalized:</span>
                      <span
                        className={`font-medium ${getScoreColor(
                          normalizedScore
                        )}`}
                      >
                        {normalizedScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{normalizedScore.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                          normalizedScore >= 80
                            ? "bg-green-500"
                            : normalizedScore >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(normalizedScore, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths and Gaps */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
          <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
            <span className="mr-2">✅</span> Strengths
          </h3>
          <div className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((strength, i) => (
                <div
                  key={i}
                  className="flex items-center p-2 bg-white rounded-lg"
                >
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-green-800 text-sm">{strength}</span>
                </div>
              ))
            ) : (
              <p className="text-green-700 text-sm italic">
                Keep working to build your strengths!
              </p>
            )}
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-200">
          <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center">
            <span className="mr-2">🚧</span> Areas to Improve
          </h3>
          <div className="space-y-2">
            {gaps.length > 0 ? (
              gaps.map((gap, i) => (
                <div
                  key={i}
                  className="flex items-center p-2 bg-white rounded-lg"
                >
                  <span className="text-red-600 mr-2">•</span>
                  <span className="text-red-800 text-sm">{gap}</span>
                </div>
              ))
            ) : (
              <p className="text-red-700 text-sm italic">
                No major gaps identified. Great job!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
        <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
          <span className="mr-2">📈</span> Personalized Recommendations
        </h3>
        <div className="space-y-3">
          {topicScores
            .filter(topic => topic.classification === "Gap" || (topic.normalized_score && topic.normalized_score < 60))
            .length > 0 ? (
            topicScores
              .filter(topic => topic.classification === "Gap" || (topic.normalized_score && topic.normalized_score < 60))
              .map((topic, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg border-l-4 border-blue-400"
                >
                  <div className="font-medium text-blue-900 mb-1">{topic.topic_name}</div>
                  <div className="text-blue-700 text-sm">
                    {topic.recommendation || `Focus on improving your ${topic.topic_name} skills through practice and additional study.`}
                  </div>
                </div>
              ))
          ) : (
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
              <div className="font-medium text-green-900 mb-1">
                Excellent Performance!
              </div>
              <div className="text-green-700 text-sm">
                You're performing well across all areas. Consider taking on
                advanced capstone projects and contributing to open-source AI
                projects to further enhance your skills.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assessment History - Updated to show section scores */}
      {assessments.length > 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            📅 Assessment History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Total Score</th>
                  <th className="text-left p-2">Readiness</th>
                  <th className="text-left p-2">Foundational</th>
                  <th className="text-left p-2">Industrial</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b">
                    <td className="p-2">
                      {new Date(assessment.attempted_at).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {assessment.score_percent != null &&
                      !isNaN(Number(assessment.score_percent)) ? (
                        <span
                          className={getScoreColor(
                            Number(assessment.score_percent)
                          )}
                        >
                          {assessment.score}/{assessment.total_questions} (
                          {Number(assessment.score_percent).toFixed(1)}%)
                        </span>
                      ) : (
                        <span>
                          {assessment.score}/{assessment.total_questions} (N/A)
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {assessment.total_score != null &&
                      !isNaN(Number(assessment.total_score)) ? (
                        <span
                          className={getScoreColor(
                            Number(assessment.total_score)
                          )}
                        >
                          {Number(assessment.total_score).toFixed(1)}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-2">
                      {assessment.readiness_score ? (
                        <span
                          className={getScoreColor(assessment.readiness_score)}
                        >
                          {assessment.readiness_score.toFixed(1)}%
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-2">
                      {assessment.foundational_score !== null &&
                      assessment.foundational_score !== undefined ? (
                        <span
                          className={getScoreColor(
                            assessment.foundational_score
                          )}
                        >
                          {assessment.foundational_score.toFixed(1)}%
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-2">
                      {assessment.industrial_score !== null &&
                      assessment.industrial_score !== undefined ? (
                        <span
                          className={getScoreColor(assessment.industrial_score)}
                        >
                          {assessment.industrial_score.toFixed(1)}%
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          assessment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : assessment.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {assessment.status || "completed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Final Status */}
      <div className="text-center">
        <div
          className={`inline-flex items-center px-8 py-4 rounded-full text-xs md:text-lg font-semibold shadow-lg ${getStatusColor()}`}
        >
          <span className="mr-2">🎖️</span>
          <span>Placement Status: {placementStatus}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Based on your performance across all assessment areas
        </p>
      </div>
    </div>
  );
};

export default AssessmentResult;