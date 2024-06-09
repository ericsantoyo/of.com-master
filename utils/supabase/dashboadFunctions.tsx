import { createClient } from "./client";
const supabase = createClient();

async function getAllPlayers() {
  const { data, error } = await supabase.from("players").select("*");
  return { data, error };
}

async function getRoleOfUser(email) {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .match({ email: email });
  return { data, error };
}

async function getAllUsers(includingOwner = false) {
  if (includingOwner) {
    const { data, error } = await supabase.from("roles").select("*");
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .neq("role", "owner");
    return { data, error };
  }
}

async function addNewManager(email) {
  const { data, error } = await supabase
    .from("roles")
    .insert([{ email: email, role: "manager" }])
    .select("*");
  return { data, error };
}

async function deleteManager(email) {
  const { data, error } = await supabase
    .from("roles")
    .delete()
    .match({ email: email })
    .select("*");
  return { data, error };
}

async function addNews() {
  const { data, error } = await supabase
    .from("news")
    .insert([{ title: "untitled", content: "", updated_at: Date.now() }])
    .select("*");
  return { data, error };
}

async function deleteNews(id) {
  const { data, error } = await supabase
    .from("news")
    .delete()
    .match({ id: id })
    .select("*");
  return { data, error };
}

async function getAllNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("updated_at", { ascending: false });
  return { data, error };
}

async function updateNews(id, news) {
  const { data, error } = await supabase
    .from("news")
    .update(news)
    .match({ id: id })
    .select("*");
  return { data, error };
}

async function addCoverPhoto(file, filepath) {
  const extension = file.name.split(".").pop();
  const { data, error } = await supabase.storage
    .from("cover_photos")
    .upload(filepath, file, {
      upsert: true,
      cacheControl: "0",
    });
  return { data, error };
}

async function addImage(file, filepath) {
  const extension = file.name.split(".").pop();
  const { data, error } = await supabase.storage
    .from("images")
    .upload(filepath, file, {
      upsert: true,
      cacheControl: "0",
    });

  return { data, error };
}

async function updateCoverPhotoUrl(newsId, url) {
  const { data, error } = await supabase
    .from("news")
    .update({ cover_photo_url: url })
    .match({ id: newsId })
    .select("*");
  return { data, error };
}

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

async function getNewsById(id) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .match({ id: id })
    .single();
  return { data, error };
}

async function updatePhotos(newsId, photos) {
  const { data, error } = await supabase
    .from("news")
    .update({ photos: photos })
    .match({ id: newsId })
    .select("*");
  return { data, error };
}

export {
  getAllPlayers,
  getRoleOfUser,
  getAllUsers,
  addNewManager,
  deleteManager,
  addNews,
  getAllNews,
  deleteNews,
  updateNews,
  addCoverPhoto,
  updateCoverPhotoUrl,
  getAllSuggestionTags,
  addImage,
  getNewsById,
  updatePhotos,
};
