import { useMutation } from "@apollo/client";
import { CREATE_POST_MUTATION } from "../api/graphQL/mutations/post";

interface PostCreateProps {
  postContent: string;
}

const useCreatePost = () => {
  const [executeCreatePost, { error, loading }] =
    useMutation(CREATE_POST_MUTATION);

  const createPost = async ({ postContent }: PostCreateProps) => {
    await executeCreatePost({
      variables: { content: postContent },
    });
  };

  return { createPost, error, loading };
};

export default useCreatePost;
