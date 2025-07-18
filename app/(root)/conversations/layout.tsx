'use client'
import ItemList from '@/components/shared/item-list/ItemList'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import DmConversations from './_components/DmConversations'
import CreateGroupDialog from './dialogs/CreateGroupDialog'
import GroupConversationItem from './_components/GroupConversationItem'
type Props = React.PropsWithChildren<{
  children: React.ReactNode
}>

function ConversationsLayout({ children }: Props) {
  const conversations = useQuery(api.conversations.get)
  return (
    <>
      <ItemList title='Conversations' action={<CreateGroupDialog />}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className='w-full h-full flex items-center justify-center'>
              You don&apos;t have any conversations
            </p>
          ) : (
            conversations.map((conversations) => {
              return conversations.conversation.isGroup ? (
                <GroupConversationItem
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  name={conversations.conversation.name || ''}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                  unseenCount={conversations.unseenCount}
                />
              ) : (
                <DmConversations
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  imageUrl={conversations.otherMembers?.imageUrl ?? ''}
                  username={conversations.otherMembers?.username ?? ''}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                  unseenCount={conversations.unseenCount}
                />
              )
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  )
}

export default ConversationsLayout
