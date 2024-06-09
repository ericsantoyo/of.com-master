import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Props {
  
  teamPlayers: players[] | null;
}

const TeamLineup: React.FC<Props> = ({ teamPlayers }) => {
  const teamData = teamPlayers;

  const goalkeepers = teamPlayers
    ?.filter((p) => p.positionID === 1)
    .sort((a, b) => b.points - a.points)
    .slice(0, 1);
  const defenders = teamPlayers
    ?.filter((p) => p.positionID === 2)
    .sort((a, b) => b.points - a.points)
    .slice(0, 4);
  const midfielders = teamPlayers
    ?.filter((p) => p.positionID === 3)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);
  const forwards = teamPlayers
    ?.filter((p) => p.positionID === 4)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  const positions = {
    goalkeepers: [{ top: "89%", left: "50%" }],
    defenders: [
      { top: "63%", left: "15%" },
      { top: "72%", left: "38%" },
      { top: "72%", left: "62%" },
      { top: "63%", left: "85%" },
    ],
    midfielders: [
      { top: "40%", left: "23%" },
      { top: "52%", left: "50%" },
      { top: "40%", left: "78%" },
    ],
    forwards: [
      { top: "22%", left: "20%" },
      { top: "12%", left: "50%" },
      { top: "22%", left: "80%" },
    ],
  };

  const renderPlayers = (players: any[], positionType: string) => {
    return players.map((player, index) => (
      <div
        key={player.playerID}
        className="player flex flex-col items-center justify-center"
        style={{
          position: "absolute",
          top: positions[positionType][index].top,
          left: positions[positionType][index].left,
          transform: "translate(-50%, -50%)",
          width: "84px", 
          height: "84px", 
        }}
      >
        <div
          className="image-container"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <Link href={`/player/${player.playerID}`}>
            <Image
              src={player.image}
              alt={player.name}
              fill={true}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>
        </div>
        <Link href={`/player/${player.playerID}`}>
          <Card className="font-semibold text-center min-w-[72px] px-2 border-none rounded-xs text-base shadow-md shadow-neutral-800 text-neutral-800 backdrop-blur-xl bg-white/50 whitespace-nowrap	">
            {player.nickname.split(" ").slice(-1).join(" ")}
          </Card>
        </Link>
      </div>
    ));
  };

  const aspectRatio = (900 / 600) * 100; // This should be height / width

  return (
    <div className="w-full ">
      <div className="relative max-w-2xl mx-auto min-w-[343px]">
    
        <div className="w-full ">
          <Image
            src="/FieldLineup.png"
            alt="Soccer Field"
            width={600}
            height={900}
            // fill={true}
            // style={{objectFit: "contain"}}
            className=" w-full h-auto"
            priority
          />
        </div>
      

        {goalkeepers && renderPlayers(goalkeepers, "goalkeepers")}
        {defenders && renderPlayers(defenders, "defenders")}
        {midfielders && renderPlayers(midfielders, "midfielders")}
        {forwards && renderPlayers(forwards, "forwards")}
      </div>
    </div>
  );
};

export default TeamLineup;
