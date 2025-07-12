import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CircleArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  name: string
  imageUrl?: string
  options?: {
    label: string
    destructive: boolean
    onClick: () => void
  }[]
}

function Header({ name, imageUrl, options }: Props) {
  return (
    <Card className='w-full flex rounded-lg items-center p-2'>
      <div className='flex items-center gap-2 justify-between w-full'>
        <div className='flex items-center gap-2'>
          <Link href={'/conversations'} className='block lg:hidden'>
            <CircleArrowLeft />
          </Link>
          <Avatar>
            <AvatarImage
              className='w-8 h-8 rounded-full'
              src={imageUrl}
              alt={name}
            />
            <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <h2 className='font-semibold'>{name}</h2>
        </div>
        <div className='flex gap-2'>
          {options ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  className='inline-flex items-center justify-center h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer'
                  role='button'
                  tabIndex={0}
                >
                  <Settings className='h-4 w-4' />
                  <span className='sr-only'>Settings</span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {options.map((option, id) => {
                  return (
                    <DropdownMenuItem
                      key={id}
                      onClick={option.onClick}
                      className={cn('font-semibold', {
                        'text-destructive': option.destructive,
                      })}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export default Header
