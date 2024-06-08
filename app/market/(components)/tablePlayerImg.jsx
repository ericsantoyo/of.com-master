import Image from "next/image";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import RectangleRoundedIcon from "@mui/icons-material/RectangleRounded";
import HelpIcon from "@mui/icons-material/Help";

export default (props) => {
  const player = props.value;
  const playerImage = player.playerID;
  const isPlayerInjured = player.status === "injured";
  const isPlayerSuspended = player.status === "suspended";
  const isPlayerDoubtful = player.status === "doubtful";

  return (
    <div className="flex justify-start items-start relative">
      <div className="relative w-10 h-10 overflow-hidden ">
        <Image
          src={player.image}
          alt={player.nickname}
          layout="fill"
          objectFit="cover"
          objectPosition="top" 
       

        />
      </div>
      {isPlayerInjured && (
        <LocalHospitalIcon
          className="absolute z-10 right-0 text-base text-red-500"
          style={{ fontSize: 12 }}
        />
      )}
      {isPlayerSuspended && (
        <RectangleRoundedIcon
          className="absolute z-10 right-0 text-red-500 -rotate-90 text-base"
          color="inherit"
          style={{ fontSize: 12 }}
        />
      )}
      {isPlayerDoubtful && (
        <HelpIcon
          className="absolute z-10 right-0 text-base text-yellow-500"
          color="inherit"
          style={{ fontSize: 12 }}
        />
      )}
    </div>
  );
};
