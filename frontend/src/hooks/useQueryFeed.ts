import { GET_FEED_DATA } from "../api/graphQL/queries/feed.ts";
import useQueryWithCursorPagination from "./useQueryWithCursorPagination.ts";

const LOAD_AT_ONCE_COUNT = 10;
const REFETCH_INTERVAL = 15_000;

const useQueryFeed = () => {
  const { data, loading, refetch, loadMoreItems } =
    useQueryWithCursorPagination(
      GET_FEED_DATA,
      "feed",
      {},
      LOAD_AT_ONCE_COUNT,
      REFETCH_INTERVAL
    );

  return { data, loading, refetch, loadMoreItems };
};

export default useQueryFeed;
