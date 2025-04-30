
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          user_id?: string
        }
      }
      prediction_history: {
        Row: {
          id: string
          created_at: string
          user_id: string
          student_data: StudentData
          prediction_data: PredictionData
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          student_data: StudentData
          prediction_data: PredictionData
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          student_data?: StudentData
          prediction_data?: PredictionData
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}

import { StudentData, PredictionData } from './types'
