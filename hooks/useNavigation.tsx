import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { MessageSquare, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export const useNavigation = () => {
  const pathname = usePathname()
  const conversations = useQuery(api.conversations.get)
  const unseenMessagesCount = useMemo(() => {
    return conversations?.reduce((acc, curr) => {
      return acc + curr.unseenCount
    }, 0)
  }, [conversations])
  const requestsCount = useQuery(api.requests.count)
  const paths = useMemo(
    () => [
      {
        name: 'conversations',
        href: '/conversations',
        icon: <MessageSquare />,
        isActive: pathname.startsWith('/conversations'),
        count: unseenMessagesCount,
      },
      {
        name: 'friends',
        href: '/friends',
        icon: <Users />,
        isActive: pathname.startsWith('/friends'),
        count: requestsCount,
      },
    ],
    [pathname, unseenMessagesCount, requestsCount]
  )

  return paths
}
