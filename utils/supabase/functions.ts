import { createClient } from "./client";

const supabase = createClient();

async function getAllPlayers(): Promise<{ allPlayers: players[] }> {
  const { data: allPlayers } = await supabase
    .from("players")
    .select("*")
    .order("points", { ascending: false });
  return { allPlayers: allPlayers as players[] };
}

async function getAllNews(): Promise<{ allNews: any; error: any }> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("updated_at", { ascending: false });
  // console.log(data);
  return { allNews: data, error };
}

async function getNewsByPlayerID(playerID: number) {
  const { data: newses, error: newsError } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  let playerNews: any[] = [];

  if (newses) {
    newses.forEach((news) => {
      let tags = news.tags;
      tags.forEach((tag: { id: number }) => {
        if (tag.id === playerID) {
          playerNews.push(news);
        }
      });
    });
  }

  return { news: playerNews, error: newsError };
}

async function getNewsById(id: string): Promise<{ news: any; error: any }> {
  const { data, error } = await supabase.from("news").select("*").eq("id", id);
  return { news: data, error };
}

async function getPaginatedPlayers({
  teamID,
  playerName,
  page = 1,
  limit = 12,
}: {
  teamID?: number;
  playerName?: string;
  page: number;
  limit: number;
}): Promise<{ paginatedPlayers: players[]; totalCount: number }> {
  let request = supabase.from("players").select("*");

  if (teamID !== undefined) {
    request = request.eq("teamID", teamID);
  }

  if (playerName) {
    request = request.ilike("nickname", `%${playerName}%`);
  }

  const { data: paginatedPlayers, count } = await request
    .order("points", { ascending: false })
    .range(page * limit - limit, page * limit - 1);

  return {
    paginatedPlayers: paginatedPlayers as players[],
    totalCount: Number(count),
  };
}

async function getAllStats(): Promise<{ allStats: stats[] }> {
  const { data: allStats } = await supabase
    .from("stats")
    .select("*")
    .order("week", { ascending: false });

  return { allStats: allStats as stats[] };
}

async function getAllTeams(): Promise<{ allTeams: teams[] }> {
  const { data: allTeams } = await supabase.from("teams").select("*");
  return { allTeams: allTeams as teams[] };
}

async function getMyTeams(): Promise<{ myTeams: myteams[] }> {
  const { data, error } = await supabase.from("myteams").select("*");

  if (error) {
    console.error("Error fetching myTeams:", error);
    return { myTeams: [] };
  }

  return { myTeams: data as myteams[] };
}

// async function getMySquads(): Promise<{ mySquads: squads[] }> {
//   const { data, error } = await supabase.from("squads").select("*");

//   if (error) {
//     console.error("Error fetching myTeams:", error);
//     return { mySquads: [] };
//   }

//   return { mySquads: data as squads[] };
// }

async function fetchPlayersByIDs(playerIDs: number[]): Promise<players[]> {
  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .in("playerID", playerIDs);

  if (error) {
    console.error("Error fetching players:", error);
    return [];
  }

  return players;
}

async function getMySquads(email: string): Promise<{ mySquads: squads[] }> {
  const { data: squads, error } = await supabase
    .from("squads")
    .select("*")
    .eq("email", email); // Ensure this matches your database schema

  if (error) {
    console.error("Error fetching squads:", error);
    return { mySquads: [] };
  }

  return { mySquads: squads };
}

async function fetchStatsForMyTeamsPlayers(playerIds: number[]) {
  const { data: stats, error } = await supabase
    .from("stats")
    .select("*")
    .in("playerID", playerIds)
    .order("week", { ascending: false });

  if (error) {
    console.error("Error fetching stats:", error);
    return [];
  }

  return stats;
}

async function fetchMyTeamPlayers(playerIds: number[]) {
  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .in("playerID", playerIds);

  if (error) {
    console.error("Error fetching players:", error);
    return [];
  }

  return players;
}

async function getPlayerById(playerID: number) {
  // if (!playerID) return { data: null, error: "No playerID provided" };
  const { data: playerData, error } = await supabase
    .from("players")
    .select("*")
    .eq("playerID", playerID);
  const { data: playerStat } = await supabase
    .from("stats")
    .select("*")
    .eq("playerID", playerID);

  let player: players | null = null;
  let stats: stats[] = [];

  if (playerData && playerData.length > 0) {
    player = playerData[0];
  }

  if (playerStat && playerStat.length > 0) {
    stats = playerStat;
  }

  return {
    player,
    stats,
    error,
  };
}

async function getPlayersByTeamID(
  teamID: number
): Promise<{ data: players[] | null; error: string | null }> {
  if (!teamID)
    return { data: null, error: "No teamID provided for getPlayersByTeamID" };
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("teamID", teamID);
  return { data, error: error?.message || null };
}

