import React from "react";
import { IconButton, Dialog } from "@mui/material";

import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavouriteIcon from "@mui/icons-material/Favorite";
import LikersModal from "./LikersModal";

interface LikeButtonProps {
  postId?: string;
  commentId?: string;
  likeCount: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const LikeButton = ({
  postId,
  commentId,
  likeCount,
  onClick,
}: LikeButtonProps) => {
  /* TODO: remove this, only here for demo purposes */
  const [liked, setLiked] = React.useState(false);
  const [likersModalOpen, setLikersModalOpen] = React.useState(false);
  const handleCloseLikersModalLikersModal = () => setLikersModalOpen(true);
  const handleClose = () => setLikersModalOpen(false);

  return (
    <>
      <IconButton onClick={() => setLiked(!liked)}>
        {/* TODO: some kind of animation when liking/disliking? */}
        {/* TODO: FaviouriteIcon vs FavouriteBorderIcon depending on weather the current user liked the post or not */}
        {liked ? (
          <FavouriteIcon style={{ color: "red" }} />
        ) : (
          <FavouriteBorderIcon />
        )}
      </IconButton>
      {/* TODO: open list of likers as Modal */}
      <span className="liketext" onClick={handleCloseLikersModalLikersModal}>
        {likeCount}
      </span>
      <Dialog open={likersModalOpen} onClose={handleClose}>
        <LikersModal postId={postId} commentId={commentId} />
      </Dialog>
    </>
  );
};

export default LikeButton;
