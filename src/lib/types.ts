
export interface StudentData {
  name: string;
  gpa: number;
  codingSkills: number;
  communicationSkills: number;
  projectCount: number;
  internshipMonths: number;
  certifications: number;
  backlogs: number;
  extraCurricular: number;
  leadershipRoles: number;
}

export interface FeatureContribution {
  feature: string;
  contribution: number;
  displayName: string;
  explanation: string;
}

export interface PredictionData {
  placementProbability: number;
  confidenceScore: number;
  topPositiveFeatures: FeatureContribution[];
  topNegativeFeatures: FeatureContribution[];
  overallExplanation: string;
  recommendedActions: string[];
}
