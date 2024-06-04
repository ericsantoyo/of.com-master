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
}

export default function PlayerNextMatches({
  matches,
  selectedTeam,
  dateClass,
  howMany,
}: Props) {
  const teamMatches = matches;
  const currentWeek = getCurrentWeek(teamMatches);

  return (
    <Card className="flex flex-row justify-between items-center h-full md:gap-2 backdrop-blur-sm bg-white/30 px-1 py-1.5">
      {teamMatches
        .filter(
          (match: { week: number }) =>
            match.week >= currentWeek && match.week <= currentWeek + howMany - 1
        )
        .sort(
          (
            a: { matchDate: string | number | Date },
            b: { matchDate: string | number | Date }
          ) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
        )
        .map((match: matches) => (
          <Card
            key={match.matchID}
            className="flex flex-col w-7 md:w-8 justify-between items-center border-none shadow-none h-full text-xs text-center rounded bg-transparent gap-1"
          >
            <div className="text-center font-bold text-[11px] md:text-[12px]">
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
              {match.matchDate &&
                new Date(match.matchDate).toLocaleDateString("es-EU", {
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
  );
}
