
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StudentForm from '@/components/StudentForm';
import PredictionResult from '@/components/PredictionResult';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentData, PredictionData } from '@/lib/types';
import { makePrediction, savePrediction } from '@/lib/predictionService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionData | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("input");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmitData = async (data: StudentData) => {
    setLoading(true);
    try {
      // Store student data for later use if user wants to save
      setStudentData(data);
      
      // Get prediction
      const result = await makePrediction(data);
      setPredictionResult(result);
      setActiveTab("results");
      
      // If user is logged in, automatically save the prediction
      if (user) {
        await savePrediction(data, result);
        toast.success('Prediction saved to your account');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrediction = async () => {
    if (!user) {
      toast('Please sign in to save your prediction', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/auth')
        }
      });
      return;
    }

    if (!studentData || !predictionResult) {
      toast.error('No prediction data to save');
      return;
    }

    try {
      setLoading(true);
      await savePrediction(studentData, predictionResult);
      toast.success('Prediction saved successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-prediction-primary">Placement Compass</h1>
          <div className="flex gap-4">
            {user ? (
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
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
                <StudentForm onSubmitData={handleSubmitData} isLoading={loading} />
              </TabsContent>
              <TabsContent value="results" className="p-6">
                {predictionResult && (
                  <>
                    <PredictionResult data={predictionResult} />
                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={handleSavePrediction} 
                        disabled={loading}
                        className="bg-prediction-primary hover:bg-prediction-primary/90"
                      >
                        {loading ? 'Saving...' : user ? 'Save to Dashboard' : 'Sign In to Save'}
                      </Button>
                    </div>
                  </>
                )}
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
