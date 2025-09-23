
"use client";

import React, { useEffect, useState } from "react";
import { X, LogOut } from "lucide-react";
import AssessmentResult from "../components/AssessmentResult";

interface Student {
  id: number;
  name: string;
  registration_number: string;
  email: string;
  assessments?: {
    id: number;
    readiness_score?: number;
    foundational_assessment?: number;
    industrial_assessment?: number;
    attempted_at: string;
    status?: string;
  }[];
  topicScores?: {
    topic_id: number;
    topic_name: string;
    correct_answers: number;
    total_questions: number;
    weighted_score: number;
    normalized_score: number;
    classification: string;
  }[];
}

interface Admin {
  id?: number;
  name?: string;
  org_id?: number;
  email?: string;
  org_name?: string;
}

interface College {
  id: number;
  name: string;
}

interface Assignment {
  id: number;
  name: string;
  description?: string;
  key_area_name?: string;
}

interface DetailedStudentData {
  success: boolean;
  student_id: number;
  student: {
    id: number;
    name: string;
    email: string;
    registration_number: string;
  };
  summary: {
    total_assessments: number;
    total_questions: number;
    total_correct: number;
    average_score: number;
    topic_summary: {
      total_topics: number;
      strengths: number;
      partial: number;
      gaps: number;
    };
    section_summary: Record<
      string,
      {
        total_questions: number;
        correct_answers: number;
        topics: string[];
        percentage: number;
      }
    >;
  };
  assessments: {
    id: number;
    assessment_type_id: number;
    assessment_type_name: string;
    readiness_score: number;
    foundational_score: number;
    industrial_score: number;
    attempted_at: string;
    status: string;
  }[];
  topic_scores: {
    topic_id: number;
    topic_name: string;
    section_name: string;
    assessment_type_name: string;
    assessment_type_id: number;
    correct: number;
    total: number;
    weighted_score: number;
    normalized_score: number;
    classification: string;
    recommendation: string;
    attempted_at: string;
  }[];
  question_details: {
    id: number;
    topic_id: number;
    topic_name: string;
    section_name: string;
    question_id: number;
    question: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    correct_answer: string;
    selected_answer: string;
    is_correct: boolean;
    time_taken_seconds: number;
    confidence_level: string;
    reasoning: string;
    feedback: string;
    difficulty_level: string;
    level_weightage: number;
    assessment_type_name: string;
    attempted_at: string;
  }[];
}

// Transform data for AssessmentResult component
interface TransformedAssessmentData {
  student: {
    id: number;
    name: string;
    email: string;
    registration_number: string;
  };
  assessments: {
    id: number;
    score: number;
    total_questions: number;
    score_percent: number;
    attempted_at: string;
    total_score?: number;
    readiness_score?: number;
    foundational_score?: number;
    industrial_score?: number;
    status?: string;
  }[];
  topicScores: {
    topic_id: number;
    topic_name: string;
    correct_answers: number;
    total_questions: number;
    weighted_score: number;
    normalized_score: number;
    classification: string;
    recommendation?: string;
  }[];
}

function getAdminFromCookie(): Admin | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminSession="));
  if (!match) return null;
  try {
    const value = decodeURIComponent(match.split("=")[1]);
    return JSON.parse(value);
  } catch {
    return null;
  }
}

const DeanDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [admin, setAdmin] = useState<Admin>({});
  const [college, setCollege] = useState<College | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<number | string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [detailedStudentData, setDetailedStudentData] =
    useState<DetailedStudentData | null>(null);
  const [transformedData, setTransformedData] =
    useState<TransformedAssessmentData | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const [reportError, setReportError] = useState<string>("");
  const [showStudentsTable, setShowStudentsTable] = useState<boolean>(false);
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(false);

  useEffect(() => {
    const adminInfo = getAdminFromCookie();
    if (!adminInfo || !adminInfo.org_id) {
      setError("Invalid session. Please log in again.");
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/Login";
      }, 1200);
      return;
    }
    setAdmin(adminInfo);

    const fetchInitialData = async () => {
      try {
        setLoadingAssignments(true);
        
        // Fetch college info
        const collegeRes = await fetch(
          `/api/college-info?college_id=${adminInfo.org_id}`
        );
        if (!collegeRes.ok) throw new Error("Failed to fetch college info");
        const collegeData = await collegeRes.json();
        setCollege(collegeData.college);

        // Fetch available assessment types (assignments) from database
        const assignmentsRes = await fetch(
          `/api/assessment-types?org_id=${adminInfo.org_id}`
        );
        
        if (assignmentsRes.ok) {
          const assignmentsData = await assignmentsRes.json();
          console.log("Fetched assignments from DB:", assignmentsData);
          
          if (assignmentsData.success && assignmentsData.assessment_types?.length > 0) {
            setAssignments(assignmentsData.assessment_types);
          } else {
            console.warn("No assessment types found in database");
            setAssignments([]);
          }
        } else {
          const errorText = await assignmentsRes.text();
          console.error("Failed to fetch assignments:", errorText);
          setError("Failed to load assessment types. Please contact support.");
        }
        
      } catch (err) {
        setError("Failed to load initial data. Please try again later.");
        console.error("Error loading dean-dashboard data:", err);
      } finally {
        setLoading(false);
        setLoadingAssignments(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchStudentsForAssignment = async (assignmentId: number | string) => {
    try {
      setLoading(true);
      const studentsRes = await fetch(
        `/api/college-students?college_id=${admin.org_id}&assessment_type_id=${assignmentId}`
      );
      if (!studentsRes.ok) throw new Error("Failed to fetch students");
      const studentsData = await studentsRes.json();
      
      console.log("Students data:", studentsData);
      setStudents(studentsData.students || []);
      setShowStudentsTable(true);
    } catch (err) {
      setError("Failed to load students data. Please try again later.");
      console.error("Error loading students data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (assignmentId: string) => {
    const numericId = assignmentId ? parseInt(assignmentId) : "";
    setSelectedAssignment(numericId);
    
    if (numericId) {
      fetchStudentsForAssignment(numericId);
    } else {
      setShowStudentsTable(false);
      setStudents([]);
    }
  };

  const transformDataForAssessmentResult = (
    data: DetailedStudentData
  ): TransformedAssessmentData => {
    return {
      student: data.student,
      assessments: data.assessments.map((assessment) => ({
        id: assessment.id,
        score: data.summary.total_correct,
        total_questions: data.summary.total_questions,
        score_percent: data.summary.average_score,
        attempted_at: assessment.attempted_at,
        total_score: data.summary.total_correct,
        readiness_score: assessment.readiness_score,
        foundational_score: assessment.foundational_score,
        industrial_score: assessment.industrial_score,
        status: assessment.status,
      })),
      topicScores: data.topic_scores.map((topic) => ({
        topic_id: topic.topic_id,
        topic_name: topic.topic_name,
        correct_answers: topic.correct,
        total_questions: topic.total,
        weighted_score: topic.weighted_score,
        normalized_score: topic.normalized_score,
        classification: topic.classification,
        recommendation: topic.recommendation,
      })),
    };
  };

  const fetchDetailedReport = async (student: Student) => {
    setLoadingReport(true);
    setReportError("");
    setDetailedStudentData(null);
    setTransformedData(null);

    try {
      console.log("Fetching detailed report for student:", student.id);

      const response = await fetch(
        `/api/student-detailed-report?student_id=${student.id}&assessment_type_id=${selectedAssignment}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(
          `Failed to fetch detailed report: ${response.status} ${response.statusText}`
        );
      }

      const data: DetailedStudentData = await response.json();
      console.log("Received detailed data:", data);

      // Validate the response structure
      if (!data || !data.success) {
        throw new Error("Invalid response format from server");
      }

      if (
        !data.student ||
        !Array.isArray(data.assessments) ||
        !Array.isArray(data.topic_scores)
      ) {
        throw new Error("Missing required data in server response");
      }

      setDetailedStudentData(data);

      // Transform data for AssessmentResult component
      const transformed = transformDataForAssessmentResult(data);
      setTransformedData(transformed);

      console.log("Transformed data for AssessmentResult:", transformed);
    } catch (err) {
      console.error("Error fetching detailed report:", err);
      setReportError(
        `Failed to load detailed report: ${
          err instanceof Error ? err.message : "Unknown error"
        }. Please try again.`
      );
    } finally {
      setLoadingReport(false);
    }
  };

  const handleViewReport = async (student: Student) => {
    console.log("Viewing report for student:", student);
    setSelectedStudent(student);
    setIsPopupOpen(true);
    setDetailedStudentData(null);
    setTransformedData(null);
    setReportError("");

    // Store student data in sessionStorage to indicate dean view
    sessionStorage.setItem("selectedStudentData", JSON.stringify(student));

    await fetchDetailedReport(student);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedStudent(null);
    setDetailedStudentData(null);
    setTransformedData(null);
    setReportError("");
    sessionStorage.removeItem("selectedStudentData");
  };

  const handleLogout = async () => {
    try {
      // Call the server endpoint which handles cookie deletion and redirection.
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Specify the userType so the correct cookie ('adminSession') is cleared.
        body: JSON.stringify({ userType: 'admin' }),
      });

      // The server response will be a redirect. The browser will follow it.
      // If the response has a `redirected` status, we navigate to its URL.
      if (response.redirected) {
        // This forces a full page navigation, clearing any client-side state.
        window.location.href = response.url;
      } else {
        // Fallback in case the redirect doesn't happen for some reason.
        window.location.href = '/Login';
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Force a redirect to the login page even if the API call fails.
      window.location.href = "/Login";
    }
  };

  const formatScore = (score: number | null | undefined): string => {
    if (score === null || score === undefined || isNaN(score)) {
      return "N/A";
    }
    return `${score.toFixed(1)}%`;
  };

  const getScoreClassName = (score: number | null | undefined): string => {
    if (score === null || score === undefined || isNaN(score)) {
      return "bg-gray-100 text-gray-600";
    }

    if (score >= 80) {
      return "bg-green-100 text-green-800";
    } else if (score >= 60) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  const getSelectedAssignmentName = (): string => {
    if (!selectedAssignment) return "";
    const assignment = assignments.find(a => a.id === selectedAssignment);
    return assignment ? assignment.name : "";
  };

  if (loading && !showStudentsTable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !showStudentsTable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600 p-5">
          <div className="text-xl font-semibold mb-4">Error</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            🎓 CELTM - TIF DASHBOARD
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center md:text-left">
              <span className="text-sm uppercase tracking-wide text-blue-700 font-semibold">
                Admin Name
              </span>
              <p className="text-xl font-semibold text-gray-800 mt-1">
                {admin.name ?? "N/A"}
              </p>
            </div>
            <div className="text-center md:text-left">
              <span className="text-sm uppercase tracking-wide text-blue-700 font-semibold">
                College Name
              </span>
              <p className="text-xl font-semibold text-gray-800 mt-1">
                {college ? college.name : "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Assignment Selection */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
              <span className="mr-2">📝</span>
              Select Assessment Type
            </h2>
            <div className="max-w-md">
              <label htmlFor="assignment-select" className="block text-sm font-medium text-gray-700 mb-2">
                Choose an assessment type to view student performance:
              </label>
              
              {loadingAssignments ? (
                <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading assessment types...</span>
                </div>
              ) : (
                <select
                  id="assignment-select"
                  value={selectedAssignment}
                  onChange={(e) => handleAssignmentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  disabled={assignments.length === 0}
                >
                  <option value="">-- Select Assessment Type --</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.name}
                      {assignment.key_area_name && ` (${assignment.key_area_name})`}
                    </option>
                  ))}
                </select>
              )}
              
              {!loadingAssignments && assignments.length === 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ No assessment types found for this organization. Please contact support.
                  </p>
                </div>
              )}
            </div>
            
            {selectedAssignment && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Selected: {getSelectedAssignmentName()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Students Performance Overview - Only show when assignment is selected */}
        {showStudentsTable && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2">📊</span>
                Students Performance Overview
                {selectedAssignment && (
                  <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {getSelectedAssignmentName()}
                  </span>
                )}
              </h2>
              <p className="text-gray-600 mt-1">
                Click "View Report" to see detailed assessment results for each
                student
              </p>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading students data...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg">No students found for this assessment type.</p>
                  <p className="text-sm mt-2">
                    Students will appear here once they complete their
                    assessments for the selected assessment type.
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Registration No.
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Readiness Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Foundation Score
                      </th>
                       <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Industrial Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const readiness =
                        student.assessments && student.assessments.length > 0
                          ? student.assessments[0].readiness_score
                          : null;

                      const foundation =
                        student.assessments && student.assessments.length > 0
                          ? student.assessments[0].foundational_assessment
                          : null;
                          const industry =
                        student.assessments && student.assessments.length > 0
                          ? student.assessments[0].industrial_assessment
                          : null;

                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-gray-50 border-b transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {student.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {student.registration_number}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {student.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreClassName(
                                readiness
                              )}`}
                            >
                              {formatScore(readiness)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreClassName(
                                foundation
                              )}`}
                            >
                              {formatScore(foundation)}
                            </span>
                          </td>
                           <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreClassName(
                                industry
                              )}`}
                            >
                              {formatScore(industry)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewReport(student)}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              📋 View Report
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Popup Modal with Full Assessment Report */}
        {isPopupOpen && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Assessment Report - {selectedStudent.name}
                    </h3>
                    {selectedAssignment && (
                      <p className="text-sm text-gray-600 mt-1">
                        Assessment Type: {getSelectedAssignmentName()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleClosePopup}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {loadingReport && (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Loading Detailed Report
                      </h4>
                      <p className="text-gray-500">
                        Fetching assessment data and generating comprehensive
                        analysis...
                      </p>
                    </div>
                  </div>
                )}

                {reportError && (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                      <div className="text-red-500 text-6xl mb-4">⚠️</div>
                      <h4 className="text-lg font-semibold text-red-700 mb-4">
                        Error Loading Report
                      </h4>
                      <p className="text-red-600 mb-6 text-sm">{reportError}</p>
                      <button
                        onClick={() => fetchDetailedReport(selectedStudent)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors mr-3"
                      >
                        🔄 Try Again
                      </button>
                      <button
                        onClick={handleClosePopup}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {!loadingReport && !reportError && transformedData && (
                  <div className="space-y-6">
                    {/* Assessment Result Component */}
                    <AssessmentResult
                      student={transformedData.student}
                      assessments={transformedData.assessments}
                      topicScores={transformedData.topicScores}
                    />
                  </div>
                )}

                {!loadingReport &&
                  !reportError &&
                  !transformedData &&
                  detailedStudentData && (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                        <div className="text-gray-400 text-6xl mb-4">📊</div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                          No Assessment Data Available
                        </h4>
                        <p className="text-gray-500">
                          This student hasn't completed any assessments yet.
                        </p>
                      </div>
                    </div>
                  )}

                {!loadingReport && !reportError && !detailedStudentData && (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="text-gray-400 text-6xl mb-4">📊</div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Loading Assessment Data
                      </h4>
                      <p className="text-gray-500">
                        Please wait while we fetch the assessment results...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeanDashboard;

