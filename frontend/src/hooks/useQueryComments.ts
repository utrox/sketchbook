import { GET_COMMENTS_FOR_POST } from "../api/graphQL/queries/comment.ts";
import useQueryWithCursorPagination from "./useQueryWithCursorPagination.ts";

const LOAD_AT_ONCE_COUNT = 5;
const REFETCH_INTERVAL = 15_000;

const useQueryComments = (postId: number) => {
  const { data, loading, refetch, loadMoreItems } =
    useQueryWithCursorPagination(
      GET_COMMENTS_FOR_POST,
      "allCommentsForPost",
      {
        postId,
      },
      LOAD_AT_ONCE_COUNT,
      REFETCH_INTERVAL
    );

  return { data, loading, refetch, loadMoreItems };
};

export default useQueryComments;
