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
          amplitude_degrees: string | null
          anti_magnetic: string | null
          anti_magnetic_resistance: string | null
          availability_status: string | null
          badges: string[] | null
          beat_error: string | null
          beat_error_ms: string | null
          bezel_color: string | null
          bezel_material: string | null
          bezel_type: string | null
          box_type: string | null
          bracelet_length: string | null
          bracelet_material: string | null
          bracelet_type: string | null
          bracelet_width: string | null
          brand: string
          buckle_type: string | null
          calendar_type: string | null
          caliber: string | null
          case_back: string | null
          case_color: string | null
          case_diameter: string | null
          case_height: string | null
          case_material: string | null
          case_size: string | null
          case_thickness: string | null
          caseback_material: string | null
          certification: string | null
          chronograph_type: string | null
          clasp_material: string | null
          clasp_type: string | null
          clasp_width: string | null
          collection: string | null
          complications: string[] | null
          country_origin: string | null
          created_at: string
          crown_diameter: string | null
          crown_material: string | null
          crown_type: string | null
          crystal: string | null
          crystal_diameter: string | null
          custom_tags: string[] | null
          date_display: string | null
          description: string | null
          dial_color: string | null
          dial_colors: string[] | null
          dial_finish: string | null
          dial_material: string | null
          dial_pattern: string | null
          discontinued_date: string | null
          documentation: string | null
          features: string[] | null
          frequency: string | null
          frequency_hz: string | null
          glass_type: string | null
          hands_color: string | null
          hands_material: string | null
          hands_type: string | null
          id: string
          image_url: string | null
          images: string[] | null
          included_accessories: string[] | null
          indices_material: string | null
          indices_type: string | null
          is_featured: boolean | null
          is_visible: boolean | null
          jewels: string | null
          jewels_count: string | null
          limited_edition: string | null
          logo_position: string | null
          lug_to_lug: string | null
          lug_width: string | null
          lug_width_mm: string | null
          lume_type: string | null
          luminosity: string | null
          markers_color: string | null
          markers_type: string | null
          material: string | null
          model: string | null
          movement: string | null
          msrp: string | null
          name: string
          numerals_type: string | null
          operating_temperature: string | null
          power_reserve: string | null
          pressure_resistance: string | null
          price: number
          production_year: string | null
          pushers: string | null
          reference_number: string | null
          replacement_model: string | null
          shock_resistance: string | null
          shock_resistant: boolean | null
          sort_order: number | null
          special_features: string[] | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number | null
          stock_status: string | null
          strap_color: string | null
          strap_material: string | null
          subdials: string | null
          temperature_resistance: string | null
          thickness: string | null
          timezone_display: string | null
          updated_at: string
          vibration_resistance: string | null
          warranty: string | null
          watch_type: string | null
          water_resistance: string | null
          water_resistance_atm: string | null
          water_resistance_meters: string | null
          weight: string | null
        }
        Insert: {
          altitude_resistance?: string | null
          amplitude?: string | null
          amplitude_degrees?: string | null
          anti_magnetic?: string | null
          anti_magnetic_resistance?: string | null
          availability_status?: string | null
          badges?: string[] | null
          beat_error?: string | null
          beat_error_ms?: string | null
          bezel_color?: string | null
          bezel_material?: string | null
          bezel_type?: string | null
          box_type?: string | null
          bracelet_length?: string | null
          bracelet_material?: string | null
          bracelet_type?: string | null
          bracelet_width?: string | null
          brand: string
          buckle_type?: string | null
          calendar_type?: string | null
          caliber?: string | null
          case_back?: string | null
          case_color?: string | null
          case_diameter?: string | null
          case_height?: string | null
          case_material?: string | null
          case_size?: string | null
          case_thickness?: string | null
          caseback_material?: string | null
          certification?: string | null
          chronograph_type?: string | null
          clasp_material?: string | null
          clasp_type?: string | null
          clasp_width?: string | null
          collection?: string | null
          complications?: string[] | null
          country_origin?: string | null
          created_at?: string
          crown_diameter?: string | null
          crown_material?: string | null
          crown_type?: string | null
          crystal?: string | null
          crystal_diameter?: string | null
          custom_tags?: string[] | null
          date_display?: string | null
          description?: string | null
          dial_color?: string | null
          dial_colors?: string[] | null
          dial_finish?: string | null
          dial_material?: string | null
          dial_pattern?: string | null
          discontinued_date?: string | null
          documentation?: string | null
          features?: string[] | null
          frequency?: string | null
          frequency_hz?: string | null
          glass_type?: string | null
          hands_color?: string | null
          hands_material?: string | null
          hands_type?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          included_accessories?: string[] | null
          indices_material?: string | null
          indices_type?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          jewels?: string | null
          jewels_count?: string | null
          limited_edition?: string | null
          logo_position?: string | null
          lug_to_lug?: string | null
          lug_width?: string | null
          lug_width_mm?: string | null
          lume_type?: string | null
          luminosity?: string | null
          markers_color?: string | null
          markers_type?: string | null
          material?: string | null
          model?: string | null
          movement?: string | null
          msrp?: string | null
          name: string
          numerals_type?: string | null
          operating_temperature?: string | null
          power_reserve?: string | null
          pressure_resistance?: string | null
          price: number
          production_year?: string | null
          pushers?: string | null
          reference_number?: string | null
          replacement_model?: string | null
          shock_resistance?: string | null
          shock_resistant?: boolean | null
          sort_order?: number | null
          special_features?: string[] | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          stock_status?: string | null
          strap_color?: string | null
          strap_material?: string | null
          subdials?: string | null
          temperature_resistance?: string | null
          thickness?: string | null
          timezone_display?: string | null
          updated_at?: string
          vibration_resistance?: string | null
          warranty?: string | null
          watch_type?: string | null
          water_resistance?: string | null
          water_resistance_atm?: string | null
          water_resistance_meters?: string | null
          weight?: string | null
        }
        Update: {
          altitude_resistance?: string | null
          amplitude?: string | null
          amplitude_degrees?: string | null
          anti_magnetic?: string | null
          anti_magnetic_resistance?: string | null
          availability_status?: string | null
          badges?: string[] | null
          beat_error?: string | null
          beat_error_ms?: string | null
          bezel_color?: string | null
          bezel_material?: string | null
          bezel_type?: string | null
          box_type?: string | null
          bracelet_length?: string | null
          bracelet_material?: string | null
          bracelet_type?: string | null
          bracelet_width?: string | null
          brand?: string
          buckle_type?: string | null
          calendar_type?: string | null
          caliber?: string | null
          case_back?: string | null
          case_color?: string | null
          case_diameter?: string | null
          case_height?: string | null
          case_material?: string | null
          case_size?: string | null
          case_thickness?: string | null
          caseback_material?: string | null
          certification?: string | null
          chronograph_type?: string | null
          clasp_material?: string | null
          clasp_type?: string | null
          clasp_width?: string | null
          collection?: string | null
          complications?: string[] | null
          country_origin?: string | null
          created_at?: string
          crown_diameter?: string | null
          crown_material?: string | null
          crown_type?: string | null
          crystal?: string | null
          crystal_diameter?: string | null
          custom_tags?: string[] | null
          date_display?: string | null
          description?: string | null
          dial_color?: string | null
          dial_colors?: string[] | null
          dial_finish?: string | null
          dial_material?: string | null
          dial_pattern?: string | null
          discontinued_date?: string | null
          documentation?: string | null
          features?: string[] | null
          frequency?: string | null
          frequency_hz?: string | null
          glass_type?: string | null
          hands_color?: string | null
          hands_material?: string | null
          hands_type?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          included_accessories?: string[] | null
          indices_material?: string | null
          indices_type?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          jewels?: string | null
          jewels_count?: string | null
          limited_edition?: string | null
          logo_position?: string | null
          lug_to_lug?: string | null
          lug_width?: string | null
          lug_width_mm?: string | null
          lume_type?: string | null
          luminosity?: string | null
          markers_color?: string | null
          markers_type?: string | null
          material?: string | null
          model?: string | null
          movement?: string | null
          msrp?: string | null
          name?: string
          numerals_type?: string | null
          operating_temperature?: string | null
          power_reserve?: string | null
          pressure_resistance?: string | null
          price?: number
          production_year?: string | null
          pushers?: string | null
          reference_number?: string | null
          replacement_model?: string | null
          shock_resistance?: string | null
          shock_resistant?: boolean | null
          sort_order?: number | null
          special_features?: string[] | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          stock_status?: string | null
          strap_color?: string | null
          strap_material?: string | null
          subdials?: string | null
          temperature_resistance?: string | null
          thickness?: string | null
          timezone_display?: string | null
          updated_at?: string
          vibration_resistance?: string | null
          warranty?: string | null
          watch_type?: string | null
          water_resistance?: string | null
          water_resistance_atm?: string | null
          water_resistance_meters?: string | null
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
