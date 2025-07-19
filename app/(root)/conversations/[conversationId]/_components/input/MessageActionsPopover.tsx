'use client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PopoverClose } from '@radix-ui/react-popover'
import { PlusCircle, Smile } from 'lucide-react'
import React, { SetStateAction, useState } from 'react'
import UploadFileDialog from '../../../dialogs/UploadFileDialog'
type props = { setEmojiPickerOpen: (value: SetStateAction<boolean>) => void }
function MessageActionsPopover({ setEmojiPickerOpen }: props) {
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false)
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false)
  return (
    <Popover>
      <PopoverContent className='w-full mb-1 flex flex-col gap-2'>
        <UploadFileDialog
          open={uploadFileDialogOpen}
          toggle={(value) => setUploadFileDialogOpen(value)}
          type='file'
        />
        <UploadFileDialog
          open={uploadImageDialogOpen}
          toggle={(value) => setUploadImageDialogOpen(value)}
          type='image'
        />
        <PopoverClose asChild>
          <button
            className='inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
            onClick={() => setEmojiPickerOpen(true)}
          >
            <Smile className='h-4 w-4' />
            <span className='sr-only'>Add Emoji</span>
          </button>
        </PopoverClose>
      </PopoverContent>
      <PopoverTrigger asChild>
        <Button size='icon' variant='secondary'>
          <PlusCircle />
        </Button>
      </PopoverTrigger>
    </Popover>
  )
}

export default MessageActionsPopover
