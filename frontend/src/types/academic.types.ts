export interface PlacementTest {
  testDate: string;
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  overall: number;
}

export interface Certificate {
  type: string;
  issueDate: string;
  score: string;
  certificateUrl: string;
}

export interface AttendanceStats {
  totalSessions: number;
  presentSessions: number;
  absentSessions: number;
  attendancePercentage: number;
}

export interface SubmissionRecord {
  submissionId: number;
  assignmentTitle: string;
  score: number | null;
  maxScore: number;
  teacherComment: string | null;
  status: string | null;
}

export interface FinalResultRecord {
  midtermScore: number | null;
  finalScore: number | null;
  grade: string | null;
  teacherComment: string | null;
}

export interface CourseResultRecord {
  enrollmentId: number;
  courseName: string;
  classCode: string;
  attendance: AttendanceStats;
  assignmentScores: SubmissionRecord[];
  finalResult: FinalResultRecord | null;
}

export interface StudentAcademicResponse {
  placementTests: PlacementTest[];
  certificates: Certificate[];
  courseResults: CourseResultRecord[];
}
