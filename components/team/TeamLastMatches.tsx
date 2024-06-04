import { Card } from "@/components/ui/card";
import { getCurrentWeek, slugById } from "@/utils/utils";
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import FlightIcon from "@mui/icons-material/Flight";

interface Props {
  matches: any;
  selectedTeam: number;
  howMany: number;
}

const TeamLastMatches = ({ matches, selectedTeam, howMany }: Props) => {
  const teamMatches = matches;
  const currentWeek = getCurrentWeek(teamMatches);

  // Helper function to determine the match result
  const getMatchResult = (match) => {
    if (match.localTeamID === selectedTeam) {
      if (match.localScore > match.visitorScore) return "✓";
      if (match.localScore < match.visitorScore) return "✕";
    } else {
      if (match.visitorScore > match.localScore) return "✓";
      if (match.visitorScore < match.localScore) return "✕";
    }
    return "="; // This means it's a tie
  };

  // Function to determine card background color based on match result
  const cardBackgroundColor = (matchResult) => {
    switch (matchResult) {
      case "✓":
        return " bg-green-600 text-white"; // Green for win
      case "✕":
        return " bg-red-600 text-white"; // Red for loss
      case "=":
        return " bg-orange-500 text-white"; // Orange for tie
      default:
        return "bg-transparent"; // Default background
    }
  };

  // Filter to get only past matches and sort them in ascending order by week
  const pastMatchesSorted = teamMatches
    .filter((match) => match.week < getCurrentWeek(teamMatches))
    .sort((a, b) => a.week - b.week);

  // Slice the last 'howMany' matches from the sorted array
  const lastMatchesToShow = pastMatchesSorted.slice(-howMany);

  return (
    <Card className="z-30 flex flex-row justify-end items-center gap-1 px-1.5 py-0.5 md:px-0.5 backdrop-blur-md bg-white/30">
      {lastMatchesToShow.map((match) => (
        <div
          key={match.matchID}
          className={`flex flex-col justify-between items-center bg-transparent text-xs text-center  `}
        >
          <p
            className={`font-semibold text-[12px] uppercase text-center w-4 my-1 rounded ${cardBackgroundColor(
              getMatchResult(match)
            )}`}
          >
            {getMatchResult(match)}
          </p>
          <div className="hidden md:flex">
            {match.localTeamID !== selectedTeam ? (
              <Image
                src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                alt="home"
                width={24}
                height={24}
                style={{ objectFit: "contain" }}
                className="h-4  "
              />
            ) : (
              <Image
                src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                alt="visitor"
                width={24}
                height={24}
                style={{ objectFit: "contain" }}
                className="h-4  "
              />
            )}
          </div>
          <div className="flex">
            <p className="text-[10px] font-semibold text-center">J</p>
            <p className="text-[10px] font-semibold text-center">{match.week}</p>
          </div>
          {/* <div className="">
                  {match.localTeamID !== selectedTeam ? (
                    <FlightIcon className="rotate-45" />
                  ) : (
                    <HomeIcon />
                  )}
                </div> */}
        </div>
      ))}
    </Card>
  );
};

export default TeamLastMatches;
