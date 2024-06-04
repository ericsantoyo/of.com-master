import Image from "next/image";
import Link from "next/link";
import { clubIcons } from "@/constants";

interface ClubIcon {
  badgeColor: string;
  name: string;
  id: string;
  shortName: string;
  slug: string;
  dspId: number;
}

type Props = {};

export default function ClubIcons(props: Props) {
  return (
    <div className="flex justify-center items-center flex-wrap px-1  pb-1">
      <ul className="flex-wrap pl-0 pr-0 py-1 list-none flex justify-center items-center">
        {clubIcons.map((club: ClubIcon) => {
          return (
            <li
              key={club.id}
              className="
              hover:rounded-md 
              hover:shadow-inner
              hover:shadow-neutral-500 
              hover:dark:shadow-inner 
              hover:dark:bg-neutral-500/50 
              hover:dark:shadow-neutral-900
              h-12 w-12 flex justify-center items-center
            "
            >
              <Link className="" href={`/team/${club.id}`}>
                <div className="flex justify-center items-center ">
                  <Image
                    src={club.badgeColor}
                    alt={club.shortName}
                    width={98}
                    height={98}
                    style={{
                      objectFit: "contain",
                      width: "auto",
                    }}
                    className="h-12  p-[6px]"
                    priority
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
