import React from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ImagePreview from './ImagePreview'
import FilePreview from './FilePreview'
import { Badge } from '@/components/ui/badge'

type Props = {
  fromCurrentUser: boolean
  senderImage: string
  senderName: string
  lastByUser: boolean
  content: string[]
  createdAt: number
  type: string
  seen?: React.ReactNode
}

function Message({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  type,
  seen,
}: Props) {
  const formatTime = (timestamp: number) => {
    return format(timestamp, 'HH:MM')
  }
  return (
    <div
      className={cn('flex items-end', {
        'justify-end': fromCurrentUser,
      })}
    >
      <div
        className={cn('flex flex-col w-full mx-2', {
          'order-1 items-end': fromCurrentUser,
          'order-2 items-start': !fromCurrentUser,
        })}
      >
        <div
          className={cn('px-4 py-2 rounded-lg max-w-[70%]', {
            'bg-primary text-primary-foreground': fromCurrentUser,
            'bg-secondary text-secondary-foreground': !fromCurrentUser,
            'rounded-br-none': !lastByUser && fromCurrentUser,
            'rounded-bl-none': !lastByUser && !fromCurrentUser,
          })}
        >
          {type === 'text' ? (
            <p className='text-wrap break-words whitespace-pre-wrap break-all'>
              {content}
            </p>
          ) : type === 'image' ? (
            <ImagePreview urls={content} />
          ) : type === 'file' ? (
            <FilePreview url={content[0]} />
          ) : type === 'call' ? (
            <Badge variant='secondary' className='w-fit'>
              Joined Call at {formatTime(createdAt)}
            </Badge>
          ) : null}
          <p
            className={cn('text-xs flex w-full my-1', {
              'text-primary-foreground justify-end': fromCurrentUser,
              'text-secondary-foreground justify-start': !fromCurrentUser,
            })}
          >
            {formatTime(createdAt)}
          </p>
        </div>
        {seen}
      </div>
      <Avatar
        className={cn('relative h-8 w-8', {
          'order-2': fromCurrentUser,
          'order-1': !fromCurrentUser,
          invisible: lastByUser,
        })}
      >
        <AvatarImage
          className='w-full h-full rounded-full'
          src={senderImage}
          alt={senderName}
        />
        <AvatarFallback>{senderName.substring(0, 1)}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default Message
