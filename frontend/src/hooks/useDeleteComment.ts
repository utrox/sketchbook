import { StoreObject, useMutation } from "@apollo/client";
import { DELETE_COMMENT_MUTATION } from "../api/graphQL/mutations/comment";

export const useDeleteComment = (commentId: number) => {
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: { id: commentId },
    // Remove the comment from the cache,
    // so we don't need to wait for the next poll to see the comment disappear.
    update: (cache) => {
      cache.modify({
        fields: {
          allCommentsForPost(existingComments = { edges: [] }, { readField }) {
            return {
              edges: existingComments.edges.filter(
                (edge: { node: StoreObject }) =>
                  commentId !== readField("id", edge.node)
              ),
            };
          },
        },
      });
    },
  });
  return { deleteComment };
};
