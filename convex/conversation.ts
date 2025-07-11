import { query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) {
      throw new ConvexError("User not found");
    }
    const conversation = await ctx.db.get(args.id);
    if (!conversation) {
      throw new ConvexError("Conversation not found or unauthorized");
    }
    const memberShip = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();
    if (!memberShip) {
      throw new ConvexError(
        "you are not a part of this conversation or unauthorized"
      );
    }
    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();
    if (!conversation.isGroup) {
      const otherMemberShip = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      )[0];
      const otherMembersDetails = await ctx.db.get(otherMemberShip.memberId);
      return {
        ...conversation,
        otherMember: {
          ...otherMembersDetails,
          // lastSeenMessageId: otherMemberShip.lastSeenMessage,
        },
        otherMembers: null,
      };
    }
  },
});
