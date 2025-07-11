"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DmConversations from "./_components/DmConversations";
type Props = React.PropsWithChildren<{}>;

function ConversationsLayout({ children }: Props) {
  const conversations = useQuery(api.conversations.get);
  return (
    <>
      <ItemList title="Conversations">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              You don&apos;t have any conversations
            </p>
          ) : (
            conversations.map((conversations) => {
              return conversations.conversation.isGroup ? null : (
                <DmConversations
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  imageUrl={conversations.otherMembers?.imageUrl ?? ""}
                  username={conversations.otherMembers?.username ?? ""}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  );
}

export default ConversationsLayout;
