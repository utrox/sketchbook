import { useMutation } from "@apollo/client";
import { TOGGLE_COMMENT_LIKE } from "../api/graphQL/mutations/like";
import { numericIdToGraphqlId } from "../utils";

interface ToggleCommentLikeProps {
  liked: boolean;
  commentId: number;
  likeCount: number;
}

const useToggleCommentLike = ({
  liked,
  commentId,
  likeCount,
}: ToggleCommentLikeProps) => {
  const [toggleCommentLike] = useMutation(TOGGLE_COMMENT_LIKE, {
    variables: { commentId: commentId },
    /* 
    We can use optimisticResponse to make the UI more fluid and responsible, 
    even if the actual response arrives slowly. 
    */
    optimisticResponse: {
      __typename: "Mutation",
      toggleCommentLike: {
        __typename: "ToggleCommentLike",
        comment: {
          __typename: "CommentNode",
          id: numericIdToGraphqlId("CommentNode", commentId),
          likeCount: liked ? likeCount - 1 : likeCount + 1,
          likedByUser: !liked,
        },
      },
    },
    update(cache, { data: { toggleCommentLike } }) {
      cache.modify({
        id: cache.identify({
          id: toggleCommentLike.id,
          __typename: "CommentNode",
        }),
        fields: {
          likeCount() {
            return toggleCommentLike.likeCount;
          },
          likedByUser() {
            return toggleCommentLike.likedByUser;
          },
        },
      });
    },
  });

  return { toggleCommentLike };
};

export default useToggleCommentLike;
