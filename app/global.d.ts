import type { Database as DB } from "@/types/database.types";

declare global {
  type Database = DB;
  type matches = DB["public"]["Tables"]["matches"]["Row"];
  type myteams = DB["public"]["Tables"]["myteams"]["Row"];
  type news = DB["public"]["Tables"]["news"]["Row"];
  type players = DB["public"]["Tables"]["players"]["Row"];
  type roles = DB["public"]["Tables"]["roles"]["Row"];
  type squads = DB["public"]["Tables"]["squads"]["Row"];
  type stats = DB["public"]["Tables"]["stats"]["Row"];
  type teams = DB["public"]["Tables"]["teams"]["Row"];
  type users = DB["public"]["Tables"]["users"]["Row"];
  
}