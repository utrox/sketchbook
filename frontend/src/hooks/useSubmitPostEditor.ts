/* eslint-disable react-hooks/rules-of-hooks */

// We're going to disable this particular eslint rule regarding the conditional use of hooks.
// This is because the condition will never change,
// so the order of hooks is guaranteed to remain the same, thus it will not cause an issue.

import useEditPost from "./useEditPost";
import useCreatePost from "./useCreatePost";

// Because in components you cannot use hooks conditionally,
// you can use this hook to conditionally refetch the data, depending
// where the post editor is being used. (Feed or UserProfile)
const useSubmitPostEditor = (postId?: number) => {
  if (postId) {
    const { editPost, loading, error } = useEditPost();

    return { makeRequest: editPost, loading, error };
  } else {
    const { makePost, loading, error } = useCreatePost();

    return { makeRequest: makePost, loading, error };
  }
};

export default useSubmitPostEditor;
