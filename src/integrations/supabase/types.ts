export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      integration_logs: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          response: Json | null
          status: string
          tool_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          response?: Json | null
          status: string
          tool_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response?: Json | null
          status?: string
          tool_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "security_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      pii_findings: {
        Row: {
          confidence_score: number | null
          context_snippet: string | null
          created_at: string | null
          file_path: string
          id: string
          is_encrypted: boolean | null
          pii_type: string
          risk_level: Database["public"]["Enums"]["severity_level"]
          scan_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          context_snippet?: string | null
          created_at?: string | null
          file_path: string
          id?: string
          is_encrypted?: boolean | null
          pii_type: string
          risk_level: Database["public"]["Enums"]["severity_level"]
          scan_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          context_snippet?: string | null
          created_at?: string | null
          file_path?: string
          id?: string
          is_encrypted?: boolean | null
          pii_type?: string
          risk_level?: Database["public"]["Enums"]["severity_level"]
          scan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pii_findings_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          scan_types: Database["public"]["Enums"]["scan_type"][]
          scheduled_at: string | null
          status: Database["public"]["Enums"]["scan_status"] | null
          target_scope: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          scan_types: Database["public"]["Enums"]["scan_type"][]
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["scan_status"] | null
          target_scope: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          scan_types?: Database["public"]["Enums"]["scan_type"][]
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["scan_status"] | null
          target_scope?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scans: {
        Row: {
          campaign_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          parameters: Json | null
          raw_output: string | null
          scan_type: Database["public"]["Enums"]["scan_type"]
          started_at: string | null
          status: Database["public"]["Enums"]["scan_status"] | null
          target: string
          tool_id: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          parameters?: Json | null
          raw_output?: string | null
          scan_type: Database["public"]["Enums"]["scan_type"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["scan_status"] | null
          target: string
          tool_id?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          parameters?: Json | null
          raw_output?: string | null
          scan_type?: Database["public"]["Enums"]["scan_type"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["scan_status"] | null
          target?: string
          tool_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scans_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "scan_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scans_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "security_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      security_reports: {
        Row: {
          campaign_id: string | null
          executive_summary: string | null
          findings_summary: Json | null
          generated_at: string | null
          id: string
          report_data: Json | null
          title: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          executive_summary?: string | null
          findings_summary?: Json | null
          generated_at?: string | null
          id?: string
          report_data?: Json | null
          title: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          executive_summary?: string | null
          findings_summary?: Json | null
          generated_at?: string | null
          id?: string
          report_data?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_reports_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "scan_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      security_tools: {
        Row: {
          api_key_encrypted: string | null
          configuration: Json | null
          created_at: string | null
          endpoint_url: string | null
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["integration_type"]
          updated_at: string | null
        }
        Insert: {
          api_key_encrypted?: string | null
          configuration?: Json | null
          created_at?: string | null
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
        }
        Update: {
          api_key_encrypted?: string | null
          configuration?: Json | null
          created_at?: string | null
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["integration_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      vulnerabilities: {
        Row: {
          affected_target: string
          created_at: string | null
          cve_id: string | null
          cvss_score: number | null
          description: string | null
          evidence: Json | null
          id: string
          port: number | null
          remediation: string | null
          scan_id: string | null
          service: string | null
          severity: Database["public"]["Enums"]["severity_level"]
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          affected_target: string
          created_at?: string | null
          cve_id?: string | null
          cvss_score?: number | null
          description?: string | null
          evidence?: Json | null
          id?: string
          port?: number | null
          remediation?: string | null
          scan_id?: string | null
          service?: string | null
          severity: Database["public"]["Enums"]["severity_level"]
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          affected_target?: string
          created_at?: string | null
          cve_id?: string | null
          cvss_score?: number | null
          description?: string | null
          evidence?: Json | null
          id?: string
          port?: number | null
          remediation?: string | null
          scan_id?: string | null
          service?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vulnerabilities_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      integration_type:
        | "siem"
        | "soar"
        | "splunk"
        | "firewall"
        | "nmap"
        | "metasploit"
        | "openvas"
      scan_status: "pending" | "running" | "completed" | "failed" | "cancelled"
      scan_type:
        | "network_scan"
        | "vulnerability_scan"
        | "filesystem_scan"
        | "pii_scan"
        | "compliance_scan"
      severity_level: "critical" | "high" | "medium" | "low" | "info"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      integration_type: [
        "siem",
        "soar",
        "splunk",
        "firewall",
        "nmap",
        "metasploit",
        "openvas",
      ],
      scan_status: ["pending", "running", "completed", "failed", "cancelled"],
      scan_type: [
        "network_scan",
        "vulnerability_scan",
        "filesystem_scan",
        "pii_scan",
        "compliance_scan",
      ],
      severity_level: ["critical", "high", "medium", "low", "info"],
    },
  },
} as const
