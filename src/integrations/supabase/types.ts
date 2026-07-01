export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          aptitude_score: number
          coding_score: number
          created_at: string
          details: Json | null
          id: string
          technical_score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          aptitude_score?: number
          coding_score?: number
          created_at?: string
          details?: Json | null
          id?: string
          technical_score?: number
          total_questions?: number
          user_id: string
        }
        Update: {
          aptitude_score?: number
          coding_score?: number
          created_at?: string
          details?: Json | null
          id?: string
          technical_score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          ctc: string | null
          description: string | null
          difficulty: string
          id: string
          logo_emoji: string | null
          name: string
          pattern: string | null
          roles: string[]
          topics: string[]
        }
        Insert: {
          created_at?: string
          ctc?: string | null
          description?: string | null
          difficulty?: string
          id?: string
          logo_emoji?: string | null
          name: string
          pattern?: string | null
          roles?: string[]
          topics?: string[]
        }
        Update: {
          created_at?: string
          ctc?: string | null
          description?: string | null
          difficulty?: string
          id?: string
          logo_emoji?: string | null
          name?: string
          pattern?: string | null
          roles?: string[]
          topics?: string[]
        }
        Relationships: []
      }
      prep_plans: {
        Row: {
          created_at: string
          id: string
          plan_markdown: string
          target_company: string
          user_id: string
          weeks: number
        }
        Insert: {
          created_at?: string
          id?: string
          plan_markdown: string
          target_company: string
          user_id: string
          weeks?: number
        }
        Update: {
          created_at?: string
          id?: string
          plan_markdown?: string
          target_company?: string
          user_id?: string
          weeks?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          branch: string | null
          college: string | null
          created_at: string
          full_name: string | null
          id: string
          target_companies: string[] | null
          updated_at: string
          year: string | null
        }
        Insert: {
          branch?: string | null
          college?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          target_companies?: string[] | null
          updated_at?: string
          year?: string | null
        }
        Update: {
          branch?: string | null
          college?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          target_companies?: string[] | null
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      progress_snapshots: {
        Row: {
          aptitude_score: number
          coding_score: number
          communication_score: number
          created_at: string
          id: string
          placement_probability: number
          readiness_score: number
          recommended_companies: string[]
          technical_score: number
          user_id: string
          weak_areas: string[]
        }
        Insert: {
          aptitude_score: number
          coding_score: number
          communication_score: number
          created_at?: string
          id?: string
          placement_probability: number
          readiness_score: number
          recommended_companies?: string[]
          technical_score: number
          user_id: string
          weak_areas?: string[]
        }
        Update: {
          aptitude_score?: number
          coding_score?: number
          communication_score?: number
          created_at?: string
          id?: string
          placement_probability?: number
          readiness_score?: number
          recommended_companies?: string[]
          technical_score?: number
          user_id?: string
          weak_areas?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
