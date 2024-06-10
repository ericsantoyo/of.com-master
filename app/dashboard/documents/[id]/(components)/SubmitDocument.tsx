import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storeDocument } from "@/actions/articlesActions";
import { useGetDocumentById } from "@/utils/hooks/useGetDocumentById";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SubmitDocument({ html, id, title }: { html: string, id: string, title: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { refetch } = useGetDocumentById(id)
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const result = await storeDocument(data?.title, html, id)

      setLoading(false)
      toast("Article has been submitted, you can publish the article by going to 'Publish Article' tab", {
        description: new Date().toLocaleTimeString(),
        action: {
          label: "Publish",
          onClick: () => router.push("/dashboard/publish"),
        },
      })
      refetch()
      setOpen(false)
      reset()
      return result

    } catch (error) {
      setLoading(false)
      return error
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline">Submit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col items-start gap-4">
            <Label className="text-right">
              Name
            </Label>
            <Input
              {...register("title")}
              defaultValue={title}
              className="col-span-3"
            />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
