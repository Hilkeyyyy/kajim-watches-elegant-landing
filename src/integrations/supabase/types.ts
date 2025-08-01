export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          altitude_resistance: string | null
          amplitude: string | null
          anti_magnetic: string | null
          badges: string[] | null
          beat_error: string | null
          bezel_type: string | null
          bracelet_type: string | null
          brand: string
          buckle_type: string | null
          calendar_type: string | null
          case_back: string | null
          case_size: string | null
          certification: string | null
          chronograph_type: string | null
          clasp_type: string | null
          collection: string | null
          complications: string[] | null
          country_origin: string | null
          created_at: string
          crown_type: string | null
          custom_tags: string[] | null
          date_display: string | null
          description: string | null
          dial_color: string | null
          features: string[] | null
          frequency: string | null
          glass_type: string | null
          hands_type: string | null
          id: string
          image_url: string | null
          images: string[] | null
          is_featured: boolean | null
          is_visible: boolean | null
          jewels: string | null
          limited_edition: string | null
          lug_width: string | null
          lume_type: string | null
          luminosity: string | null
          markers_type: string | null
          material: string | null
          model: string | null
          movement: string | null
          name: string
          operating_temperature: string | null
          power_reserve: string | null
          pressure_resistance: string | null
          price: number
          production_year: string | null
          pushers: string | null
          reference_number: string | null
          shock_resistance: string | null
          sort_order: number | null
          special_features: string[] | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number | null
          stock_status: string | null
          strap_material: string | null
          subdials: string | null
          thickness: string | null
          timezone_display: string | null
          updated_at: string
          vibration_resistance: string | null
          warranty: string | null
          watch_type: string | null
          water_resistance: string | null
          weight: string | null
        }
        Insert: {
          altitude_resistance?: string | null
          amplitude?: string | null
          anti_magnetic?: string | null
          badges?: string[] | null
          beat_error?: string | null
          bezel_type?: string | null
          bracelet_type?: string | null
          brand: string
          buckle_type?: string | null
          calendar_type?: string | null
          case_back?: string | null
          case_size?: string | null
          certification?: string | null
          chronograph_type?: string | null
          clasp_type?: string | null
          collection?: string | null
          complications?: string[] | null
          country_origin?: string | null
          created_at?: string
          crown_type?: string | null
          custom_tags?: string[] | null
          date_display?: string | null
          description?: string | null
          dial_color?: string | null
          features?: string[] | null
          frequency?: string | null
          glass_type?: string | null
          hands_type?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          jewels?: string | null
          limited_edition?: string | null
          lug_width?: string | null
          lume_type?: string | null
          luminosity?: string | null
          markers_type?: string | null
          material?: string | null
          model?: string | null
          movement?: string | null
          name: string
          operating_temperature?: string | null
          power_reserve?: string | null
          pressure_resistance?: string | null
          price: number
          production_year?: string | null
          pushers?: string | null
          reference_number?: string | null
          shock_resistance?: string | null
          sort_order?: number | null
          special_features?: string[] | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          stock_status?: string | null
          strap_material?: string | null
          subdials?: string | null
          thickness?: string | null
          timezone_display?: string | null
          updated_at?: string
          vibration_resistance?: string | null
          warranty?: string | null
          watch_type?: string | null
          water_resistance?: string | null
          weight?: string | null
        }
        Update: {
          altitude_resistance?: string | null
          amplitude?: string | null
          anti_magnetic?: string | null
          badges?: string[] | null
          beat_error?: string | null
          bezel_type?: string | null
          bracelet_type?: string | null
          brand?: string
          buckle_type?: string | null
          calendar_type?: string | null
          case_back?: string | null
          case_size?: string | null
          certification?: string | null
          chronograph_type?: string | null
          clasp_type?: string | null
          collection?: string | null
          complications?: string[] | null
          country_origin?: string | null
          created_at?: string
          crown_type?: string | null
          custom_tags?: string[] | null
          date_display?: string | null
          description?: string | null
          dial_color?: string | null
          features?: string[] | null
          frequency?: string | null
          glass_type?: string | null
          hands_type?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          jewels?: string | null
          limited_edition?: string | null
          lug_width?: string | null
          lume_type?: string | null
          luminosity?: string | null
          markers_type?: string | null
          material?: string | null
          model?: string | null
          movement?: string | null
          name?: string
          operating_temperature?: string | null
          power_reserve?: string | null
          pressure_resistance?: string | null
          price?: number
          production_year?: string | null
          pushers?: string | null
          reference_number?: string | null
          shock_resistance?: string | null
          sort_order?: number | null
          special_features?: string[] | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          stock_status?: string | null
          strap_material?: string | null
          subdials?: string | null
          thickness?: string | null
          timezone_display?: string | null
          updated_at?: string
          vibration_resistance?: string | null
          warranty?: string | null
          watch_type?: string | null
          water_resistance?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      product_status: "active" | "inactive" | "out_of_stock"
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
    Enums: {
      product_status: ["active", "inactive", "out_of_stock"],
    },
  },
} as const
