import { ConvexError } from 'convex/values'
import { query } from './_generated/server'
import { getUserByClerkId } from './_utils'

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError('Unauthorized')
    }
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    })
    if (!currentUser) {
      throw new ConvexError('User not found')
    }
    const friendShip1 = await ctx.db
      .query('friends')
      .withIndex('by_user1', (q) => q.eq('user1', currentUser._id))
      .collect()
    const friendShip2 = await ctx.db
      .query('friends')
      .withIndex('by_user2', (q) => q.eq('user2', currentUser._id))
      .collect()
    const friendShip = [...friendShip1, ...friendShip2]
    const friends = await Promise.all(
      friendShip.map(async (friendShip) => {
        const friend = await ctx.db.get(
          friendShip.user1 === currentUser._id
            ? friendShip.user2
            : friendShip.user1
        )
        if (!friend) {
          throw new ConvexError('Friend not found')
        }
        return friend
      })
    )
    return friends
  },
})
