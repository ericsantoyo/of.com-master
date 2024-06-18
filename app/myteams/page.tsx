import { createClient } from "@/utils/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";
import Delete from "./(components)/DeleteButton";
import AuthButton from "../../components/AuthButton";
import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";

import React from "react";
import { getMySquads } from "@/actions/get-my-squads";

export default async function MyTeamsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const mySquads = await getMySquads();

    return (
      <div className="flex flex-col justify-start items-center max-w-2xl mx-auto gap-4">
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        <Card className="transition-all flex flex-row justify-between items-center  w-full text-sm  ">
          <div className="flex flex-row justify-between items-center gap-2 w-full mx-4 my-2">
            <h1 className="text-lg font-semibold text-center whitespace-nowrap my-2 ">
              MyTeams Fantasy
            </h1>

            <div className="flex justify-end w-full">
              <AuthButton />
            </div>
          </div>
        </Card>

        <Link className="flex justify-end  w-full" href="/myteams/create">
          <Button
            variant={"blue"}
            className=" text-sm rounded-md w-full md:w-fit mx-1"
          >
            + Crear Equipo
          </Button>
        </Link>

        <Card className="flex flex-col justify-start items-start  w-full  ">
          <Table className="w-full ">
            <TableHeader>
              <TableRow className="">
                <TableHead className="  text-center ">Nombre</TableHead>
                <TableHead className=" text-center ">#</TableHead>
                <TableHead className=" text-center ">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="p-0 m-0">
              {mySquads.map((squad) => (
                <TableRow key={squad.squadID} className="">
                  <TableCell className=" max-w-32 ">
                    <Link className="" href={`/myteams/${squad.squadID}`}>
                      <p className="text-sm md:text-sm font-semibold truncate pl-2">
                        {squad.squadName}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className=" bg-neutral-100 border-x-2 text-center shrink ">
                    <span className="">
                      {Array.isArray(squad.playersIDS)
                        ? squad.playersIDS.length
                        : 0}
                      <span className="font-semibold">/26</span>
                    </span>
                  </TableCell>
                  <TableCell className=" text-center shrink   ">
                    <div className="flex flex-row justify-center items-center gap-2 md:gap-4 shrink-0 ">
                      <Link
                        href={`myteams/analize/${squad.squadID}`}
                        className=""
                      >
                        <Button variant={"green"} size={"icon"} className="">
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                      </Link>
                      <Link href={`myteams/edit/${squad.squadID}`} className="">
                        <Button variant={"blue"} size={"icon"} className="">
                          <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
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
