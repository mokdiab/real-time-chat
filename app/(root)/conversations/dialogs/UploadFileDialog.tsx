'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useConversation } from '@/hooks/useConversation'
import { useMutationState } from '@/hooks/useMutationState'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { File, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import Uploader from '@/components/shared/Uploader'
type Props = {
  open: boolean
  toggle: (newState: boolean) => void
  type: 'file' | 'image'
}
const uploadFileSchema = z.object({
  files: z
    .string()
    .array()
    .min(1, { message: 'You must select at least 1 file' }),
})
type UploadFileSchema = z.infer<typeof uploadFileSchema>
function UploadFileDialog({ open, toggle, type }: Props) {
  const form = useForm<UploadFileSchema>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: { files: [] },
  })
  const { conversationId } = useConversation()
  const files = form.watch('files')
  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  )
  const handleSubmit = (values: UploadFileSchema) => {
    if (!values.files || values.files.length === 0) {
      form.setError('files', {
        type: 'manual',
        message: 'Please select at least one file',
      })
      return
    }

    createMessage({
      content: values.files,
      conversationId,
      type,
    })
      .then(() => {
        form.reset()
        toggle(false)
      })
      .catch((error) => {
        console.error('Error uploading file:', error)
        toast.error(
          error instanceof ConvexError
            ? error.data
            : 'Failed to upload file. Please try again.'
        )
      })
  }
  return (
    <Dialog open={open} onOpenChange={(open) => toggle(open)}>
      <DialogTrigger asChild>
        <Button size='icon' variant='outline'>
          {type === 'file' ? <File /> : <ImageIcon />}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            Upload {type === 'file' ? 'Files' : 'Image'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {type === 'file'
            ? 'Upload images,videos, audio and PDFs! to share with your friends'
            : 'Upload images to share with your friends'}
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex gap-2 items-end w-full'
          >
            <FormField
              control={form.control}
              name='files'
              render={() => {
                return (
                  <FormItem className='h-full w-full'>
                    <FormControl>
                      <div className='py-4'>
                        <Uploader
                          onChange={(urls) => {
                            form.setValue('files', urls, {
                              shouldValidate: true,
                            })
                          }}
                          type={type}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <DialogFooter>
              <Button disabled={!files.length || pending} type='submit'>
                {pending ? 'Sending...' : 'Send'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFileDialog
