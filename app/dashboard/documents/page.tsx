
import Documents from "./(components)/Documents";
import CreateDocument from "../(components)/CreateDocument";
import DashboardPagination from "../(components)/DashboadPagination";
import { getAllDocumentsWithPagination } from "@/actions/get-all-documents-with-pagination";

interface DocumentsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DocumentsPage({
  searchParams,
}: DocumentsPageProps) {
  const { data, totalPages, page } = await getAllDocumentsWithPagination(searchParams);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <CreateDocument />
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data?.length ? (
        <div className="flex flex-col">
          <div className="p-2 w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((info) => (
              <Documents key={info?.id} info={info} />
            ))}
          </div>
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
