import React from "react";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
type Props = {};

function ConversationPage({}: Props) {
  return (
    <>
      <ConversationFallback>Conversation</ConversationFallback>
    </>
  );
}

export default ConversationPage;
