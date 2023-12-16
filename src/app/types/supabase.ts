export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      advice: {
        Row: {
          actioned: boolean
          created_at: string
          id: string
          portfolio_id: string | null
          status: string
          transactions: Json[] | null
          type: string
          url: string | null
          user_id: string | null
        }
        Insert: {
          actioned?: boolean
          created_at?: string | null
          id?: string
          portfolio_id?: string | null
          status?: string
          transactions?: Json[] | null
          type?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          actioned?: boolean
          created_at?: string | null
          id?: string
          portfolio_id?: string | null
          status?: string
          transactions?: Json[] | null
          type?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advice_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advice_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      holdings: {
        Row: {
          cost: number | null
          created_at: string
          id: string
          locked: boolean | null
          portfolio_id: string
          symbol: string
          units: number
        }
        Insert: {
          cost?: number | null
          created_at?: string
          id?: string
          locked?: boolean | null
          portfolio_id: string
          symbol: string
          units: number
        }
        Update: {
          cost?: number | null
          created_at?: string
          id?: string
          locked?: boolean | null
          portfolio_id?: string
          symbol?: string
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          }
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          flat_brokerage: number
          id: string
          item_access_token: string | null
          name: string
          objective: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          flat_brokerage?: number
          id?: string
          item_access_token?: string | null
          name?: string
          objective?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          flat_brokerage?: number
          id?: string
          item_access_token?: string | null
          name?: string
          objective?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          assets: number | null
          borrowing: boolean | null
          country: string | null
          created_at: string | null
          DOB: string | null
          employment: string | null
          experience: number | null
          id: string
          international: number | null
          passive: number | null
          preferences: Json | null
          risk_tolerance_q1: number | null
          risk_tolerance_q2: number | null
          risk_tolerance_q3: number | null
          risk_tolerance_q4: number | null
          salary: number | null
          user_id: string
        }
        Insert: {
          assets?: number | null
          borrowing?: boolean | null
          country?: string | null
          created_at?: string | null
          DOB?: string | null
          employment?: string | null
          experience?: number | null
          id?: string
          international?: number | null
          passive?: number | null
          preferences?: Json | null
          risk_tolerance_q1?: number | null
          risk_tolerance_q2?: number | null
          risk_tolerance_q3?: number | null
          risk_tolerance_q4?: number | null
          salary?: number | null
          user_id: string
        }
        Update: {
          assets?: number | null
          borrowing?: boolean | null
          country?: string | null
          created_at?: string | null
          DOB?: string | null
          employment?: string | null
          experience?: number | null
          id?: string
          international?: number | null
          passive?: number | null
          preferences?: Json | null
          risk_tolerance_q1?: number | null
          risk_tolerance_q2?: number | null
          risk_tolerance_q3?: number | null
          risk_tolerance_q4?: number | null
          salary?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      universe: {
        Row: {
          active: boolean | null
          beta: number | null
          description: string | null
          div_yield: number | null
          domestic: boolean | null
          id: number
          last_price: number | null
          last_updated: string | null
          link_to_equity_research: string | null
          market_cap: number | null
          name: string | null
          sector: string | null
          symbol: string | null
          tags: string[] | null
          target_price: number | null
        }
        Insert: {
          active?: boolean | null
          beta?: number | null
          description?: string | null
          div_yield?: number | null
          domestic?: boolean | null
          id?: number
          last_price?: number | null
          last_updated?: string | null
          link_to_equity_research?: string | null
          market_cap?: number | null
          name?: string | null
          sector?: string | null
          symbol?: string | null
          tags?: string[] | null
          target_price?: number | null
        }
        Update: {
          active?: boolean | null
          beta?: number | null
          description?: string | null
          div_yield?: number | null
          domestic?: boolean | null
          id?: number
          last_price?: number | null
          last_updated?: string | null
          link_to_equity_research?: string | null
          market_cap?: number | null
          name?: string | null
          sector?: string | null
          symbol?: string | null
          tags?: string[] | null
          target_price?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          notifications: Json[] | null
          profile: string | null
          watchlist: string[] | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          notifications?: Json[] | null
          profile?: string | null
          watchlist?: string[] | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          notifications?: Json[] | null
          profile?: string | null
          watchlist?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_profile_fkey"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      toggle_locked: {
        Args: {
          holding_id: string
        }
        Returns: undefined
      }
      toggle_symbol_in_watchlist: {
        Args: {
          user_id: string
          symbol: string
        }
        Returns: unknown
      }
    }
    Enums: {
      status:
        | "pending"
        | "generating"
        | "finished"
        | "viewed"
        | "actioned"
        | "dismissed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
