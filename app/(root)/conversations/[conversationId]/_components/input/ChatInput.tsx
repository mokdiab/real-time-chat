'use client'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { api } from '@/convex/_generated/api'
import { useConversation } from '@/hooks/useConversation'
import { useMutationState } from '@/hooks/useMutationState'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConvexError } from 'convex/values'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'
import MessageActionsPopover from './MessageActionsPopover'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
const chatMessageSchema = z.object({
  content: z.string().min(1, {
    message: 'Please enter a message',
  }),
})
function ChatInput() {
  const { conversationId } = useConversation()
  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  )
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  //eslint-disable-next-line
  const emojiPickerRef = useRef<any>(null)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const { theme } = useTheme()
  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { content: '' },
  })
  const content = form.watch('content', '')
  //eslint-disable-next-line
  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target
    if (selectionStart !== null) {
      form.setValue('content', value)
      setCursorPosition(selectionStart)
    }
  }
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji
    const newContent =
      content.substring(0, cursorPosition) +
      emoji +
      content.substring(cursorPosition)
    form.setValue('content', newContent)
    setCursorPosition(cursorPosition + emoji.length)
    setEmojiPickerOpen(false)
  }
  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      content: [values.content],
      conversationId,
      type: 'text',
    })
      .then(() => {
        form.reset()
        textareaRef.current?.focus()
      })
      .catch((error) => {
        console.log(error.message)
        toast.error(
          error instanceof ConvexError
            ? error.data
            : 'Unexpected error has occurred'
        )
      })
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <Card className='w-full p-2 rounded-lg relative'>
      <div className='absolute bottom-16' ref={emojiPickerRef}>
        <EmojiPicker
          theme={theme as Theme}
          open={emojiPickerOpen}
          onEmojiClick={handleEmojiClick}
          lazyLoadEmojis
        />
      </div>
      <div className='flex gap-2 items-end w-full'>
        <MessageActionsPopover
          setEmojiPickerOpen={(value) => setEmojiPickerOpen(value)}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex gap-2 items-end w-full'
          >
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => {
                return (
                  <FormItem className='h-full w-full'>
                    <FormControl>
                      <TextareaAutosize
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            await form.handleSubmit(handleSubmit)()
                          }
                        }}
                        rows={1}
                        maxRows={3}
                        {...field}
                        ref={(e) => {
                          field.ref(e)
                          textareaRef.current = e
                        }}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                        placeholder='Type a message...'
                        className='min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <Button disabled={pending} type='submit' size={'icon'}>
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  )
}
export default ChatInput
