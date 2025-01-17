import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();
  const requestsCount = useQuery(api.requests.count);
  const paths = useMemo(
    () => [
      {
        name: "conversations",
        href: "/conversations",
        icon: <MessageSquare />,
        isActive: pathname.startsWith("/conversations"),
      },
      {
        name: "friends",
        href: "/friends",
        icon: <Users />,
        isActive: pathname.startsWith("/friends"),
        count: requestsCount,
      },
    ],
    [pathname]
  );

  return { paths, requestsCount };
};
