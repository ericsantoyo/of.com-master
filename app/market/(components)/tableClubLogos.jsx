import { slugByName } from "@/utils/utils";
import Image from "next/image";

export default (props) => {
  const cellValue = props.value;

  const teamSlug = slugByName({ name: cellValue });

  return (
    <div className="flex justify-center items-center h-full ">
      <Image
        className="h-5 w-auto "
        src={`/teamLogos/${teamSlug}.png`}
        alt="Logo"
        width={20}
        height={20}
      />
    </div>
  );
};
