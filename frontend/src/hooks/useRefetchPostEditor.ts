import useQueryFeed from "./useQueryFeed";
import useQueryPostHistory from "./useQueryPostHistory";

// Because in components you cannot use hooks conditionally,
// you can use this hook to conditionally refetch the data, depending
// where the post editor is being used. (Feed or UserProfile)
const useRefetchPostEditor = (isProfileEditor: boolean, username: string) => {
  if (isProfileEditor) {
    // This should only happen, if the PostEditor is not configured properly.
    // If username doesn't exist, and we are trying to
    //get the post history of that user, obviously we should throw an error.
    if (!username) {
      throw new Error("No username provided for useRefetchPostEditor hook.");
    }

    const refetchQueryPostHistory = useQueryPostHistory(username).refetch;
    return { refetch: refetchQueryPostHistory };
  } else {
    const refetchQueryFeed = useQueryFeed().refetch;
    return { refetch: refetchQueryFeed };
  }
};

export default useRefetchPostEditor;