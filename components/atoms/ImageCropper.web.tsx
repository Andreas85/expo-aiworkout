'use client';
import React, { useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { ActionButton } from './ActionButton';
// import ActionButton from './ActionButton';

interface ImageCropperProps {
  image: string;
  onCrop?: (croppedImage: string) => void;
  aspectRatio?: number;
  cropBoxResizable?: boolean;
  resetImage?: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCrop,
  cropBoxResizable = true,
  aspectRatio = 1, // default to 1:1 aspect ratio,
  resetImage,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      onCrop?.(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const renderActionButton = () => {
    return (
      <>
        <div className="flex w-full items-center justify-between gap-2">
          {/* // <ActionButton text="Reset" onclick={resetImage} isDeleteButton={true} /> */}
          <ActionButton label="Show preview" onPress={handleCrop} />
        </div>
      </>
    );
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {renderActionButton()}
      <Cropper
        src={image}
        style={{ height: 400, width: '100%' }}
        initialAspectRatio={aspectRatio}
        aspectRatio={aspectRatio}
        guides={true}
        cropBoxResizable={cropBoxResizable}
        viewMode={2}
        background={false}
        autoCropArea={1}
        checkOrientation={false}
        responsive={true}
        ref={cropperRef}
        dragMode="move"
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        cropBoxMovable={true}
      />
    </div>
  );
};
