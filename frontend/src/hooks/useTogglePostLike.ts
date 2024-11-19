import { useMutation } from "@apollo/client";
import { TOGGLE_POST_LIKE } from "../api/graphQL/mutations/like";
import { numericIdToGraphqlId } from "../utils";

interface TogglePostLikeProps {
  liked: boolean;
  postId: number;
  likeCount: number;
}

const useTogglePostLike = ({
  liked,
  postId,
  likeCount,
}: TogglePostLikeProps) => {
  const [togglePostLike] = useMutation(TOGGLE_POST_LIKE, {
    variables: { postId: postId },
    /* 
    We can use optimisticResponse to make the UI more fluid and responsible, 
    even if the actual response arrives slowly. 
    */
    optimisticResponse: {
      __typename: "Mutation",
      togglePostLike: {
        __typename: "TogglePostLike",
        post: {
          __typename: "PostNode",
          id: numericIdToGraphqlId("PostNode", postId),
          likeCount: liked ? likeCount - 1 : likeCount + 1,
          likedByUser: !liked,
        },
      },
    },
    update(cache, { data: { togglePostLike } }) {
      cache.modify({
        id: cache.identify({ id: togglePostLike.id, __typename: "PostNode" }),
        fields: {
          likeCount() {
            return togglePostLike.likeCount;
          },
          likedByUser() {
            return togglePostLike.likedByUser;
          },
        },
      });
    },
  });

  return { togglePostLike };
};

export default useTogglePostLike;
