import { mutation, query } from './_generated/server'
import { ConvexError, v } from 'convex/values'
import { getUserByClerkId } from './_utils'

export const get = query({
  args: {
    id: v.id('conversations'),
  },
  handler: async (ctx, args) => {
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
    const conversation = await ctx.db.get(args.id)
    if (!conversation) {
      throw new ConvexError('Conversation not found or unauthorized')
    }
    const memberShip = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId_conversationId', (q) =>
        q.eq('memberId', currentUser._id).eq('conversationId', conversation._id)
      )
      .unique()
    if (!memberShip) {
      throw new ConvexError(
        'you are not a part of this conversation or unauthorized'
      )
    }
    const allConversationMemberships = await ctx.db
      .query('conversationMembers')
      .withIndex('by_conversationId', (q) => q.eq('conversationId', args.id))
      .collect()
    if (!conversation.isGroup) {
      const otherMemberShip = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0]
      const otherMembersDetails = await ctx.db.get(otherMemberShip.memberId)
      return {
        ...conversation,
        otherMember: {
          ...otherMembersDetails,
          lastSeenMessage: otherMemberShip.lastSeenMessage,
        },
        otherMembers: null,
      }
    } else {
      const otherMembers = await Promise.all(
        allConversationMemberships
          .filter((membership) => membership.memberId !== currentUser._id)
          .map(async (membership) => {
            const member = await ctx.db.get(membership.memberId)
            if (!member) {
              throw new ConvexError('Member not found')
            }
            return {
              username: member.username,
              lastSeenMessage: membership.lastSeenMessage,
              _id: member._id,
            }
          })
      )
      return {
        ...conversation,
        otherMember: null,
        otherMembers,
      }
    }
  },
})
export const createGroup = mutation({
  args: { members: v.array(v.id('users')), name: v.string() },
  handler: async (ctx, args) => {
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
    const conversationId = await ctx.db.insert('conversations', {
      isGroup: true,
      name: args.name,
    })
    await Promise.all(
      [...args.members, currentUser._id].map(async (memberId) => {
        await ctx.db.insert('conversationMembers', {
          conversationId,
          memberId,
        })
      })
    )
  },
})

export const deleteGroup = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
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
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) {
      throw new ConvexError('Conversation not found')
    }
    const memberships = await ctx.db
      .query('conversationMembers')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId)
      )
      .collect()
    if (!memberships || memberships.length <= 1) {
      throw new ConvexError('This conversation has other members')
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId)
      )
      .collect()
    if (!messages) {
      throw new ConvexError('Messages not found')
    }
    await ctx.db.delete(args.conversationId)
    await Promise.all(
      memberships.map(async (membership) => {
        await ctx.db.delete(membership._id)
      })
    )
    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id)
      })
    )
  },
})
export const leaveGroup = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
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
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) {
      throw new ConvexError('Conversation not found')
    }
    const membership = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId_conversationId', (q) =>
        q
          .eq('memberId', currentUser._id)
          .eq('conversationId', args.conversationId)
      )
      .unique()
    if (!membership) {
      throw new ConvexError('You are not a member of this group')
    }
    await ctx.db.delete(membership._id)
  },
})
export const markRead = mutation({
  args: {
    conversationId: v.id('conversations'),
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
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

    const membership = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId_conversationId', (q) =>
        q
          .eq('memberId', currentUser._id)
          .eq('conversationId', args.conversationId)
      )
      .unique()

    if (!membership) {
      throw new ConvexError("You aren't a member of this conversation")
    }

    const lastMessage = await ctx.db.get(args.messageId)

    await ctx.db.patch(membership._id, {
      lastSeenMessage: lastMessage ? lastMessage._id : undefined,
    })
  },
})
