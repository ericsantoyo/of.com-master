import type { Database as DB } from "@/types/database.types";

declare global {
  type Database = DB;
  type author = DB["public"]["Tables"]["author"]["Row"];
  type blog = DB["public"]["Tables"]["blog"]["Row"];
  type category = DB["public"]["Tables"]["category"]["Row"];
  type documents = DB["public"]["Tables"]["documents"]["Row"];
  type matches = DB["public"]["Tables"]["matches"]["Row"];
  type myteams = DB["public"]["Tables"]["myteams"]["Row"];
  type news = DB["public"]["Tables"]["news"]["Row"];
  type players = DB["public"]["Tables"]["players"]["Row"];
  type roles = DB["public"]["Tables"]["roles"]["Row"];
  type squads = DB["public"]["Tables"]["squads"]["Row"];
  type stats = DB["public"]["Tables"]["stats"]["Row"];
  type teams = DB["public"]["Tables"]["teams"]["Row"];
  type users_roles = DB["public"]["Tables"]["users_roles"]["Row"];
  type users = DB["public"]["Tables"]["users"]["Row"];



  
}