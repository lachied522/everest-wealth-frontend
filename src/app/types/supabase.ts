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
          created_at?: string
          id?: string
          portfolio_id?: string | null
          status?: string
          transactions?: Json[] | null
          type?: string
          url?: string | null
          user_id?: string | null
        }
        Update: {
          actioned?: boolean
          created_at?: string
          id?: string
          portfolio_id?: string | null
          status?: string
          transactions?: Json[] | null
          type?: string
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
          active: number | null
          created_at: string
          flat_brokerage: number
          id: string
          international: number | null
          item_access_token: string | null
          name: string
          objective: string
          preferences: Json | null
          user_id: string | null
        }
        Insert: {
          active?: number | null
          created_at?: string
          flat_brokerage?: number
          id?: string
          international?: number | null
          item_access_token?: string | null
          name?: string
          objective?: string
          preferences?: Json | null
          user_id?: string | null
        }
        Update: {
          active?: number | null
          created_at?: string
          flat_brokerage?: number
          id?: string
          international?: number | null
          item_access_token?: string | null
          name?: string
          objective?: string
          preferences?: Json | null
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
      snapshots: {
        Row: {
          date: string
          portfolio_id: string
          value: number
        }
        Insert: {
          date: string
          portfolio_id: string
          value: number
        }
        Update: {
          date?: string
          portfolio_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "snapshots_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          brokerage: number | null
          date: string
          id: string
          portfolio_id: string
          price: number | null
          reason: string | null
          symbol: string
          units: number
        }
        Insert: {
          brokerage?: number | null
          date?: string
          id?: string
          portfolio_id: string
          price?: number | null
          reason?: string | null
          symbol: string
          units: number
        }
        Update: {
          brokerage?: number | null
          date?: string
          id?: string
          portfolio_id?: string
          price?: number | null
          reason?: string | null
          symbol?: string
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
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
      add_compression_policy: {
        Args: {
          hypertable: unknown
          compress_after: unknown
          if_not_exists?: boolean
          schedule_interval?: unknown
          initial_start?: string
          timezone?: string
        }
        Returns: number
      }
      add_continuous_aggregate_policy: {
        Args: {
          continuous_aggregate: unknown
          start_offset: unknown
          end_offset: unknown
          schedule_interval: unknown
          if_not_exists?: boolean
          initial_start?: string
          timezone?: string
        }
        Returns: number
      }
      add_data_node: {
        Args: {
          node_name: unknown
          host: string
          database?: unknown
          port?: number
          if_not_exists?: boolean
          bootstrap?: boolean
          password?: string
        }
        Returns: {
          node_name: unknown
          host: string
          port: number
          database: unknown
          node_created: boolean
          database_created: boolean
          extension_created: boolean
        }[]
      }
      add_dimension: {
        Args: {
          hypertable: unknown
          column_name: unknown
          number_partitions?: number
          chunk_time_interval?: unknown
          partitioning_func?: unknown
          if_not_exists?: boolean
        }
        Returns: {
          dimension_id: number
          schema_name: unknown
          table_name: unknown
          column_name: unknown
          created: boolean
        }[]
      }
      add_job: {
        Args: {
          proc: unknown
          schedule_interval: unknown
          config?: Json
          initial_start?: string
          scheduled?: boolean
          check_config?: unknown
          fixed_schedule?: boolean
          timezone?: string
        }
        Returns: number
      }
      add_reorder_policy: {
        Args: {
          hypertable: unknown
          index_name: unknown
          if_not_exists?: boolean
          initial_start?: string
          timezone?: string
        }
        Returns: number
      }
      add_retention_policy: {
        Args: {
          relation: unknown
          drop_after: unknown
          if_not_exists?: boolean
          schedule_interval?: unknown
          initial_start?: string
          timezone?: string
        }
        Returns: number
      }
      alter_data_node: {
        Args: {
          node_name: unknown
          host?: string
          database?: unknown
          port?: number
          available?: boolean
        }
        Returns: {
          node_name: unknown
          host: string
          port: number
          database: unknown
          available: boolean
        }[]
      }
      alter_job: {
        Args: {
          job_id: number
          schedule_interval?: unknown
          max_runtime?: unknown
          max_retries?: number
          retry_period?: unknown
          scheduled?: boolean
          config?: Json
          next_start?: string
          if_exists?: boolean
          check_config?: unknown
        }
        Returns: {
          job_id: number
          schedule_interval: unknown
          max_runtime: unknown
          max_retries: number
          retry_period: unknown
          scheduled: boolean
          config: Json
          next_start: string
          check_config: string
        }[]
      }
      approximate_row_count: {
        Args: {
          relation: unknown
        }
        Returns: number
      }
      attach_data_node: {
        Args: {
          node_name: unknown
          hypertable: unknown
          if_not_attached?: boolean
          repartition?: boolean
        }
        Returns: {
          hypertable_id: number
          node_hypertable_id: number
          node_name: unknown
        }[]
      }
      attach_tablespace: {
        Args: {
          tablespace: unknown
          hypertable: unknown
          if_not_attached?: boolean
        }
        Returns: undefined
      }
      chunk_compression_stats: {
        Args: {
          hypertable: unknown
        }
        Returns: {
          chunk_schema: unknown
          chunk_name: unknown
          compression_status: string
          before_compression_table_bytes: number
          before_compression_index_bytes: number
          before_compression_toast_bytes: number
          before_compression_total_bytes: number
          after_compression_table_bytes: number
          after_compression_index_bytes: number
          after_compression_toast_bytes: number
          after_compression_total_bytes: number
          node_name: unknown
        }[]
      }
      chunks_detailed_size: {
        Args: {
          hypertable: unknown
        }
        Returns: {
          chunk_schema: unknown
          chunk_name: unknown
          table_bytes: number
          index_bytes: number
          toast_bytes: number
          total_bytes: number
          node_name: unknown
        }[]
      }
      compress_chunk: {
        Args: {
          uncompressed_chunk: unknown
          if_not_compressed?: boolean
        }
        Returns: unknown
      }
      create_distributed_hypertable: {
        Args: {
          relation: unknown
          time_column_name: unknown
          partitioning_column?: unknown
          number_partitions?: number
          associated_schema_name?: unknown
          associated_table_prefix?: unknown
          chunk_time_interval?: unknown
          create_default_indexes?: boolean
          if_not_exists?: boolean
          partitioning_func?: unknown
          migrate_data?: boolean
          chunk_target_size?: string
          chunk_sizing_func?: unknown
          time_partitioning_func?: unknown
          replication_factor?: number
          data_nodes?: unknown[]
        }
        Returns: {
          hypertable_id: number
          schema_name: unknown
          table_name: unknown
          created: boolean
        }[]
      }
      create_distributed_restore_point: {
        Args: {
          name: string
        }
        Returns: {
          node_name: unknown
          node_type: string
          restore_point: unknown
        }[]
      }
      create_hypertable: {
        Args: {
          relation: unknown
          time_column_name: unknown
          partitioning_column?: unknown
          number_partitions?: number
          associated_schema_name?: unknown
          associated_table_prefix?: unknown
          chunk_time_interval?: unknown
          create_default_indexes?: boolean
          if_not_exists?: boolean
          partitioning_func?: unknown
          migrate_data?: boolean
          chunk_target_size?: string
          chunk_sizing_func?: unknown
          time_partitioning_func?: unknown
          replication_factor?: number
          data_nodes?: unknown[]
          distributed?: boolean
        }
        Returns: {
          hypertable_id: number
          schema_name: unknown
          table_name: unknown
          created: boolean
        }[]
      }
      decompress_chunk: {
        Args: {
          uncompressed_chunk: unknown
          if_compressed?: boolean
        }
        Returns: unknown
      }
      delete_data_node: {
        Args: {
          node_name: unknown
          if_exists?: boolean
          force?: boolean
          repartition?: boolean
          drop_database?: boolean
        }
        Returns: boolean
      }
      delete_job: {
        Args: {
          job_id: number
        }
        Returns: undefined
      }
      detach_data_node: {
        Args: {
          node_name: unknown
          hypertable?: unknown
          if_attached?: boolean
          force?: boolean
          repartition?: boolean
          drop_remote_data?: boolean
        }
        Returns: number
      }
      detach_tablespace: {
        Args: {
          tablespace: unknown
          hypertable?: unknown
          if_attached?: boolean
        }
        Returns: number
      }
      detach_tablespaces: {
        Args: {
          hypertable: unknown
        }
        Returns: number
      }
      drop_chunks: {
        Args: {
          relation: unknown
          older_than?: unknown
          newer_than?: unknown
          verbose?: boolean
        }
        Returns: string[]
      }
      get_telemetry_report: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      hypertable_compression_stats: {
        Args: {
          hypertable: unknown
        }
        Returns: {
          total_chunks: number
          number_compressed_chunks: number
          before_compression_table_bytes: number
          before_compression_index_bytes: number
          before_compression_toast_bytes: number
          before_compression_total_bytes: number
          after_compression_table_bytes: number
          after_compression_index_bytes: number
          after_compression_toast_bytes: number
          after_compression_total_bytes: number
          node_name: unknown
        }[]
      }
      hypertable_detailed_size: {
        Args: {
          hypertable: unknown
        }
        Returns: {
          table_bytes: number
          index_bytes: number
          toast_bytes: number
          total_bytes: number
          node_name: unknown
        }[]
      }
      hypertable_index_size: {
        Args: {
          index_name: unknown
        }
        Returns: number
      }
      hypertable_size: {
        Args: {
          hypertable: unknown
        }
        Returns: number
      }
      interpolate:
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
      locf: {
        Args: {
          value: unknown
          prev?: unknown
          treat_null_as_missing?: boolean
        }
        Returns: unknown
      }
      move_chunk: {
        Args: {
          chunk: unknown
          destination_tablespace: unknown
          index_destination_tablespace?: unknown
          reorder_index?: unknown
          verbose?: boolean
        }
        Returns: undefined
      }
      remove_compression_policy: {
        Args: {
          hypertable: unknown
          if_exists?: boolean
        }
        Returns: boolean
      }
      remove_continuous_aggregate_policy: {
        Args: {
          continuous_aggregate: unknown
          if_not_exists?: boolean
          if_exists?: boolean
        }
        Returns: undefined
      }
      remove_reorder_policy: {
        Args: {
          hypertable: unknown
          if_exists?: boolean
        }
        Returns: undefined
      }
      remove_retention_policy: {
        Args: {
          relation: unknown
          if_exists?: boolean
        }
        Returns: undefined
      }
      reorder_chunk: {
        Args: {
          chunk: unknown
          index?: unknown
          verbose?: boolean
        }
        Returns: undefined
      }
      set_adaptive_chunking: {
        Args: {
          hypertable: unknown
          chunk_target_size: string
        }
        Returns: Record<string, unknown>
      }
      set_chunk_time_interval: {
        Args: {
          hypertable: unknown
          chunk_time_interval: unknown
          dimension_name?: unknown
        }
        Returns: undefined
      }
      set_integer_now_func: {
        Args: {
          hypertable: unknown
          integer_now_func: unknown
          replace_if_exists?: boolean
        }
        Returns: undefined
      }
      set_number_partitions: {
        Args: {
          hypertable: unknown
          number_partitions: number
          dimension_name?: unknown
        }
        Returns: undefined
      }
      set_replication_factor: {
        Args: {
          hypertable: unknown
          replication_factor: number
        }
        Returns: undefined
      }
      show_chunks: {
        Args: {
          relation: unknown
          older_than?: unknown
          newer_than?: unknown
        }
        Returns: unknown[]
      }
      show_tablespaces: {
        Args: {
          hypertable: unknown
        }
        Returns: unknown[]
      }
      time_bucket:
        | {
            Args: {
              bucket_width: number
              ts: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              offset: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              offset: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              offset: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              offset: unknown
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              offset: unknown
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              offset: unknown
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              origin: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              origin: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              origin: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              timezone: string
              origin?: string
              offset?: unknown
            }
            Returns: string
          }
      time_bucket_gapfill:
        | {
            Args: {
              bucket_width: number
              ts: number
              start?: number
              finish?: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              start?: number
              finish?: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              start?: number
              finish?: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              start?: string
              finish?: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              start?: string
              finish?: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              start?: string
              finish?: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              timezone: string
              start?: string
              finish?: string
            }
            Returns: string
          }
      timescaledb_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      timescaledb_post_restore: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      timescaledb_pre_restore: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