//get the 30 players with the most points and their stats per position
async function getTopPlayersByPositionWithStats(): Promise<{
  topPlayersWithStats: players[];
}> {
  const positions = [1, 2, 3, 4, 5];
  let topPlayersByPosition: players[] = [];

  // Fetch top players for each position in parallel
  const playerFetchPromises = positions.map(async (position) => {
    const { data: topPlayers, error } = await supabase
      .from("players")
      .select("*")
      .eq("positionID", position)
      .order("points", { ascending: false })
      .limit(20);

    if (error) {
      console.error(
        `Error fetching top players for position ${position}:`,
        error
      );
      return [];
    }

    return topPlayers;
  });

  const topPlayersResults = await Promise.all(playerFetchPromises);
  topPlayersByPosition = topPlayersResults.flat();

  // Extract playerIDs from top players
  const playerIDs = topPlayersByPosition.map((player) => player.playerID);

  // Fetch stats for all these player IDs in one call
  const { data: stats, error: statsError } = await supabase
    .from("stats")
    .select("*")
    .in("playerID", playerIDs);

  if (statsError) {
    console.error("Error fetching stats:", statsError);
    return { topPlayersWithStats: [] };
  }

  // Combine players with their stats
  const playersWithStats = topPlayersByPosition.map((player) => ({
    ...player,
    stats: stats.filter((stat) => stat.playerID === player.playerID),
  }));

  return { topPlayersWithStats: playersWithStats };
}

async function getAllMatches(): Promise<{ allMatches: matches[] }> {
  const { data: allMatches } = await supabase
    .from("matches")
    .select("*")
    .order("matchID", { ascending: false });
  return { allMatches: allMatches as matches[] };
}

async function getTeamByTeamID(teamID: number) {
  const { data: teamData } = await supabase
    .from("teams")
    .select("*")
    .eq("teamID", teamID);

  return { teamData: teamData as teams[] };
}

async function getMatchesByTeamID(teamID: number) {
  const { data: teamMatches } = await supabase
    .from("matches")
    .select("*")
    .or(`localTeamID.eq.${teamID}, visitorTeamID.eq.${teamID}`)
    .order("matchDate", { ascending: true });

  return { teamMatches: teamMatches as matches[] };
}

async function getFinishedMatches(): Promise<{ finishedMatches: matches[] }> {
  const { data: finishedMatches } = await supabase
    .from("matches")
    .select("*")
    .eq("matchState", 7)
    .order("matchDate", { ascending: true });

  return { finishedMatches: finishedMatches as matches[] };
}

async function createNewSquad(newSquad: squads): Promise<squads> {
  const { data: squad, error } = await supabase
    .from("squads")
    .insert([newSquad])
    .single();

  if (error) {
    throw error;
  }

  return squad;
}

async function getAllUsers() {
  const { data: users, error } = await supabase.from("users").select("*");
  return { allUsers: users, error };
}

async function getAllSquadsByEmail(email: string) {
  const { data: squads, error } = await supabase
    .from("squads")
    .select("*")
    .eq("email", email);

  const formattedSquads = squads.map((squad) => ({
    id: squad.squadID,
    squadName: squad.squadName,
    players: squad.playersIDS,
    lineup: squad.lineup,
  }));

  return { allSquads: formattedSquads, error: null };
}

async function getSquadById(squadID: string) {
  try {
    const { data, error } = await supabase
      .from("squads")
      .select("*")
      .eq("squadID", squadID)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

async function updateSquad(
  squadID: string,
  updates: Partial<squads>
): Promise<void> {
  const { error } = await supabase
    .from("squads")
    .update(updates)
    .eq("squadID", squadID);

  if (error) {
    throw error;
  }
}

const deleteSquadById = async (squadID: string) => {
  const response = await supabase
    .from("squads")
    .delete()
    .eq("squadID", squadID);

  return response;
};

export {
  getAllPlayers,
  getAllStats,
  getAllTeams,
  getPlayerById,
  getTeamByTeamID,
  getPlayersByTeamID,
  getPaginatedPlayers,
  getAllMatches,
  getMatchesByTeamID,
  getMyTeams,
  fetchStatsForMyTeamsPlayers,
  fetchMyTeamPlayers,
  getFinishedMatches,
  getMySquads,
  getTopPlayersByPositionWithStats,
  deleteSquadById,
  createNewSquad,
  getAllUsers,
  getAllSquadsByEmail,
  getSquadById,
  updateSquad,
  getAllNews,
  getNewsByPlayerID,
  getNewsById,
  fetchPlayersByIDs,
};
