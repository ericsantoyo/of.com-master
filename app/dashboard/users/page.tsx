import { fetchAllUserRoles, fetchAllUsers } from "@/actions/usersActions";
import { getAllUsers } from "@/utils/supabase/functions";
import { User } from "lucide-react";
import Link from "next/link";
import UserList from "../(components)/UserList";

export default async function Users() {
  const response = await fetchAllUsers();
  const response2 = await fetchAllUserRoles();

  return (
    <main className="flex min-w-screen p-4 flex-col items-center justify-between w-full">
      <pre>{JSON.stringify(response2, null, 2)}</pre>
      <div className="flex mb-[1.5rem] w-full justify-between items-center">
        <h1 className=" text-3xl font-semibold tracking-tight">Users(s)</h1>
      </div>
      <UserList />
      {response?.length > 0 ? (
        <div className="flex flex-wrap  gap-2 w-full mt-6">
          {response?.map((user) => (
            <Link
              key={user?.id}
              href={`/cms/users/${user?.user_id}`}
              prefetch={true}
              className="flex flex-col border dark:border-zinc-800 border-zinc-200 rounded-md w-[350px] hover:cursor-pointer hover:shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300"
            >
              <div className="flex flex-col px-[1rem] justify-between h-full py-[1rem]">
                <div className="flex flex-col w-full justify-center items-startxw">
                  <h2 className="text-lg font-bold">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-gray-400 pt-1 text-sm">{user?.email}</p>
                  <p className="text-gray-400 pt-1 text-sm"> {user?.user_id}</p>
                </div>
                <div className="flex justify-between mt-2 items-center w-full">
                  <p className="text-xs text-muted-foreground ">
                    {new Date(user?.created_at)?.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <main className="flex flex-col gap-2 lg:gap-2 min-h-[80vh] w-full">
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no site
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Site(s) will show here once you&apos;ve created a site
              </p>
            </div>
          </div>
        </main>
      )}
    </main>
  );
}
