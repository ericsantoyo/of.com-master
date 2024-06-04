import { SortDirection } from "@/types/database.types";


export const teams = [
  {
    name: "Deportivo Alavés",
    slug: "d-alaves",
    nickname: "ALA",
    id: 21,
    stadium: "/stadiums/d-alaves.webp",
  },
  {
    name: "UD Almería",
    slug: "ud-almeria",
    nickname: "ALM",
    id: 1,
    stadium: "/stadiums/ud-almeria.webp",
  },
  {
    name: "Athletic Club",
    slug: "athletic-club",
    nickname: "ATH",
    id: 3,
    stadium: "/stadiums/athletic-club.webp",
  },
  {
    name: "Atlético de Madrid",
    slug: "atletico-de-madrid",
    nickname: "ATM",
    id: 2,
    stadium: "/stadiums/atletico-de-madrid.webp",
  },
  {
    name: "FC Barcelona",
    slug: "fc-barcelona",
    nickname: "BAR",
    id: 4,
    stadium: "/stadiums/fc-barcelona.webp",
  },
  {
    name: "Real Betis",
    slug: "real-betis",
    nickname: "BET",
    id: 5,
    stadium: "/stadiums/real-betis.webp",
  },
  {
    name: "Cádiz CF",
    slug: "cadiz-cf",
    nickname: "CAD",
    id: 162,
    stadium: "/stadiums/cadiz-cf.webp",
  },
  {
    name: "RC Celta",
    slug: "rc-celta",
    nickname: "CEL",
    id: 6,
    stadium: "/stadiums/rc-celta.webp",
  },
  {
    name: "Getafe CF",
    slug: "getafe-cf",
    nickname: "GET",
    id: 9,
    stadium: "/stadiums/getafe-cf.webp",
  },
  {
    name: "Girona FC",
    slug: "girona-fc",
    nickname: "GIR",
    id: 28,
    stadium: "/stadiums/girona-fc.webp",
  },
  {
    name: "Granada CF",
    slug: "granada-cf",
    nickname: "GRA",
    id: 10,
    stadium: "/stadiums/granada-cf.webp",
  },
  {
    name: "UD Las Palmas",
    slug: "ud-las-palmas",
    nickname: "LPA",
    id: 31,
    stadium: "/stadiums/ud-las-palmas.webp",
  },
  {
    name: "RCD Mallorca",
    slug: "rcd-mallorca",
    nickname: "MLL",
    id: 33,
    stadium: "/stadiums/rcd-mallorca.webp",
  },
  {
    name: "C.A. Osasuna",
    slug: "c-a-osasuna",
    nickname: "OSA",
    id: 13,
    stadium: "/stadiums/c-a-osasuna.webp",
  },
  {
    name: "Rayo Vallecano",
    slug: "rayo-vallecano",
    nickname: "RAY",
    id: 14,
    stadium: "/stadiums/rayo-vallecano.webp",
  },
  {
    name: "Real Madrid",
    slug: "real-madrid",
    nickname: "RMA",
    id: 15,
    stadium: "/stadiums/real-madrid.webp",
  },
  {
    name: "Real Sociedad",
    slug: "real-sociedad",
    nickname: "RSO",
    id: 16,
    stadium: "/stadiums/real-sociedad.webp",
  },
  {
    name: "Sevilla FC",
    slug: "sevilla-fc",
    nickname: "SEV",
    id: 17,
    stadium: "/stadiums/sevilla-fc.webp",
  },
  {
    name: "Valencia CF",
    slug: "valencia-cf",
    nickname: "VAL",
    id: 18,
    stadium: "/stadiums/valencia-cf.webp",
  },
  {
    name: "Villarreal CF",
    slug: "villarreal-cf",
    nickname: "VIL",
    id: 20,
    stadium: "/stadiums/villarreal-cf.webp",
  },
];

// Get the team slug by its ID
export function slugById(teamID: number) {
  const team = teams.find((team) => team.id === teamID);
  const slug = team ? team.slug : "Not Found";
  return slug;
}

// Get the team ID by its slug
export function slugByName({ name }: { name: string }) {
  const team = teams.find(
    (team) => team.name.replace(/\s/g, "") === name.replace(/\s/g, "")
  );
  const slug = team ? team.slug : "Not Found";
  return slug;
}

