'use client'
import { Id } from '@/convex/_generated/dataModel'
import ConversationContainer from '@/components/shared/conversation/ConversationContainer'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2 } from 'lucide-react'
import Header from './_components/Header'
import Body from './_components/body/Body'
import ChatInput from './_components/input/ChatInput'
import { useState, use } from 'react'
import RemoveFriendDialog from '../dialogs/RemoveFriendDialog'
import DeleteGroupDialog from '../dialogs/DeleteGroupDialog'
import LeaveGroupDialog from '../dialogs/LeaveGroupDialog'

interface PageProps {
  params: Promise<{
    conversationId: Id<'conversations'>
  }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
type Props = PageProps
export default function ConversationPage({ params }: Props) {
  const { conversationId } = use(params)
  const conversation = useQuery(api.conversation.get, { id: conversationId })
  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false)
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false)
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false)
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null)

  return conversation === undefined ? (
    <div className='w-full h-full flex items-center justify-center'>
      <Loader2 className='h-8 w-8' />
    </div>
  ) : conversation === null ? (
    <p className='w-full h-full flex items-center justify-center'>
      Conversation not found
    </p>
  ) : (
    <ConversationContainer>
      <RemoveFriendDialog
        conversationId={conversationId}
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
      />
      <LeaveGroupDialog
        conversationId={conversationId}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      />
      <DeleteGroupDialog
        conversationId={conversationId}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <Header
        name={
          (conversation.isGroup
            ? conversation.name
            : conversation.otherMember?.username) ?? ''
        }
        imageUrl={
          conversation.isGroup ? undefined : conversation.otherMember?.imageUrl
        }
        options={
          conversation.isGroup
            ? [
                {
                  label: 'Leave Group',
                  destructive: false,
                  onClick: () => setLeaveGroupDialogOpen(true),
                },
                {
                  label: 'Delete Group',
                  destructive: true,
                  onClick: () => setDeleteGroupDialogOpen(true),
                },
              ]
            : [
                {
                  label: 'Remove Friend',
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
        setCallType={setCallType}
      />
      <Body
        members={
          conversation.isGroup
            ? conversation.otherMembers
              ? conversation.otherMembers
              : []
            : conversation.otherMember
              ? [conversation.otherMember]
              : []
        }
        callType={callType}
        setCallType={setCallType}
      />
      <ChatInput />
    </ConversationContainer>
  )
}
