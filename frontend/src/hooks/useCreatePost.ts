import { useMutation } from "@apollo/client";
import { CREATE_POST_MUTATION } from "../api/graphQL/mutations/post";

interface PostCreateProps {
  postContent: string;
}

const useCreatePost = () => {
  const [createPost, { error, loading }] = useMutation(CREATE_POST_MUTATION);

  const makePost = async ({ postContent }: PostCreateProps) => {
    await createPost({
      variables: { content: postContent },
    });
  };

  return { makePost, error, loading };
};

export default useCreatePost;
