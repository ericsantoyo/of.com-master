export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SortDirection = "asc" | "desc" | undefined;

export type MarketValue = {
  date: string;
  marketValue: number;
};

// export type PlayerWithStats = {
//   playerData: players;
//   stats: stats[];
// };

export type Database = {
  public: {
    Tables: {
      author: {
        Row: {
          author_id: string | null;
          author_instagram: string | null;
          author_name: string;
          author_profile_img: string | null;
          author_twitter: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          author_id?: string | null;
          author_instagram?: string | null;
          author_name: string;
          author_profile_img?: string | null;
          author_twitter?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          author_id?: string | null;
          author_instagram?: string | null;
          author_name?: string;
          author_profile_img?: string | null;
          author_twitter?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      blog: {
        Row: {
          author_id: string | null;
          blog_html: string | null;
          category_id: number | null;
          created_at: string | null;
          id: number;
          image: string | null;
          image_alt: string | null;
          keywords: string[] | null;
          published: boolean;
          shareable: boolean;
          slug: string;
          subtitle: string | null;
          title: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          author_id?: string | null;
          blog_html?: string | null;
          category_id?: number | null;
          created_at?: string | null;
          id?: never;
          image?: string | null;
          image_alt?: string | null;
          keywords?: string[] | null;
          published?: boolean;
          shareable?: boolean;
          slug: string;
          subtitle?: string | null;
          title: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          author_id?: string | null;
          blog_html?: string | null;
          category_id?: number | null;
          created_at?: string | null;
          id?: never;
          image?: string | null;
          image_alt?: string | null;
          keywords?: string[] | null;
          published?: boolean;
          shareable?: boolean;
          slug?: string;
          subtitle?: string | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blog_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "author";
            referencedColumns: ["author_id"];
          },
          {
            foreignKeyName: "blog_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          }
        ];
      };
      category: {
        Row: {
          category: string;
          id: number;
          user_id: string | null;
        };
        Insert: {
          category: string;
          id?: never;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          id?: never;
          user_id?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          created_at: string | null;
          document: string | null;
          document_id: string | null;
          id: number;
          title: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          document?: string | null;
          document_id?: string | null;
          id?: number;
          title: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          document?: string | null;
          document_id?: string | null;
          id?: number;
          title?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          localScore: number | null;
          localTeamID: number;
          matchDate: string | null;
          matchID: number;
          matchState: number;
          visitorScore: number | null;
          visitorTeamID: number;
          week: number;
        };
        Insert: {
          localScore?: number | null;
          localTeamID: number;
          matchDate?: string | null;
          matchID: number;
          matchState: number;
          visitorScore?: number | null;
          visitorTeamID: number;
          week: number;
        };
        Update: {
          localScore?: number | null;
          localTeamID?: number;
          matchDate?: string | null;
          matchID?: number;
          matchState?: number;
          visitorScore?: number | null;
          visitorTeamID?: number;
          week?: number;
        };
        Relationships: [];
      };
      myteams: {
        Row: {
          created_at: string;
          myTeamID: number;
          name: string | null;
          players: number[] | null;
        };
        Insert: {
          created_at?: string;
          myTeamID?: number;
          name?: string | null;
          players?: number[] | null;
        };
        Update: {
          created_at?: string;
          myTeamID?: number;
          name?: string | null;
          players?: number[] | null;
        };
        Relationships: [];
      };
      news: {
        Row: {
          category_id: string | null;
          content: string | null;
          cover_photo_url: string | null;
          created_at: string;
          id: string;
          photos: string[] | null;
          published: boolean;
          tags: Json | null;
          title: string | null;
          updated_at: number | null;
        };
        Insert: {
          category_id?: string | null;
          content?: string | null;
          cover_photo_url?: string | null;
          created_at?: string;
          id?: string;
          photos?: string[] | null;
          published?: boolean | null;
          tags?: Json | null;
          title?: string | null;
          updated_at?: number | null;
        };
        Update: {
          category_id?: string | null;
          content?: string | null;
          cover_photo_url?: string | null;
          created_at?: string;
          id?: string;
          photos?: string[] | null;
          published?: boolean | null;
          tags?: Json | null;
          title?: string | null;
          updated_at?: number | null;
        };
        Relationships: [];
      };
      players: {
        Row: {
          averagePoints: number;
          image: string;
          lastMarketChange: number;
          marketValue: number;
          marketValues: MarketValue[];
          name: string;
          nickname: string;
          playerID: number;
          points: number;
          position: string;
          positionID: number;
          previousMarketValue: number;
          status: string;
          teamID: number;
          teamName: string;
          playerData: players;
          pointsData: {
            totalLocalPoints: number;
            totalVisitorPoints: number;
            averageLocalPoints: number;
            averageVisitorPoints: number;
          };
          stats: stats[];
        };
        Insert: {
          averagePoints: number;
          image: string;
          lastMarketChange: number;
          marketValue: number;
          marketValues: Json;
          name: string;
          nickname: string;
          playerID: number;
          points: number;
          position: string;
          positionID: number;
          previousMarketValue: number;
          status: string;
          teamID: number;
          teamName: string;
        };
        Update: {
          averagePoints?: number;
          image?: string;
          lastMarketChange?: number;
          marketValue?: number;
          marketValues?: Json;
          name?: string;
          nickname?: string;
          playerID?: number;
          points?: number;
          position?: string;
          positionID?: number;
          previousMarketValue?: number;
          status?: string;
          teamID?: number;
          teamName?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          email: string;
          role: string | null;
          user_id: string | null;
        };
        Insert: {
          email: string;
          role?: string | null;
          user_id?: string | null;
        };
        Update: {
          email?: string;
          role?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      squads: {
        Row: {
          created_at: string;
          email: string | null;
          lineup: Json | null;
          playersIDS: Json;
          squadID: string;
          squadName: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          lineup?: Json | null;
          playersIDS?: Json | null;
          squadID?: string;
          squadName?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          lineup?: Json | null;
          playersIDS?: Json | null;
          squadID?: string;
          squadName?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      stats: {
        Row: {
          ball_recovery: Json | null;
          drawn_match: Json | null;
          effective_clearance: Json | null;
          goal_assist: Json | null;
          goals: Json | null;
          goals_conceded: Json | null;
          isInIdealFormation: boolean | null;
          lost_match: Json | null;
          marca_points: Json | null;
          mins_played: Json | null;
          offtarget_att_assist: Json | null;
          own_goals: Json | null;
          pen_area_entries: Json | null;
          penalty_conceded: Json | null;
          penalty_failed: Json | null;
          penalty_save: Json | null;
          penalty_won: Json | null;
          playerID: number;
          poss_lost_all: Json | null;
          red_card: Json | null;
          saves: Json | null;
          second_yellow_card: Json | null;
          total_scoring_att: Json | null;
          totalPoints: number | null;
          week: number;
          won_contest: Json | null;
          won_match: Json | null;
          yellow_card: Json | null;
        };
        Insert: {
          ball_recovery?: Json | null;
          drawn_match?: Json | null;
          effective_clearance?: Json | null;
          goal_assist?: Json | null;
          goals?: Json | null;
          goals_conceded?: Json | null;
          isInIdealFormation?: boolean | null;
          lost_match?: Json | null;
          marca_points?: Json | null;
          mins_played?: Json | null;
          offtarget_att_assist?: Json | null;
          own_goals?: Json | null;
          pen_area_entries?: Json | null;
          penalty_conceded?: Json | null;
          penalty_failed?: Json | null;
          penalty_save?: Json | null;
          penalty_won?: Json | null;
          playerID: number;
          poss_lost_all?: Json | null;
          red_card?: Json | null;
          saves?: Json | null;
          second_yellow_card?: Json | null;
          total_scoring_att?: Json | null;
          totalPoints?: number | null;
          week: number;
          won_contest?: Json | null;
          won_match?: Json | null;
          yellow_card?: Json | null;
        };
        Update: {
          ball_recovery?: Json | null;
          drawn_match?: Json | null;
          effective_clearance?: Json | null;
          goal_assist?: Json | null;
          goals?: Json | null;
          goals_conceded?: Json | null;
          isInIdealFormation?: boolean | null;
          lost_match?: Json | null;
          marca_points?: Json | null;
          mins_played?: Json | null;
          offtarget_att_assist?: Json | null;
          own_goals?: Json | null;
          pen_area_entries?: Json | null;
          penalty_conceded?: Json | null;
          penalty_failed?: Json | null;
          penalty_save?: Json | null;
          penalty_won?: Json | null;
          playerID?: number;
          poss_lost_all?: Json | null;
          red_card?: Json | null;
          saves?: Json | null;
          second_yellow_card?: Json | null;
          total_scoring_att?: Json | null;
          totalPoints?: number | null;
          week?: number;
          won_contest?: Json | null;
          won_match?: Json | null;
          yellow_card?: Json | null;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          image: string;
          name: string;
          nickname: string;
          stadium: string;
          teamID: number;
        };
        Insert: {
          image: string;
          name: string;
          nickname: string;
          stadium: string;
          teamID: number;
        };
        Update: {
          image?: string;
          name?: string;
          nickname?: string;
          stadium?: string;
          teamID?: number;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          email: string;
          id: number;
          role: string;
          user_id: string;
        };
        Insert: {
          email: string;
          id?: number;
          role?: string;
          user_id: string;
        };
        Update: {
          email?: string;
          id?: number;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
      is_editor: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
      is_visitor: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
