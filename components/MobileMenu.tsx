import { Card } from "@/components/ui/card";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Link from "next/link";
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';


export default function MobileMenu() {
  return (
    <Card className="z-50 fixed bottom-0 right-0 left-0 w-full rounded-none shadow-none h-[66px] 	 md:hidden ">
      <div className="flex flex-row justify-between items-center w-full h-full px-6">
        <Link href="/market" className="flex flex-col justify-center items-center">
          <QueryStatsIcon className="text-neutral-800" sx={{ fontSize: 32 }} />
          <p className="text-xs">Mercado</p>
        </Link>
        <Link href="/news" className="flex flex-col justify-center items-center">
          <NewspaperIcon className="text-neutral-800" sx={{ fontSize: 32 }} />
          <p className="text-xs">Noticias</p>
        </Link>
        <Link href="/stats" className="flex flex-col justify-center items-center">
          <TroubleshootIcon className="text-neutral-800" sx={{ fontSize: 32 }} />
          <p className="text-xs">Stats</p>
        </Link>
        <Link href="/calendar" className="flex flex-col justify-center items-center">
          <CalendarMonthIcon className="text-neutral-800" sx={{ fontSize: 32 }} />
          <p className="text-xs">Calendario</p>

        </Link>
        <Link href="/myteams" className="flex flex-col justify-center items-center">
        <AssignmentIndIcon className="text-neutral-800" sx={{ fontSize: 32 }} />
          <p className="text-xs">MyTeam</p>
        </Link>
      </div>
    </Card>
  );
}

