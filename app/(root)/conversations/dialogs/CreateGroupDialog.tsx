'use client'
import { api } from '@/convex/_generated/api'
import { useMutationState } from '@/hooks/useMutationState'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from 'convex/react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { CirclePlus, X } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

const createGroupSchema = z.object({
  name: z.string().min(1, { message: "this field can't be empty" }),
  members: z.string().array().min(1, 'you must select at least 1 friend'),
})

function CreateGroupDialog() {
  const [open, setOpen] = useState(false)
  const friends = useQuery(api.friends.get)
  const { mutate: createGroup, pending } = useMutationState(
    api.conversation.createGroup
  )
  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '', members: [] },
  })
  const members = form.watch('members', [])
  const unselectedFriends = useMemo(() => {
    return friends
      ? friends.filter((friend) => !members.includes(friend._id))
      : []
  }, [friends, members])
  const handleSubmit = async (values: z.infer<typeof createGroupSchema>) => {
    await createGroup({
      name: values.name,
      members: values.members,
    })
      .then(() => {
        form.reset()
        setOpen(false)
        toast.success('Group created successfully')
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : 'Unexpected error occurred'
        )
      })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size='icon' variant='outline' asChild>
            <DialogTrigger>
              <CirclePlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className='block'>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>Add your friends to get started</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-8'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Group name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            ></FormField>
            <FormField
              control={form.control}
              name='members'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={unselectedFriends.length === 0}
                        >
                          <Button className='w-full' variant='outline'>
                            Select Friends
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-full'>
                          {unselectedFriends.map((friend) => {
                            return (
                              <DropdownMenuCheckboxItem
                                key={friend._id}
                                className='flex items-center gap-2 w-full p-2'
                                checked={false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    const newMembers = [
                                      ...field.value,
                                      friend._id,
                                    ]
                                    form.setValue('members', newMembers)
                                    form.trigger('members') // Trigger validation
                                  }
                                }}
                              >
                                <Avatar className='w-8 h-8'>
                                  <AvatarImage src={friend.imageUrl} />
                                  <AvatarFallback>
                                    {friend.username.substring(0, 1)}
                                  </AvatarFallback>
                                </Avatar>
                                <h4 className='truncate'>{friend.username}</h4>
                              </DropdownMenuCheckboxItem>
                            )
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            ></FormField>
            {members && members.length ? (
              <Card className='flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar'>
                {friends
                  ?.filter((friend) => members.includes(friend._id))
                  .map((friend) => {
                    return (
                      <div
                        key={friend._id}
                        className='flex flex-col items-center gap-1'
                      >
                        <div className='relative'>
                          <Avatar className='w-8 h-8'>
                            <AvatarImage src={friend.imageUrl} />
                            <AvatarFallback>
                              {friend.username.substring(0, 1)}
                            </AvatarFallback>
                          </Avatar>

                          <X
                            className='absolute -top-2 -right-2 text-text-muted-foreground w-4 h-4 bg-muted rounded-full cursor-pointer'
                            onClick={() => {
                              const newMembers = form
                                .getValues('members')
                                .filter((member) => member !== friend._id)
                              form.setValue('members', newMembers)
                              form.trigger('members') // Trigger validation
                            }}
                          />
                        </div>
                        <h4 className='truncate text-sm'>
                          {friend.username.split(' ')[0]}
                        </h4>
                      </div>
                    )
                  })}
              </Card>
            ) : null}
            <DialogFooter>
              <Button className='w-full' disabled={pending} type='submit'>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroupDialog
