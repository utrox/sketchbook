import useEditPost from "./useEditPost";
import useCreatePost from "./useCreatePost";

// Because in components you cannot use hooks conditionally,
// you can use this hook to conditionally make the request.
const useSubmitPostEditor = (postId?: number) => {
  const postEdition = useEditPost();
  const postCreation = useCreatePost();

  return postId
    ? {
        ...postEdition,
        makeRequest: postEdition.editPost,
      }
    : {
        ...postCreation,
        makeRequest: postCreation.createPost,
      };
};

export default useSubmitPostEditor;
