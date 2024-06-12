"use client"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { deleteDocument } from '@/actions/articlesActions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteDocument({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button>Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your document?
          </DialogDescription>
        </DialogHeader>
        <Button type="submit" onClick={async () => {
          try {
            const response = await deleteDocument(documentId)
            console.log('response', response)
            setOpen(false)
            router.push("/dashboard/documents")
            return response
          } catch (error) {
            console.log('error', error)
            return error
          }
        }}>Delete</Button>
      </DialogContent>
    </Dialog>)
}