// Get the team nickname by its ID
export function nicknameById(teamID: number) {
  const team = teams.find((team) => team.id === teamID);
  const nickname = team ? team.nickname : "Not Found";
  return nickname;
}

// Get color depending on the points
export const getColor = (points: number, minsPlayed: number) => {
  if (minsPlayed === null) {
    return "bg-red-200 text-neutral-50 font-bold text-shadow"; // Not called up
  } else if (minsPlayed === 0) {
    return "bg-red-200 text-neutral-50 font-bold text-shadow"; // Called up but didn't play
  } else if (points >= 10) {
    return "bg-green-600 text-neutral-50 font-bold text-shadow";
  } else if (points >= 5) {
    return "bg-green-500 text-neutral-50 font-bold text-shadow";
  } else if (points >= 2) {
    return "bg-orange-500 text-neutral-50 font-bold text-shadow";
  } else if (points >= 0) {
    return "bg-red-500 text-neutral-50 font-bold text-shadow";
  } else {
    return "bg-red-700 text-neutral-50 font-bold text-shadow";
  }
};


export function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric" } as const;
  return date.toLocaleDateString(undefined, options);
}

export function formatMoney(value: number) {
  const formatter = new Intl.NumberFormat("en-GB", {});
  const formattedValue = formatter.format(value);
  return formattedValue;
}


// Get the total points for the last N weeks for a player
export function getWeeksTotalPointsFromStats(
  playerId: number,
  rowData: any[],
  maxWeeks: number
) {
  const selectedPlayerData = rowData.find(
    (player) => player.playerData.playerID === playerId
  );
  const stats = selectedPlayerData.stats;

  let points = [];

  // Create a map to store points and mins_played by week
  const pointsByWeek = new Map();

  // Calculate points and mins_played for each week from the player's stats
  for (const stat of stats) {
    const week = stat.week;
    const totalPoints = stat.totalPoints;
    const minsPlayed = Array.isArray(stat.mins_played) ? stat.mins_played[0] : null;

    // Update the points and mins_played for the corresponding week
    pointsByWeek.set(week, { totalPoints, minsPlayed });
  }

  // Determine the maximum week
  let maxWeek = Math.max(...stats.map((stat: { week: number }) => stat.week));

  // Get the last N weeks (or fewer if less than N weeks of data)
  for (let i = maxWeek; i > maxWeek - maxWeeks && i >= 1; i--) {
    const weekData = pointsByWeek.get(i) || { totalPoints: null, minsPlayed: null };
    points.push({
      week: i,
      points: weekData.totalPoints,
      mins_played: weekData.minsPlayed,
    });
  }

  // Sort points by week in ascending order
  points.sort((a, b) => a.week - b.week);

  return points;
}

// Get the total points for the last N weeks for a player
export function getWeeksTotalPointsFromSinglePlayer(
  playerWithStats: any,
  maxWeeks: number
) {
  const player = playerWithStats.playerData;
  const stats = playerWithStats.stats;

  let points = [];

  // Create a map to store points by week
  const pointsByWeek = new Map();

  // Calculate points for each week from the player's stats
  for (const stat of stats) {
    const week = stat.week;
    const totalPoints = stat.totalPoints;

    // Update the points for the corresponding week
    pointsByWeek.set(week, totalPoints);
  }

  // Determine the maximum week
  let maxWeek = Math.max(...stats.map((stat: { week: number }) => stat.week));

  // Get the last N weeks (or fewer if less than N weeks of data)
  for (let i = maxWeek; i > maxWeek - maxWeeks && i >= 1; i--) {
    points.push({
      week: i,
      points: pointsByWeek.get(i) || 0, // Use 0 if there are no stats for the week
    });
  }

  // Sort points by week in ascending order
  points.sort((a, b) => a.week - b.week);

  return points;
}


export const formatter = new Intl.NumberFormat("en-GB", {});


export const lastChangeStyle = (lastChange: number) => {
  if (lastChange >= 0) return " text-green-600 dark:text-green-400";
  return "text-red-500";
};

export const getTotalPointsOfTeam = (players: {
  [x: string]: {
    status: string;
    points: number;
  };
}) => {
  let total = 0;
  for (let player in players) {
    if (players[player].status === "out_of_league") {
      continue;
    }
    total += players[player].points;
  }
  return total;
};

