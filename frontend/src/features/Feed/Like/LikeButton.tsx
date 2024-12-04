import { useState, useEffect } from "react";
import { IconButton, Dialog } from "@mui/material";

import FavouriteIcon from "@mui/icons-material/Favorite";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import LikersModal from "./LikersModal";
import useTogglePostLike from "../../../hooks/useTogglePostLike";
import useToggleCommentLike from "../../../hooks/useToggleCommentLike";

type LikeButtonProps = {
  liked: boolean;
  likeCount: number;
} /* Either postId, or commentId is required. */ & (
  | { postId: number; commentId?: never }
  | { postId?: never; commentId: number }
);

const LikeButton = ({
  liked,
  postId = 0,
  commentId = 0,
  likeCount,
}: LikeButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [likersModalOpen, setLikersModalOpen] = useState(false);
  const handleCloseLikersModal = () => setLikersModalOpen(true);
  const handleClose = () => setLikersModalOpen(false);

  useEffect(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  }, [liked]);

  /* Set up whether it's a LikeButton for a Comment or a Post component. */
  const postToggle = useTogglePostLike({ postId, liked, likeCount });
  const commentToggle = useToggleCommentLike({ commentId, liked, likeCount });
  const toggleLike = postId
    ? postToggle.togglePostLike
    : commentToggle.toggleCommentLike;

  return (
    <>
      <IconButton
        onClick={() => toggleLike()}
        className={isAnimating ? "like-button animating" : "like-button"}
      >
        {liked ? (
          <FavouriteIcon style={{ color: "red" }} />
        ) : (
          <FavouriteBorderIcon />
        )}
      </IconButton>
      <span className="liketext" onClick={handleCloseLikersModal}>
        {likeCount}
      </span>
      <Dialog open={likersModalOpen} onClose={handleClose}>
        <LikersModal postId={postId} commentId={commentId} />
      </Dialog>
    </>
  );
};

export default LikeButton;
