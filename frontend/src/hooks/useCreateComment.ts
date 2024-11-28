import { useMutation } from "@apollo/client";
import { CREATE_COMMENT_MUTATION } from "../api/graphQL/mutations/comment";

export const useCreateComment = () => {
  const [createComment, { error, loading }] = useMutation(
    CREATE_COMMENT_MUTATION
  );

  const makeComment = async (postId: number, commentContent: string) => {
    await createComment({
      variables: { postId: postId, content: commentContent },
    });
  };

  return { makeComment, error, loading };
};

export default useCreateComment;
