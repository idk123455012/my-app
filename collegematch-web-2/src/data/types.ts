export type InstitutionType = 'Public' | 'Private' | 'Private (Religious)' | 'For-Profit';
export type CollegeCategory = 'Safety' | 'Match' | 'Reach' | 'Highly Competitive';

export interface ScoreRange {
  low: number;
  high: number;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  websiteURL: string;
  description: string;
  institutionType: InstitutionType;
  city: string;
  state: string;
  admissions: {
    acceptanceRate: number; // 0-1
    satRange: ScoreRange;
    actRange: ScoreRange;
    averageGPA: number;
  };
  financials: {
    tuitionInState: number;
    tuitionOutOfState: number;
    roomAndBoard: number;
    averageNetPrice: number;
  };
  academics: {
    graduationRate: number;
    studentFacultyRatio: number;
    popularMajors: string[];
  };
  studentLife: {
    undergradEnrollment: number;
  };
  rankings: {
    usNewsNational?: number;
  };
}

export interface StudentProfile {
  academic: {
    unweightedGPA: number;
    weightedGPA: number;
    satScore: number;
    actScore: number;
    hasSAT: boolean;
    hasACT: boolean;
    apCoursesCount: number;
    intendedMajor: string;
  };
  personal: {
    fullName: string;
    homeState: string;
    isFirstGeneration: boolean;
    hasLegacyStatus: boolean;
  };
  activities: {
    extracurriculars: string[];
    volunteerHours: number;
    activityStrengthScore: number;
  };
}

export function emptyProfile(): StudentProfile {
  return {
    academic: {
      unweightedGPA: 0, weightedGPA: 0, satScore: 0, actScore: 0,
      hasSAT: false, hasACT: false, apCoursesCount: 0, intendedMajor: '',
    },
    personal: { fullName: '', homeState: '', isFirstGeneration: false, hasLegacyStatus: false },
    activities: { extracurriculars: [], volunteerHours: 0, activityStrengthScore: 0 },
  };
}

export interface CategorizedCollege {
  college: College;
  category: CollegeCategory;
  matchScore: number;
}