export const getTotalMarketValueOfTeam = (players: {
  [x: string]: {
    status: string;
    marketValue: number;
  };
}) => {
  let total = 0;
  for (let player in players) {
    if (players[player].status === "out_of_league") {
      continue;
    }
    total += players[player].marketValue;
  }
  return total;
};

export const getTotalLastMarketChangeOfTeam = (players: {
  [x: string]: {
    status: string;
    lastMarketChange: number;
  };
}) => {
  let total = 0;
  for (let player in players) {
    if (players[player].status === "out_of_league") {
      continue;
    }
    total += players[player].lastMarketChange;
  }
  return total;
};

export const getNumberOfPlayersOfTeam = (players: {
  [x: string]: { status: string };
}) => {
  let total = 0;
  for (let player in players) {
    if (players[player].status !== "out_of_league") {
      total++;
    }
  }
  return total;
};

export const getNumberOfAvailablePlayersOfTeam = (players: {
  [x: string]: { status: string };
}) => {
  let total = 0;
  for (let player in players) {
    if (players[player].status === "ok") {
      total++;
    }
  }
  return total;
};

export function getPositionBadge(positionID: number) {
  switch (positionID) {
    case 1:
      return {
        abbreviation: "POR",
        name: "Portero",
        className:
          "mx-auto shadow-sm shadow-neutral-400 dark:shadow-neutral-800 w-fit px-2 text-center text-[12px] leading-5 font-semibold rounded bg-gradient-to-r from-[#d85912] to-[#ff7e00] dark:bg-orange-600 text-gray-50",
      };
    case 2:
      return {
        abbreviation: "DEF",
        name: "Defensa",
        className:
          "mx-auto shadow-sm shadow-neutral-400 dark:shadow-neutral-800 w-fit px-2 text-center text-[12px] leading-5 font-semibold rounded bg-gradient-to-r from-[#8023a7] to-[#ce32dc] dark:bg-purple-600 text-gray-50",
      };
    case 3:
      return {
        abbreviation: "CEN",
        name: "Centro",
        className:
          "mx-auto shadow-sm shadow-neutral-400 dark:shadow-neutral-800 w-fit px-2 text-center text-[12px] leading-5 font-semibold rounded bg-gradient-to-tr from-[#0094ff] to-[#4bafe3] dark:bg-blue-600 text-gray-50",
      };
    case 4:
      return {
        abbreviation: "DEL",
        name: "Delantero",
        className:
          "mx-auto shadow-sm shadow-neutral-400 border-gray-600 dark:shadow-neutral-800 w-fit px-2 text-center text-[12px] leading-5 font-semibold rounded bg-gradient-to-tr from-[#ee9015] to-[#f3c832] dark:bg-red-600 text-gray-50",
      };
    case 5:
      return {
        abbreviation: "ENT",
        name: "Entrenador",
        className:
          "mx-auto shadow-sm shadow-neutral-400 dark:shadow-neutral-800 w-fit px-2 text-center text-[12px] leading-5 font-semibold rounded bg-gradient-to-br from-[#02da67] to-[#449fcf] dark:bg-green-600 text-gray-50",
      };
    default:
      return {
        abbreviation: "",
        name: "",
        className: "",
      };
  }
}

export function getStadiumByTeamID(teamID: number) {
  const team = teams.find((team) => team.id === teamID);
  return team ? team.stadium : "Not Found";
}

export async function getTeamLogo(teamID: number) {
  const slug = slugById(teamID);
  return `/teamLogos/${slug}.png`;
}

export const getCurrentWeek = (matches: matches[]): number => {
  const now = new Date();

  // Filter upcoming matches (matchState is not 7) and sort them by matchDate in ascending order
  const upcomingMatches = matches
    .filter((match) => match.matchState !== 7 && match.matchDate !== null)
    .sort(
      (a, b) =>
        new Date(a.matchDate!).getTime() - new Date(b.matchDate!).getTime()
    );

  // Find the first upcoming match where the match date is after the current date and time
  const nextMatch = upcomingMatches.find(
    (match) => new Date(match.matchDate!) > now
  );

  // If there's an upcoming match, return its week, otherwise default to 1
  return nextMatch ? nextMatch.week ?? 1 : 1;
};


