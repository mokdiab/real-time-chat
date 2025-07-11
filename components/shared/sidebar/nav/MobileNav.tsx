'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme/theme-toggle'
import { useConversation } from '@/hooks/useConversation'
import { useNavigation } from '@/hooks/useNavigation'
import { UserButton } from '@clerk/nextjs'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@radix-ui/react-tooltip'
import Link from 'next/link'

function MobileNav() {
  const { paths } = useNavigation()

  const { isActive } = useConversation()
  if (isActive) return null
  return (
    <Card className='fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2  lg:hidden'>
      <nav className='w-full'>
        <ul className='flex justify-evenly items-center'>
          {paths.map((path, id) => {
            return (
              <li key={id} className='relative'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size='icon'
                      variant={path.isActive ? 'default' : 'outline'}
                    >
                      <Link href={path.href}>{path.icon}</Link>
                    </Button>
                  </TooltipTrigger>
                  {path.count ? (
                    <Badge className='absolute left-7 bottom-6 '>
                      {path.count}
                    </Badge>
                  ) : null}
                  <TooltipContent side='right' align='center'>
                    <p>{path.name}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            )
          })}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <UserButton />
          </li>
        </ul>
      </nav>
    </Card>
  )
}

export default MobileNav
