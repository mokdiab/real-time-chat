"use client";
import React from "react";
import ItemList from "@/components/shared/item-list/ItemList";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import AddFriendDialog from "./_components/AddFriendDialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import Request from "./_components/Request";
type Props = {};

export default function FriendsPage({}: Props) {
  const requests = useQuery(api.requests.get);

  return (
    <>
      <ItemList title="Friends" action={<AddFriendDialog />}>
        {requests ? (
          requests.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <p>You don&apos;t have any requests</p>
            </div>
          ) : (
            requests.map((request) => (
              <Request
                key={request.request._id}
                id={request.request._id}
                imageUrl={request.sender.imageUrl}
                username={request.sender.username}
                email={request.sender.email}
              />
            ))
          )
        ) : (
          <Loader2 className="animate-spin text-zinc-400" />
        )}
      </ItemList>
      <ConversationFallback />
    </>
  );
}
