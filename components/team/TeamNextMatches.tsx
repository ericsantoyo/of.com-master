import { Card } from "@/components/ui/card";
import { getCurrentWeek, slugById } from "@/utils/utils";
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import FlightIcon from "@mui/icons-material/Flight";

interface Props {
  matches: any;
  selectedTeam: number;
  dateClass: string;
  howMany: number;
  pClass: string;
}

const TeamNextMatches = ({
  matches,
  selectedTeam,
  dateClass,
  howMany,
  pClass,
}: Props) => {
  const teamMatches = matches;
  const currentWeek = getCurrentWeek(teamMatches);
  // console.log(currentWeek);

  return (
    <div className="z-30 flex flex-col min-w-fit h-full">
      <p
        className={`${pClass}  text-center text-xs uppercase font-semibold mb-2`}
      >
        Próximos...
      </p>
      <Card className="py-2 flex flex-row justify-between items-center h-full md:gap-2 backdrop-blur-sm bg-white/30">
        {/* Display matches for the selected week */}
        {teamMatches
          .filter(
            (match) =>
              match.week >= currentWeek && match.week <= currentWeek + howMany - 1
          )
          .sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate))
          .map((match) => (
            <Card
              key={match.matchID}
              className="flex flex-col w-12 justify-between items-center border-none shadow-none h-full text-xs text-center rounded gap-1 bg-transparent "
            >
              <div className="text-center font-bold text-[11px]">
                J{match.week}
              </div>
              {match.localTeamID !== selectedTeam && (
                <Image
                  src={`/teamLogos/${slugById(match.localTeamID)}.png`}
                  alt="home"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                  className="h-5 md:h-6 "
                />
              )}

              {match.visitorTeamID !== selectedTeam && (
                <Image
                  src={`/teamLogos/${slugById(match.visitorTeamID)}.png`}
                  alt="visitor"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                  className="h-5 md:h-6 "
                />
              )}

              <p
                className={`${dateClass} font-semibold text-[10px] uppercase text-center`}
              >
                {new Date(match.matchDate).toLocaleDateString("es-EU", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="w-5 h-5  flex justify-center items-center">
                {match.localTeamID !== selectedTeam ? (
                  <FlightIcon fontSize="small" className="rotate-45" />
                ) : (
                  <HomeIcon fontSize="small" />
                )}
              </div>
            </Card>
          ))}
      </Card>
    </div>
  );
};

export default TeamNextMatches;
