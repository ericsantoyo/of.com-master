"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCategory, getAllCategories } from "@/actions/categoryActions";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DashboardPagination from "../(components)/DashboadPagination";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  category: z.string(),
});

export default function Category() {
  const [categories, setCategories] = useState([]);

  //get all categories
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    fetchUsers();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await createCategory(data?.category);
      toast("Category has been created");
      form.reset();
      return response;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  }

  return (
    <main className="flex w-full p-4 flex-col items-center justify-between ">
      <div className="flex flex-col mb-[5rem] w-full">
        <h1 className=" text-3xl font-semibold tracking-tight">
          Create a Category
        </h1>
        <p className="leading-7 text-sm dark:text-gray-400">
          Categories help organize your blogs
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-[600px] mt-[0.5rem] space-y-3"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter a category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" size="sm">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <main className="flex w-full flex-col items-start p-4 justify-between ">
        <div className=" w-full">
          <h1 className="scroll-m-20 font-semibold tracking-tight text-2xl">
            Categorias:
          </h1>
          {categories?.length ? (
            <div className="flex flex-col">
              <div className="p-2 w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories?.map((info) => (
                  <article
                    key={info?.id}
                    className="relative isolate flex flex-col gap-1 rounded-xl h-full w-full border hover:shadow-2xl hover:shadow-neutral-500/50 transition-shadow duration-300 "
                  >
                    <div className="flex flex-row w-full justify-center items-center">
                      <h2 className="text-lg font-bold line-clamp-2">
                        {info?.category}
                      </h2>
                    </div>
                  </article>
                ))}
              </div>
              {/* {totalPages > 1 && (
                <DashboardPagination
                  page={page}
                  totalPages={totalPages}
                  baseUrl="/dashboard"
                  pageUrl="?page="
                />
              )} */}
            </div>
          ) : (
            <main className="flex flex-col gap-2 lg:gap-2 min-h-[30vh] w-full">
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    You have no articles
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Articles will show here once you&apos;ve published articles
                  </p>
                </div>
              </div>
            </main>
          )}
        </div>
      </main>
    </main>
  );
}
