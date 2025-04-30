
import { PredictionData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { Bar } from 'recharts';
import FeatureImpactChart from '@/components/FeatureImpactChart';

interface PredictionResultProps {
  data: PredictionData;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ data }) => {
  const { 
    placementProbability, 
    confidenceScore, 
    topPositiveFeatures, 
    topNegativeFeatures,
    overallExplanation,
    recommendedActions
  } = data;
  
  const [activeTab, setActiveTab] = useState<'explanation' | 'recommendations'>('explanation');
  
  // Determine progress color based on placement probability
  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-prediction-positive';
    if (score >= 50) return 'bg-prediction-accent';
    return 'bg-prediction-negative';
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Placement Prediction Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Placement Probability</h3>
                  <div className="text-2xl font-bold">{placementProbability.toFixed(1)}%</div>
                </div>
                <div className="text-right space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Confidence Score</h3>
                  <div className="text-lg font-medium">{confidenceScore}%</div>
                </div>
              </div>
              <Progress 
                value={placementProbability} 
                className={`h-2 ${getProgressColor(placementProbability)}`} 
              />
              <p className="mt-4 text-gray-700">{overallExplanation}</p>
            </div>
            
            <div className="mt-4">
              <div className="flex space-x-1 mb-4">
                <button
                  className={`px-4 py-2 flex-1 text-sm font-medium rounded-md ${
                    activeTab === 'explanation' 
                      ? 'bg-prediction-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('explanation')}
                >
                  Detailed Explanation
                </button>
                <button
                  className={`px-4 py-2 flex-1 text-sm font-medium rounded-md ${
                    activeTab === 'recommendations' 
                      ? 'bg-prediction-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('recommendations')}
                >
                  Recommended Actions
                </button>
              </div>
              
              {activeTab === 'explanation' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="flex items-center gap-1 font-medium text-prediction-positive mb-2">
                      <ArrowUp className="w-4 h-4" /> Positive Factors
                    </h3>
                    <ul className="space-y-2">
                      {topPositiveFeatures.map((feature) => (
                        <li key={feature.feature} className="bg-green-50 p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{feature.displayName}</span>
                            <span className="text-prediction-positive">
                              +{Math.abs(feature.contribution).toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{feature.explanation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center gap-1 font-medium text-prediction-negative mb-2">
                      <ArrowDown className="w-4 h-4" /> Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {topNegativeFeatures.map((feature) => (
                        <li key={feature.feature} className="bg-red-50 p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{feature.displayName}</span>
                            <span className="text-prediction-negative">
                              -{Math.abs(feature.contribution).toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{feature.explanation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-prediction-secondary/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Recommended Actions to Improve Your Chances</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {recommendedActions.map((action, index) => (
                      <li key={index} className="text-gray-700">{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-700">Feature Impact</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <FeatureImpactChart 
                positiveFeatures={topPositiveFeatures} 
                negativeFeatures={topNegativeFeatures} 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-700">Placement Likelihood</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="inline-flex rounded-full p-4 bg-prediction-secondary">
                  <div 
                    className={`rounded-full p-12 flex items-center justify-center ${getProgressColor(placementProbability)}`}
                  >
                    <span className="text-4xl font-bold text-white">
                      {Math.round(placementProbability)}%
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">
                  {placementProbability >= 75
                    ? "You have excellent placement prospects!"
                    : placementProbability >= 50
                    ? "You have a moderate chance of placement."
                    : "You may need significant improvements for better placement chances."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
