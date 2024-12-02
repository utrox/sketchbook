import React from "react";
import { IconButton } from "@mui/material";
import { ImageType } from "react-images-uploading";

import CloseIcon from "@mui/icons-material/Close";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

interface SelectedImageProps {
  image: ImageType;
  index: number;
  onEdit: () => void;
  onDelete?: () => void;
  nonRemovable?: boolean;
}

const SelectedImage: React.FC<SelectedImageProps> = ({
  image,
  index,
  onEdit,
  onDelete = () => {},
  nonRemovable = false,
}) => {
  return (
    <div key={index} className="uploaded-image-container">
      <img src={image.data_url} alt="uploaded" className="uploaded-image" />
      {!nonRemovable && (
        <IconButton onClick={onDelete} className="remove-button">
          <CloseIcon />
        </IconButton>
      )}
      <div className="edit-icon">
        <EditTwoToneIcon onClick={onEdit} />
      </div>
    </div>
  );
};

export default SelectedImage;
