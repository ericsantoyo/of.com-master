import { Button } from "@/components/ui/button";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Link from "next/link";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import GamesSheet from "../GamesSheet";
import GamesIcon from "./GamesIcon";
import SearchBox from "./SearchBox";
import Logo from "./Logo";
import SocialIcons from "./SocialIcons";

type Props = {};

export default function TopBar(props: Props) {
  const handleSearch = (query: string) => {};

  return (
    <>
      <div
        className="
        container flex justify-between items-center 
        mx-auto max-w-6xl w-full flex-nowrap 
        "
      >
        {/* --- GAMES & SEARCH ICONS --- */}
        <div className="md:order-2 shrink-0 md:ml-2">
          <div className="shrink-0 flex justify-between items-center ">
            {/* <SearchBox divClassName="hidden" /> */}
            <div className="md:ml-2">
              <Sheet>
                <SheetTrigger asChild>
                  <GamesIcon className="" />
                </SheetTrigger>
                <SheetContent className=" w-[350px] h-full p-0 flex flex-col bg-neutral-50 shadow-lg shadow-neutral-300">
                  <GamesSheet />
                </SheetContent>
              </Sheet>
            </div>
            <SearchBox divClassName="md:order-first ml-2 md:ml-0" />
          </div>
        </div>

        {/* --- LOGO --- */}
        <div className="md:flex-shrink-0 md:grow md:order-first shrink-0">
          <Logo className="" />
        </div>

        {/* --- SOCIAL ICONS --- */}
        <SocialIcons className=" shrink-0 flex justify-between items-center gap-2" />

        {/* MENU WITH TEXT AND ICONS */}
        <div className="hidden md:flex order-last md:order-first mr-8 justify-between items-center  md:gap-2 lg:gap-6  flex-nowrap font-semibold ">
          {/* MARKET BUTTON */}
          <Link
            href="/market"
            className="group w-16 flex flex-col justify-center items-center"
          >
            <p className="transition-all text-transparent text-center text-[8px] p-0 m-0">
              _______
            </p>
            <Button
              variant="ghost"
              size={"icon"}
              aria-label="search"
              className="my-0.5"
            >
              <QueryStatsIcon
                className="text-neutral-800 "
                sx={{ fontSize: 36 }}
              />
            </Button>

            <p className="transition-all group-hover:text-inherit text-transparent text-center text-[14px] p-0 m-0">
              Mercado
            </p>
          </Link>

          {/* NEWS BUTTON */}
          <Link
            href="/news"
            className="group w-16 flex flex-col justify-center items-center"
          >
            <p className="transition-all text-transparent text-center text-[8px] p-0 m-0">
              _______
            </p>
            <Button
              variant="ghost"
              size={"icon"}
              aria-label="search"
              className="my-0.5"
            >
              <NewspaperIcon
                className="text-neutral-800"
                sx={{ fontSize: 36 }}
              />
            </Button>

            <p className="transition-all group-hover:text-inherit text-transparent text-center text-[14px] p-0 m-0">
              Noticias
            </p>
          </Link>

          {/* STATS BUTTON */}
          <Link
            href="/stats"
            className="group w-16 flex flex-col justify-center items-center"
          >
            <p className="transition-all text-transparent text-center text-[8px] p-0 m-0">
              _______
            </p>
            <Button
              variant="ghost"
              size={"icon"}
              aria-label="search"
              className="my-0.5"
            >
              <QueryStatsIcon
                className="text-neutral-800"
                sx={{ fontSize: 36 }}
              />
            </Button>

            <p className="transition-all group-hover:text-inherit text-transparent text-center text-[14px] p-0 m-0">
              Stats
            </p>
          </Link>

          {/* STATS BUTTON */}
          <Link
            href="/calendar"
            className="group w-16 flex flex-col justify-center items-center"
          >
            <p className="transition-all text-transparent text-center text-[8px] p-0 m-0">
              _______
            </p>
            <Button
              variant="ghost"
              size={"icon"}
              aria-label="search"
              className="my-0.5"
            >
              <CalendarMonthIcon
                className="text-neutral-800"
                sx={{ fontSize: 36 }}
              />
            </Button>

            <p className="transition-all group-hover:text-inherit text-transparent text-center text-[14px] p-0 m-0">
              Calendario
            </p>
          </Link>

          {/* MYTEAM BUTTON */}
          <Link
            href="/myteams"
            className="group w-16 flex flex-col justify-center items-center"
          >
            <p className="transition-all text-transparent text-center text-[8px] p-0 m-0">
              _______
            </p>
            <Button
              variant="ghost"
              size={"icon"}
              aria-label="search"
              className="my-0.5"
            >
              <AssignmentIndIcon
                className="text-neutral-800"
                sx={{ fontSize: 36 }}
              />
            </Button>

            <p className="transition-all group-hover:text-inherit text-transparent text-center text-[14px] p-0 m-0">
              MyTeam
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
