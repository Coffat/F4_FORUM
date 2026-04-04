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
  url: string;
}

export interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string; // LocalDate is serialized as string
  avatarUrl: string;
  targetScore: number;
  admissionDate: string;
  placementTests: PlacementTest[];
  certificates: Certificate[];
}
