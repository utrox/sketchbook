import { StoreObject, useMutation } from "@apollo/client";
import { EDIT_COMMENT_MUTATION } from "../api/graphQL/mutations/comment";

export const useEditComment = () => {
  const [updateComment, { error, loading }] = useMutation(
    EDIT_COMMENT_MUTATION
  );

  const editComment = async (commentId: number, commentContent: string) => {
    await updateComment({
      variables: { id: commentId, content: commentContent },
      update: (cache) => {
        cache.modify({
          fields: {
            allCommentsForPost(
              existingComments = { edges: [] },
              { readField }
            ) {
              return {
                edges: existingComments.edges.map(
                  (edge: { node: StoreObject }) => {
                    if (commentId === readField("id", edge.node)) {
                      return {
                        ...edge,
                        node: {
                          ...edge.node,
                          content: commentContent,
                        },
                      };
                    }
                    return edge;
                  }
                ),
              };
            },
          },
        });
      },
    });
  };

  return { editComment, error, loading };
};
