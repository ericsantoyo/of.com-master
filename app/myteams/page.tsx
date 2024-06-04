import { createClient } from "@/utils/supabase/server";
import { getMySquads } from "@/utils/supabase/functions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SupabaseClient } from "@supabase/supabase-js";
import { Pencil, Eye } from "lucide-react";
import AuthButton from "@/components/AuthButton";

import React from "react";
import Delete from "@/components/myTeam/Delete";

const getUserEmail = async (supabase: SupabaseClient<any, "public", any>) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return user.email;
};

export default async function MyTeamsPage() {
  const supabase = createClient();
  const email = await getUserEmail(supabase);

  if (!email) {
    return redirect("/login");
  }

  try {
    const { mySquads } = await getMySquads(email);

    return (
      <div className="flex flex-col justify-start items-center max-w-2xl mx-auto gap-4">
        <Card className="transition-all flex flex-row justify-between items-center  w-full text-sm  ">
          <div className="flex flex-row justify-between items-center gap-2 w-full ">
            <h1 className="text-lg font-semibold text-center whitespace-nowrap my-2 mx-4">
              MyTeams Fantasy
            </h1>

            <div className="flex justify-end w-full">
              <AuthButton />
            </div>
          </div>
        </Card>

        <Link className="flex justify-end  w-full" href="/squads">
          <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md w-full md:w-fit mx-1">
            + Crear Equipo
          </button>
        </Link>

        <Card className="flex flex-col justify-start items-start  w-full  ">
          <Table className="w-full ">
            <TableHeader>
              <TableRow className="">
                <TableHead className=" text-center ">Nombre</TableHead>
                <TableHead className=" text-center">#</TableHead>
                <TableHead className=" text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="p-0 m-0">
              {mySquads.map((squad) => (
                <TableRow key={squad.squadID} className="">
                  <TableCell className=" text-center">
                    <Link className="" href={`/myteams/${squad.squadID}`}>
                      <span className="text-sm md:text-sm font-semibold whitespace-nowrap	">
                        {squad.squadName}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className=" bg-neutral-100 border-x-2 text-center">
                    <span className="">
                      {Array.isArray(squad.playersIDS)
                        ? squad.playersIDS.length
                        : 0}
                      <span className="font-semibold">/26</span>
                    </span>
                  </TableCell>
                  <TableCell className=" text-center ">
                    <div className="flex flex-row justify-center items-center gap-2 md:gap-4 shrink-0 ">
                      <Link
                        href={`myteams/${squad.squadID}`}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold rounded p-2"
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                      </Link>
                      <Link
                        href={`squads/${squad.squadID}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded p-2"
                      >
                        <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                      </Link>
                      <Delete id={squad.squadID} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="flex flex-col justify-center items-center">
        <p className="text-red-500">
          Failed to load squads. Please try again later.
        </p>
      </div>
    );
  }
}
