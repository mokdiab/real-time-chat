import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {},
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
    const conversationMembership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();
    const conversations = await Promise.all(
      conversationMembership?.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) {
          throw new ConvexError("Conversation not found");
        }
        return conversation;
      })
    );
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const allConversationMemberships = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation?._id)
          )
          .collect();
        if (conversation.isGroup) {
          return { conversation };
        } else {
          const otherMemberShip = allConversationMemberships.filter(
            (memberShip) => memberShip.memberId !== currentUser._id
          )[0];
          const otherMembers = await ctx.db.get(otherMemberShip.memberId);
          return { conversation, otherMembers };
        }
      })
    );
    return conversationsWithDetails;
  },
});
