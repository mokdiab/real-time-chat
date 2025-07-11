'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme/theme-toggle'
import { useNavigation } from '@/hooks/useNavigation'
import { UserButton } from '@clerk/nextjs'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@radix-ui/react-tooltip'
import Link from 'next/link'

function DesktopNav() {
  const { paths } = useNavigation()

  return (
    <Card className='hidden lg:flex flex-col justify-between items-center h-full w-16 px-2 py-4'>
      <nav>
        <ul className='flex flex-col items-center gap-4'>
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
                    <Badge className='absolute left-6 bottom-7 px-2'>
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
        </ul>
      </nav>

      <div className='flex flex-col items-center gap-4'>
        <ThemeToggle />
        <UserButton />
      </div>
    </Card>
  )
}

export default DesktopNav
