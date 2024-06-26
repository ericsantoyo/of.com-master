"use client"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/actions/categoryActions";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  category: z.string(),
})

export default function Category() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
    }
  })




  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await createCategory(data?.category)
      toast("Category has been created")
      form.reset()
      return response
    } catch (error) {
      console.log('error', error)
      return error
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[600px] mt-[0.5rem] space-y-3">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter a category</FormLabel>
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" size="sm">Submit</Button>
            </div>
          </form>
        </Form>

      </div>
    </main>
  )
}