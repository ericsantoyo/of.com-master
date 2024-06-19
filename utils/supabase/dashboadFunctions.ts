import { createClient } from "./client";
const supabase = createClient();

async function getAllSuggestionTags() {
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("*");
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*");

  let suggestions = [];
  if (players) {
    // { text: player.name, type: 'player', id: player.id }
    // { text: player.nickname, type: 'player', id: player.id }
    players.forEach((player) => {
      suggestions.push({
        text: player.name,
        type: "player",
        id: player.playerID,
      });
      suggestions.push({
        text: player.nickname,
        type: "player",
        id: player.playerID,
      });
    });
  }

  if (teams) {
    // { text: team.name, type: 'team', id: team.id }
    // { text: team.nickname, type: 'team', id: team.id }
    teams.forEach((team) => {
      suggestions.push({ text: team.name, type: "team", id: team.teamID });
      suggestions.push({ text: team.nickname, type: "team", id: team.teamID });
    });
  }

  return { suggestions, error: { playersError, teamsError } };
}

export { getAllSuggestionTags };
