'use client'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { useMutationState } from '@/hooks/useMutationState'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'

type Props = {
  conversationId: Id<'conversations'>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const RemoveFriendDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: removeFriend, pending } = useMutationState(api.friend.remove)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Handle body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, setOpen])

  const handleRemoveFriend = async () => {
    try {
      await removeFriend({
        conversationId,
        type: 'Remove friend',
        content: [],
      })
      toast.success('removed friend')
      setOpen(false)
    } catch (error) {
      toast.error(
        error instanceof ConvexError
          ? error.data
          : 'An error occurred while removing the friend'
      )
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false)
    }
  }

  if (!open) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-200'
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <div
        className='relative w-full max-w-lg mx-4 bg-background rounded-lg shadow-lg border animate-in zoom-in-95 slide-in-from-bottom-2 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleCancel}
          disabled={pending}
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </button>

        {/* Content */}
        <div className='flex flex-col space-y-2 text-center sm:text-left p-6'>
          {/* Header */}
          <div className='space-y-2'>
            <h2 className='text-lg font-semibold'>Are you absolutely sure?</h2>
            <p className='text-sm text-muted-foreground'>
              This action cannot be undone. All messages will be deleted and you
              will not be able to message this user. All group chats will still
              work as normal.
            </p>
          </div>

          {/* Footer */}
          <div className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4'>
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={pending}
              className='mt-2 sm:mt-0'
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleRemoveFriend}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className='animate-spin h-4 w-4 mr-2' />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveFriendDialog
