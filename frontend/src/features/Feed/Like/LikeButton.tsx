import { useState, useEffect } from "react";
import { IconButton, Dialog } from "@mui/material";
import { toast } from "react-toastify";

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
  postId,
  commentId,
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
  const toggleLike = postId
    ? useTogglePostLike({ postId, liked, likeCount }).togglePostLike
    : commentId
    ? useToggleCommentLike({ commentId, liked, likeCount }).toggleCommentLike
    : () =>
        toast.error(
          "LikeButton component configured wrong. No commentId or postId provided."
        );

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
