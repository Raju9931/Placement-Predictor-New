
import { StudentData, PredictionData, FeatureContribution } from './types';
import { supabase } from './supabase';

// This would normally be handled by an actual ML model on a server
export const makePrediction = async (data: StudentData): Promise<PredictionData> => {
  // Calculate a mock placement probability based on the input data
  let placementScore = 0;
  
  // Simple weighted sum of features (in a real app, this would be a proper ML model)
  placementScore += data.gpa * 15;
  placementScore += data.codingSkills * 12;
  placementScore += data.communicationSkills * 10;
  placementScore += data.projectCount * 8;
  placementScore += data.internshipMonths * 10;
  placementScore += data.certifications * 5;
  placementScore -= data.backlogs * 12;
  placementScore += data.extraCurricular * 4;
  placementScore += data.leadershipRoles * 6;
  
  // Normalize to 0-100 range
  const normalizedScore = Math.min(Math.max(placementScore / 1.5, 0), 100);
  
  // Generate feature contributions (simulating SHAP or LIME values)
  const featureContributions: Record<string, FeatureContribution> = {
    gpa: {
      feature: 'gpa',
      contribution: (data.gpa - 7) * 15,
      displayName: 'GPA',
      explanation: data.gpa > 8 ? 'Your strong GPA significantly improves your placement chances' : 
                  data.gpa > 7 ? 'Your GPA is above average, which is favorable' : 
                  'Improving your GPA could boost your placement chances'
    },
    codingSkills: {
      feature: 'codingSkills',
      contribution: (data.codingSkills - 5) * 12,
      displayName: 'Coding Skills',
      explanation: data.codingSkills > 8 ? 'Your excellent coding skills are a major advantage' : 
                  data.codingSkills > 6 ? 'Your coding skills are valuable for technical roles' : 
                  'Consider enhancing your coding skills through practice'
    },
    communicationSkills: {
      feature: 'communicationSkills',
      contribution: (data.communicationSkills - 5) * 10,
      displayName: 'Communication Skills',
      explanation: data.communicationSkills > 7 ? 'Your strong communication skills are highly valued by employers' : 
                  'Improving your communication skills would make you more appealing to employers'
    },
    projectCount: {
      feature: 'projectCount',
      contribution: (data.projectCount - 2) * 8,
      displayName: 'Projects',
      explanation: data.projectCount > 3 ? 'Your portfolio of projects demonstrates practical experience' : 
                  'Consider working on more projects to showcase your skills'
    },
    internshipMonths: {
      feature: 'internshipMonths',
      contribution: (data.internshipMonths - 2) * 10,
      displayName: 'Internship Experience',
      explanation: data.internshipMonths > 4 ? 'Your internship experience is a significant advantage' : 
                  data.internshipMonths > 0 ? 'Your internship experience provides valuable workplace exposure' : 
                  'Seeking internship opportunities would significantly improve your profile'
    },
    certifications: {
      feature: 'certifications',
      contribution: (data.certifications - 1) * 5,
      displayName: 'Certifications',
      explanation: data.certifications > 2 ? 'Your certifications demonstrate specialized knowledge' : 
                  'Obtaining relevant certifications could strengthen your profile'
    },
    backlogs: {
      feature: 'backlogs',
      contribution: -data.backlogs * 12,
      displayName: 'Academic Backlogs',
      explanation: data.backlogs > 0 ? 'Academic backlogs negatively impact your placement chances' : 
                  'Having no backlogs is favorable for your profile'
    },
    extraCurricular: {
      feature: 'extraCurricular',
      contribution: (data.extraCurricular - 2) * 4,
      displayName: 'Extra-curricular Activities',
      explanation: data.extraCurricular > 3 ? 'Your involvement in extra-curricular activities shows well-roundedness' : 
                  'Participating in more extra-curricular activities could enhance your profile'
    },
    leadershipRoles: {
      feature: 'leadershipRoles',
      contribution: (data.leadershipRoles - 1) * 6,
      displayName: 'Leadership Experience',
      explanation: data.leadershipRoles > 1 ? 'Your leadership experience is valued by employers' : 
                  'Taking on leadership roles would strengthen your profile'
    }
  };
  
  // Sort features by contribution
  const sortedFeatures = Object.values(featureContributions).sort(
    (a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)
  );
  
  // Get top positive and negative features
  const positiveFeatures = sortedFeatures
    .filter(f => f.contribution > 0)
    .slice(0, 3);
    
  const negativeFeatures = sortedFeatures
    .filter(f => f.contribution < 0)
    .slice(0, 3);
  
  // Generate overall explanation
  let overallExplanation = '';
  if (normalizedScore >= 80) {
    overallExplanation = `Your profile shows strong potential for placement with a ${normalizedScore.toFixed(1)}% chance. Your ${positiveFeatures[0]?.displayName.toLowerCase()} particularly stands out as a strength.`;
  } else if (normalizedScore >= 60) {
    overallExplanation = `You have a moderate chance of placement at ${normalizedScore.toFixed(1)}%. While your ${positiveFeatures[0]?.displayName.toLowerCase()} is a strength, improving on ${negativeFeatures[0]?.displayName.toLowerCase()} would further enhance your chances.`;
  } else {
    overallExplanation = `Your current placement probability is ${normalizedScore.toFixed(1)}%. Focus on improving ${negativeFeatures[0]?.displayName.toLowerCase()} and ${negativeFeatures[1]?.displayName.toLowerCase()} to significantly boost your chances.`;
  }
  
  // Generate recommended actions based on the lowest-scoring factors
  const recommendedActions = negativeFeatures.map(feature => {
    switch (feature.feature) {
      case 'gpa':
        return 'Focus on improving your academic performance and consider additional study groups or tutoring.';
      case 'codingSkills':
        return 'Enhance your coding skills through online courses, coding challenges, or bootcamps.';
      case 'communicationSkills':
        return 'Practice your communication skills through presentations, group discussions, or joining a public speaking club.';
      case 'projectCount':
        return 'Work on more practical projects to demonstrate your skills and problem-solving abilities.';
      case 'internshipMonths':
        return 'Seek internship opportunities to gain practical industry experience.';
      case 'certifications':
        return 'Obtain relevant certifications in your field to validate your skills.';
      case 'backlogs':
        return 'Clear your academic backlogs as they significantly impact your placement chances.';
      case 'extraCurricular':
        return 'Participate in more extra-curricular activities to showcase your well-roundedness.';
      case 'leadershipRoles':
        return 'Seek leadership roles in student organizations or project teams to demonstrate your leadership abilities.';
      default:
        return `Improve your ${feature.displayName.toLowerCase()} to boost your placement chances.`;
    }
  });
  
  const predictionResult = {
    placementProbability: normalizedScore,
    confidenceScore: 85, // In a real model, this would be the model's confidence
    topPositiveFeatures: positiveFeatures,
    topNegativeFeatures: negativeFeatures,
    overallExplanation,
    recommendedActions
  };

  return predictionResult;
};

// Save prediction to database
export const savePrediction = async (studentData: StudentData, predictionData: PredictionData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('prediction_history')
    .insert({
      user_id: user.id,
      student_data: studentData,
      prediction_data: predictionData
    })
    .select();
    
  if (error) {
    throw error;
  }
    
  return data;
};

// Get prediction history for current user
export const getPredictionHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('prediction_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
    
  return data;
};
