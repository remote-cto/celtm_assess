"use client";

import React, { useEffect, useState } from "react";
import AssessmentResult from "../components/AssessmentResult";

// Define the full type for TopicScore as expected by AssessmentResult
interface TopicScore {
  topic_id: number;
  topic_name: string;
  correct_answers: number;
  total_questions: number;
  weighted_score: number;
  normalized_score: number;
  classification: string;
}

// Define AssessmentResult type
interface AssessmentResultType {
  id: number;
  score: number;
  total_questions: number;
  score_percent: number;
  attempted_at: string;
  total_score?: number;
  readiness_score?: number;
}

// Define Student type
interface Student {
  id: number;
  name: string;
  registration_number: string;
  email: string;
  assessments?: AssessmentResultType[];
  topicScores?: TopicScore[];
}

const DeanAssessmentReport = () => {
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem('selectedStudentData');
    if (data) {
      const parsedData = JSON.parse(data);

      // Optional: Validate or sanitize topicScores if needed
      const fullTopicScores: TopicScore[] = (parsedData.topicScores || []).map((ts: any) => ({
        topic_id: ts.topic_id ?? 0,
        topic_name: ts.topic_name ?? "",
        correct_answers: ts.correct_answers ?? 0,
        total_questions: ts.total_questions ?? 0,
        weighted_score: ts.weighted_score ?? 0,
        normalized_score: ts.normalized_score ?? 0,
        classification: ts.classification ?? "Unknown",
      }));

      setStudentData({
        ...parsedData,
        topicScores: fullTopicScores,
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!studentData) {
    return (
      <div className="text-center p-8">
        <p>No student data found.</p>
        <button
          onClick={() => window.location.href = '/dean-dashboard'}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <AssessmentResult
      student={studentData}
      assessments={studentData.assessments || []}
      topicScores={studentData.topicScores || []}
    />
  );
};

export default DeanAssessmentReport;
