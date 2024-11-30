import { GET_USER_POST_HISTORY } from "../api/graphQL/queries/user";
import useQueryWithCursorPagination from "./useQueryWithCursorPagination";

const LOAD_AT_ONCE_COUNT = 10;
const REFETCH_INTERVAL = 15_000;

const useQueryPostHistory = (username: string) => {
  const { data, loading, refetch, loadMoreItems } =
    useQueryWithCursorPagination(
      GET_USER_POST_HISTORY,
      "postHistory",
      {
        username,
      },
      LOAD_AT_ONCE_COUNT,
      REFETCH_INTERVAL
    );

  return { data, loading, refetch, loadMoreItems };
};

export default useQueryPostHistory;
