import "./ImageUploader.css";
import noImage from "./no-image.png";
import { Button, Typography } from "@mui/material";
import ImageUploading, {
  ImageListType,
  ImageType,
} from "react-images-uploading";

import SelectedImage from "./SelectedImage";

type ImageProportions = {
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
};

interface ImageUploaderProps {
  label: string;
  maxImages?: number;
  images: ImageListType;
  setImages: (images: ImageListType) => void;
  placeholderImage?: ImageType;
  imageProportions?: ImageProportions;
}

const ImageUploader = ({
  images,
  setImages,
  label,
  maxImages = 1,
  placeholderImage,
}: //imageProportions,
ImageUploaderProps) => {
  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

  const isMaxImagesReached = images.length === maxImages;

  return (
    <>
      <h1>{label}</h1>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxImages}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          dragProps,
        }) => (
          <div {...dragProps}>
            <div className="upload-container">
              {imageList.map((image, index) => (
                <SelectedImage
                  index={index}
                  onDelete={() => onImageRemove(index)}
                  onEdit={() => onImageUpdate(index)}
                  image={image}
                />
              ))}

              {/* If there are no images uploaded/selected, show default image. */}
              {images.length === 0 && (
                <div className="uploaded-image-container">
                  <SelectedImage
                    index={0}
                    onEdit={onImageUpload}
                    image={
                      placeholderImage
                        ? placeholderImage
                        : { data_url: noImage }
                    }
                    nonRemovable
                  />
                </div>
              )}
            </div>
            <Button
              onClick={maxImages === 1 ? () => onImageUpdate(0) : onImageUpload}
              disabled={isMaxImagesReached && maxImages !== 1}
            >
              Upload image
            </Button>
            <Typography>
              {isMaxImagesReached
                ? "Maximum number of allowed images selected."
                : "Or drag and drop an image here to upload it."}
            </Typography>
            {/* TODO: add frontend validation of selected images to upload (size for example) */}
          </div>
        )}
      </ImageUploading>
    </>
  );
};

export default ImageUploader;
