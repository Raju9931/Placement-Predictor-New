
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPredictionHistory } from '@/lib/predictionService';
import { Database } from '@/lib/database.types';
import { toast } from 'sonner';

type PredictionHistoryItem = Database['public']['Tables']['prediction_history']['Row'];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getPredictionHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching prediction history:', error);
        toast.error('Failed to load prediction history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleNewPrediction = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-prediction-primary">Placement Compass</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">Hello, {user?.user_metadata.full_name || user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Dashboard</h2>
          <Button onClick={handleNewPrediction}>New Prediction</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prediction-primary"></div>
          </div>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions yet</h3>
                <p className="text-gray-600 mb-4">
                  Get your first placement prediction by submitting your academic details.
                </p>
                <Button onClick={handleNewPrediction}>Start Prediction</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900">Your Prediction History</h3>
            {history.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-prediction-primary/10 to-prediction-accent/10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      Prediction Result: {item.prediction_data.placementProbability.toFixed(1)}%
                    </CardTitle>
                    <CardDescription>
                      {formatDate(item.created_at)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Top Strengths</h4>
                      <ul className="space-y-1">
                        {item.prediction_data.topPositiveFeatures.map((feature) => (
                          <li key={feature.feature} className="text-sm">
                            <span className="font-medium">{feature.displayName}:</span>{' '}
                            <span className="text-prediction-positive">
                              +{Math.abs(feature.contribution).toFixed(1)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Areas to Improve</h4>
                      <ul className="space-y-1">
                        {item.prediction_data.topNegativeFeatures.map((feature) => (
                          <li key={feature.feature} className="text-sm">
                            <span className="font-medium">{feature.displayName}:</span>{' '}
                            <span className="text-prediction-negative">
                              -{Math.abs(feature.contribution).toFixed(1)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate(`/prediction/${item.id}`)}
                  >
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
