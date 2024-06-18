import Documents from "./(components)/Documents";
import CreateDocument from "../(components)/CreateDocument";
import DashboardPagination from "../(components)/DashboadPagination";
import { getAllDocumentsWithPagination } from "@/actions/get-all-documents-with-pagination";
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
import { Pencil, Eye, Timer } from "lucide-react";
import DeleteDocument from "../(components)/DeleteDocument";

interface DocumentsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DocumentsPage({
  searchParams,
}: DocumentsPageProps) {
  const { data, totalPages, page } = await getAllDocumentsWithPagination(
    searchParams
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-end">
        <CreateDocument />
      </div>
      {data?.length ? (
        <div className="flex flex-col">
          <Table className="w-full ">
            <TableHeader>
              <TableRow className="">
                <TableHead className="  text-center ">Titulo</TableHead>
                <TableHead className=" text-center ">Fecha</TableHead>
                <TableHead className=" text-center ">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="p-0 m-0 ">
              {data.map((document) => (
                <TableRow key={document.id} className="">
                  <TableCell className="grow px-0 mx-0">
                    <Link
                      className=""
                      href={`/dashboard/documents/${document?.document_id}`}
                    >
                      <p className="text-sm md:text-sm font-semibold truncate pl-2">
                        {document.title}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="grow-0  bg-neutral-100 border-x-2 text-center px-0 mx-0 ">
                    <div className="flex justify-center items-center text-xs text-muted-foreground gap-1	">
                      <Timer className="w-4 h-4" />
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-1 ">
                        <p className="leading-none	">
                          {new Date(document?.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className="leading-none	">
                          {new Date(document?.created_at!)?.toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="grow-0 text-center px-0 mx-0   ">
                    <div className="flex flex-row justify-center items-center gap-2 md:gap-4 shrink-0 ">
                      <Link
                        href={`/dashboard/documents/${document?.document_id}`}
                        className=""
                      >
                        <Button variant={"blue"} size={"icon"} className="">
                          <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                      </Link>
                      {/* <Delete id={document.document_id} /> */}
                      <DeleteDocument documentId={document.document_id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <DashboardPagination
              page={page}
              totalPages={totalPages}
              baseUrl="/dashboard/documents"
              pageUrl="?page="
            />
          )}
        </div>
      ) : (
        <main className="flex flex-col gap-2 lg:gap-2 min-h-[80vh] w-full">
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no documents
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Documents will show here once you&apos;ve created documents
              </p>
              <CreateDocument />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