export const getUpcomingMatches = (
  allMatches: matches[],
  gamesToShow: number
): matches[] => {
  const now = new Date();

  // Filter out matches that have not finished and sort them by matchDate
  const upcomingMatches = allMatches
    .filter(
      (match) => match.matchState !== 7 && new Date(match.matchDate!) > now
    )
    .sort(
      (a, b) =>
        new Date(a.matchDate!).getTime() - new Date(b.matchDate!).getTime()
    )
    .slice(0, gamesToShow); // Limit the number of upcoming matches returned

  return upcomingMatches;
};

export const getNextThreeMatches = (
  matches: matches[],
  selectedPlayer: players
): matches[] => {
  const currentWeek = getCurrentWeek(matches);
  return matches
    .filter(
      (match) =>
        match.week !== null && // Add null check for match.week
        match.week >= currentWeek &&
        match.week < currentWeek + 3 &&
        (match.localTeamID === (selectedPlayer.playerData?.teamID || null) ||
          match.visitorTeamID === (selectedPlayer.playerData?.teamID || null))
    )
    .sort(
      (a, b) =>
        (a.matchDate ? new Date(a.matchDate).getTime() : 0) -
        (b.matchDate ? new Date(b.matchDate).getTime() : 0)
    );
};

export const getNextGames = (
  matches: matches[],
  selectedPlayer: players,
  quantity: number
): matches[] => {
  const currentWeek = getCurrentWeek(matches);
  return matches
    .filter(
      (match) =>
        match.week !== null && // Add null check for match.week
        match.week >= currentWeek &&
        match.week < currentWeek + quantity &&
        (match.localTeamID === selectedPlayer.teamID ||
          match.visitorTeamID === selectedPlayer.teamID)
    )
    .sort(
      (a, b) =>
        (a.matchDate ? new Date(a.matchDate).getTime() : 0) -
        (b.matchDate ? new Date(b.matchDate).getTime() : 0)
    );
};

export const createColumnDefs = (
  cellRenderers: { [key: string]: any },
  sortOrder: SortDirection = "desc"
) => {
  return [
    {
      field: "playerData",
      headerName: "",
      minWidth: 60,
      maxWidth: 70,
      cellRenderer: cellRenderers.tablePlayerImg,
    },
    {
      field: "playerData.nickname",
      headerName: "Nombre",
      minWidth: 110,
      cellRenderer: cellRenderers.tablePlayerNames,
    },
    {
      field: "playerData.lastMarketChange",
      headerName: "Cambio",
      minWidth: 85,
      sort: sortOrder,
      headerClass: "ag-center-header",
      cellRenderer: cellRenderers.tableSubidasBajadas,
    },
    {
      field: "playerData.teamName",
      headerName: "",
      minWidth: 40,
      cellRenderer: cellRenderers.tableClubLogos,
    },
    {
      field: "playerData.marketValue",
      headerName: "$ Actual",
      minWidth: 90,
      headerClass: "ag-center-header",
      cellRenderer: cellRenderers.tableValues,
    },
    {
      field: "playerData.previousMarketValue",
      headerName: "$ Previo",
      minWidth: 80,
      cellRenderer: cellRenderers.tableValues,
    },
    {
      field: "playerData.positionID",
      headerName: "Pos",
      minWidth: 65,
      cellRenderer: cellRenderers.tablePositions,
      headerClass: "ag-center-header",
    },
  ];
};

export const calculatePlayerPoints = (
  playerStats: stats[],
  matches: matches[],
  playerTeamID: number
): {
  totalLocalPoints: number;
  totalVisitorPoints: number;
  averageLocalPoints: number;
  averageVisitorPoints: number;
} => {
  let totalLocalPoints = 0;
  let totalVisitorPoints = 0;
  let localGamesCount = 0;
  let visitorGamesCount = 0;

  playerStats.forEach((stat) => {
    const match = matches.find((m) => m.week === stat.week);
    if (match) {
      if (match.localTeamID === playerTeamID) {
        totalLocalPoints += stat.totalPoints ?? 0;
        localGamesCount++;
      } else if (match.visitorTeamID === playerTeamID) {
        totalVisitorPoints += stat.totalPoints ?? 0;
        visitorGamesCount++;
      }
    }
  });
  
  

  return {
    totalLocalPoints,
    totalVisitorPoints,
    averageLocalPoints:
      localGamesCount > 0 ? totalLocalPoints / localGamesCount : 0,
    averageVisitorPoints:
      visitorGamesCount > 0 ? totalVisitorPoints / visitorGamesCount : 0,
  };
};
