import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Id } from '@/convex/_generated/dataModel'
import { User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
  id: Id<'conversations'>
  imageUrl: string
  username: string
  lastMessageSender?: string
  lastMessageContent?: string
  unseenCount?: number
}

function DmConversations({
  id,
  imageUrl,
  username,
  lastMessageContent,
  lastMessageSender,
  unseenCount,
}: Props) {
  return (
    <Link href={`/conversations/${id}`} className='w-full'>
      <Card className='p-2 flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-4 truncate'>
          <Avatar>
            <AvatarImage className='w-12 h-auto rounded-full' src={imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col truncate'>
            <h4 className='truncate'>{username}</h4>
            {lastMessageSender && lastMessageContent ? (
              <span className='text-sm text-muted-foreground flex truncate overflow-ellipsis'>
                <span className='font-semibold'>
                  {lastMessageSender} {':'}&nbsp;
                </span>
                <span className='truncate overflow-ellipsis'>
                  {lastMessageContent}
                </span>
              </span>
            ) : (
              <p className='text-sm text-muted-foreground truncate'>
                Start typing your message now!
              </p>
            )}
          </div>
        </div>
        {unseenCount ? <Badge className=''>{unseenCount}</Badge> : null}
      </Card>
    </Link>
  )
}

export default DmConversations
