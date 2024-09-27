import React, { ChangeEvent, useRef, useState } from 'react';
import { ImageCropper } from './ImageCropper.web';
import { ActionButton } from './ActionButton';
import { tailwind } from '@/utils/tailwind';

const InputImage = () => {
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const [image, setImage] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | undefined>();
  const handleCrop = (cropped: string) => {
    setCroppedImage?.(cropped);
  };

  const handleResetImage = () => {
    setImage(undefined);
  };

  const handleFileChangeWeb = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    alert('Uploaded');
    setImage(undefined);
  };

  const handleCancelUpload = () => {
    setImage(undefined);
  };

  const renderCropperAndPrewiew = () => {
    if (croppedImage) {
      return (
        <>
          <div className="mb-2 flex flex-row items-center justify-between gap-2">
            <ActionButton label="Upload" style={tailwind('grow')} onPress={handleUpload} />
            <ActionButton
              label="Cancel"
              style={tailwind('grow')}
              onPress={handleCancelUpload}
              isOutline={true}
            />
          </div>
          <img src={croppedImage} alt={'workout image'} className="m-auto aspect-square h-56" />
        </>
      );
    }
    if (image) {
      return (
        <ImageCropper
          image={image}
          onCrop={handleCrop}
          resetImage={handleResetImage}
          aspectRatio={1} // Customize aspect ratio here
        />
      );
    }
  };

  const handleUploadButtonClick = () => {
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.click(); // Programmatically trigger the file input click
    }
  };

  const renderCropperAndDropzone = () => {
    if (image) {
      return renderCropperAndPrewiew();
    }
    return (
      <>
        <div className="m-auto max-w-fit">
          <ActionButton label="Upload" onPress={handleUploadButtonClick} />
        </div>
      </>
    );
  };
  return (
    <>
      <input
        type="file"
        ref={hiddenFileInputRef}
        accept="image/*" // Accept only image files
        onChange={handleFileChangeWeb}
        style={{ display: 'none' }} // Hide the input
      />
      {renderCropperAndDropzone()}
    </>
  );
};

export default InputImage;
