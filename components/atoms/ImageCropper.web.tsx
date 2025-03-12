'use client';
import React, { useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { ActionButton } from './ActionButton';
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
        <div className="flex w-full items-center justify-end gap-2">
          <ActionButton onPress={handleCrop} label="Show preview" />
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
        preview=".img-preview"
        ref={cropperRef}
        dragMode="move"
        cropBoxMovable={true}
        viewMode={1}
        minCropBoxHeight={200}
        minCropBoxWidth={200}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
      />
    </div>
  );
};
