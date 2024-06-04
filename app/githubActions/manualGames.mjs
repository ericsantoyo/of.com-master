import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client directly here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are not set");
  process.exit(1); // Exit the process if the environment variables are not set
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addMatches(matches) {
  const { error } = await supabase.from("matches").upsert(matches);

  if (error) throw error;
}

function formatMatches(matches, week) {
  const formattedMatches = [];

  matches.forEach((match) => {
    formattedMatches.push({
      matchID: match.id,
      matchDate: match.matchDate,
      matchState: match.matchState,
      localScore: match.localScore,
      visitorScore: match.visitorScore,
      localTeamID: match.local.id,
      visitorTeamID: match.visitor.id,
      week: week,
    });
  });

  return formattedMatches;
}

async function fetchMatchData(weekID) {
  const baseUrl = "https://api-fantasy.llt-services.com/stats";
  const endpoint = `/v1/stats/week/${weekID}?x-lang=en`;

  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (response.status === 404 || !response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

async function main() {
  const matches = [];
  const startingIndex = 0;
  const endingIndex = 40;

  for (let weekID = startingIndex; weekID <= endingIndex; weekID++) {
    const matchData = await fetchMatchData(weekID);
    if (matchData) {
      const formattedMatches = formatMatches(matchData, weekID);
      matches.push(...formattedMatches);
    }
  }

  try {
    await addMatches(matches);
    console.log("Schedules update successful");
    process.exit(0);
  } catch (error) {
    console.error("Error updating schedules in Supabase:", error);
    process.exit(1);
  }
}

// Execute the main function when the script is run
main();
