
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PredictionResult from '@/components/PredictionResult';
import { Database } from '@/lib/database.types';
import { toast } from 'sonner';

type PredictionHistoryItem = Database['public']['Tables']['prediction_history']['Row'];

const PredictionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [prediction, setPrediction] = useState<PredictionHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from('prediction_history')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setPrediction(data);
      } catch (error) {
        console.error('Error fetching prediction:', error);
        toast.error('Failed to load prediction details');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prediction-primary"></div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Prediction Not Found</h2>
        <p className="text-gray-600 mb-6">The prediction you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button variant="ghost" asChild className="mr-4 p-2">
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-prediction-primary">Prediction Details</h1>
              <p className="text-sm text-gray-500">
                {new Date(prediction.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <PredictionResult data={prediction.prediction_data} />
      </main>
    </div>
  );
};

export default PredictionDetail;
