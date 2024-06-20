import { slugByName } from "@/utils/utils";
import Image from "next/image";

export default (props) => {
  const cellValue = props.value;

  const teamSlug = slugByName({ name: cellValue });

  return (
    <div className="flex justify-center items-center h-full w-auto">
      <div style={{ height: "20px", width: "20px", position: "relative" }}>
        <Image
          src={`/teamLogos/${teamSlug}.png`}
          alt="Logo"
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 20px, (max-width: 1200px) 20px, 20px"
        />
      </div>
    </div>
  );
};
