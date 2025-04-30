
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isSupabaseConfigured } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prediction-primary"></div>
      </div>
    );
  }
  
  // If Supabase is not configured, show a helpful error message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Missing Supabase Configuration</h2>
          <p className="text-red-700 mb-4">
            This application requires Supabase to be properly configured. 
            Please add your Supabase URL and Anonymous Key to the environment variables.
          </p>
          <div className="bg-gray-50 p-3 rounded text-sm text-left font-mono">
            <p>VITE_SUPABASE_URL=your_supabase_url</p>
            <p>VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
