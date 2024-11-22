import { useMutation } from "@apollo/client";
import { EDIT_POST_MUTATION } from "../api/graphQL/mutations/post";

export const useEditPost = () => {
  const [updatePost, { error, loading }] = useMutation(EDIT_POST_MUTATION);

  const editPost = async (postId: number, postContent: string) => {
    await updatePost({
      variables: { id: postId, content: postContent },
      update: (cache) => {
        cache.modify({
          fields: {
            feed(existingFeed = { edges: [] }, { readField }) {
              return {
                edges: existingFeed.edges.map((edge: any) => {
                  if (postId === readField("postId", edge.node)) {
                    return {
                      ...edge,
                      node: {
                        ...edge.node,
                        content: postContent,
                      },
                    };
                  }
                  return edge;
                }),
              };
            },
          },
        });
      },
    });
  };
  return { editPost, error, loading };
};

export default useEditPost;
