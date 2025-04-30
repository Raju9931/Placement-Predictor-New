
import { useState } from 'react';
import StudentForm from '@/components/StudentForm';
import PredictionResult from '@/components/PredictionResult';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentData, PredictionData } from '@/lib/types';
import { makePrediction } from '@/lib/predictionService';

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("input");

  const handleSubmitData = (data: StudentData) => {
    // In a real app, this would call an API endpoint to get a prediction
    const result = makePrediction(data);
    setPredictionResult(result);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-prediction-primary">Placement Compass</h1>
          <p className="text-gray-500 text-sm">Transparent Placement Predictions</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-prediction-primary to-prediction-accent text-white rounded-t-lg">
            <CardTitle className="text-2xl">Placement Prediction System</CardTitle>
            <CardDescription className="text-white opacity-90">
              Enter your academic and skill details to get insights on your placement chances
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input">Your Information</TabsTrigger>
                <TabsTrigger value="results" disabled={!predictionResult}>Prediction Results</TabsTrigger>
              </TabsList>
              <TabsContent value="input" className="p-6">
                <StudentForm onSubmitData={handleSubmitData} />
              </TabsContent>
              <TabsContent value="results" className="p-6">
                {predictionResult && <PredictionResult data={predictionResult} />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-white mt-12 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>Placement Compass: AI-powered career predictions with explainable results</p>
          <p className="mt-2">© {new Date().getFullYear()} Placement Compass</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
