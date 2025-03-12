import { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FlipType, manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export default function ImagePickerExpo() {
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const _rotate90andFlip = async () => {
    const manipResult = await manipulateAsync(
      image.localUri || image.uri,
      [{ rotate: 90 }, { flip: FlipType.Vertical }],
      { compress: 1, format: SaveFormat.PNG },
    );
    setImage(manipResult);
  };

  const modifyHeightAndWidth = async () => {
    const manipResult = await manipulateAsync(
      image.localUri || image.uri,
      [{ resize: { width: 1200, height: 900 } }],
      { compress: 1, format: SaveFormat.PNG },
    );
    setImage(manipResult);
  };

  const renderModifyImageActionButton = () => {
    if (image) {
      return (
        <>
          <Button title="Rotate and Flip" onPress={_rotate90andFlip} />
          <Button title="Update Height and Width" onPress={modifyHeightAndWidth} />
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      {renderModifyImageActionButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
