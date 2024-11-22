import { useMutation } from "@apollo/client";
import { DELETE_POST_MUTATION } from "../api/graphQL/mutations/post";

export const useDeletePost = (postId: number) => {
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    variables: { id: postId },
    update: (cache) => {
      cache.modify({
        fields: {
          feed(existingFeed = { edges: [] }, { readField }) {
            return {
              edges: existingFeed.edges.filter(
                (edge: any) => postId !== readField("id", edge.node)
              ),
            };
          },
        },
      });
    },
  });
  return { deletePost };
};
