import { Card } from "@/components/ui/card";

function ConversationFallback() {
  return (
    <Card className="hidden lg:flex h-full w-full p2 items-center justify-center bg-secondary text-secondary-foreground">
      Select/start a conversation to get started!
    </Card>
  );
}

export default ConversationFallback;
