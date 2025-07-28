import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          scan_count: number
          is_paid: boolean
          stripe_customer_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          scan_count?: number
          is_paid?: boolean
          stripe_customer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          scan_count?: number
          is_paid?: boolean
          stripe_customer_id?: string | null
          created_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          user_id: string
          file_url: string
          ocr_text: string
          gpt_feedback: string
          violation: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_url: string
          ocr_text: string
          gpt_feedback: string
          violation: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_url?: string
          ocr_text?: string
          gpt_feedback?: string
          violation?: boolean
          created_at?: string
        }
      }
    }
  }
} 