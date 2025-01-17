"use client";
import { useParams } from "next/navigation";
import ConversationContainer from "@/components/shared/conversation/ConversationContainer";

function ConversationPage() {
  const { conversationId } = useParams();
  return (
    <ConversationContainer>
      Conversation ID: {conversationId}
    </ConversationContainer>
  );
}

export default ConversationPage;
