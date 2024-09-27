import React, { useState } from 'react';
import Container from './Container';
import * as ImagePicker from 'expo-image-picker';
import ImageContainer from './ImageContainer';
import { ActionButton } from './ActionButton';
import { tailwind } from '@/utils/tailwind';

const InputImage = () => {
  const [image, setImage] = useState<any>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    alert('Uploaded');
    setImage(undefined);
  };

  const handleCancelUpload = () => {
    setImage(undefined);
  };

  const renderImageAndButton = () => {
    if (image) {
      return (
        <>
          <Container style={tailwind(`mb-4 items-center`)}>
            <ImageContainer
              source={{ uri: image }}
              styleNative={tailwind('aspect-square  w-full  self-center rounded-2xl ')}
              contentFit="cover"
            />
          </Container>
          <Container style={tailwind('mb-2 flex flex-row items-center justify-between gap-2')}>
            <ActionButton
              label="Cancel"
              style={tailwind('grow rounded-md')}
              onPress={handleCancelUpload}
              isOutline={true}
            />
            <ActionButton
              label="Upload"
              style={tailwind('grow rounded-md')}
              onPress={handleUpload}
            />
          </Container>
        </>
      );
    }
    return (
      <>
        <Container style={tailwind('mb-20 flex-1 items-center bg-red-600')}>
          <ActionButton label="Upload" style={tailwind('rounded-md')} onPress={pickImage} />
        </Container>
      </>
    );
  };
  return <Container>{renderImageAndButton()}</Container>;
};

export default InputImage;
