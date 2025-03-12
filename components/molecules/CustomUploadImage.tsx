import { StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import Container from '../atoms/Container';
import { IMAGES } from '@/utils/images';
import { pickImageAsync } from '@/utils/ImagePickerHelper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextContainer from '../atoms/TextContainer';

const CustomUploadImage = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const handleUploadImage = async () => {
    await pickImageAsync(data => {
      setImageUri(data.uri);
      console.log(data);
    });
  };
  return (
    <Container style={styles.imageContainer}>
      <Image source={imageUri ? { uri: imageUri } : IMAGES.muscleIcon} style={styles.imageStyle} />
      <TouchableOpacity onPress={handleUploadImage}>
        <TextContainer data={'Upload Profile Photo'} />
      </TouchableOpacity>
    </Container>
  );
};

export default CustomUploadImage;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    rowGap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    borderRadius: 90,
  },
});
