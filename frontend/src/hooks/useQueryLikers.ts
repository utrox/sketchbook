import {
  GET_LIKERS_FOR_COMMENT,
  GET_LIKERS_FOR_POST,
} from "../api/graphQL/queries/likers";
import useQueryWithCursorPagination from "./useQueryWithCursorPagination";

interface QueryProps {
  postId?: number;
  commentId?: number;
  queryPropertyName: string;
}

const LOAD_AT_ONCE_COUNT = 10;
const REFETCH_INTERVAL = 15_000;

/* See comment in useQueryFeed.ts as why this solution was used. */
const useQueryLikers = ({
  postId,
  commentId,
  queryPropertyName,
}: QueryProps) => {
  /*
  Depending on if this is a Likers modal for a Comment or Post, 
  request the data differently.
  */
  const QUERY_TO_USE = postId ? GET_LIKERS_FOR_POST : GET_LIKERS_FOR_COMMENT;

  const { data, loading, refetch, loadMoreItems } =
    useQueryWithCursorPagination(
      QUERY_TO_USE,
      queryPropertyName,
      {
        postId,
        commentId,
      },
      LOAD_AT_ONCE_COUNT,
      REFETCH_INTERVAL
    );

  return { data, loading, refetch, loadMoreItems };
};

export default useQueryLikers;
