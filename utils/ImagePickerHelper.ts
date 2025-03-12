import { Alert, Platform } from 'react-native';
import { STRING_DATA } from './appConstants';
import * as ImagePicker from 'expo-image-picker';

// console.log(userData, "userDatanews..");
export const pickImageAsync = async (callbackSuccess: {
  (MediaData: { uri: string; type: string; name: string }): void;
}) => {
  if (Platform.OS === 'web') {
    // Web-specific implementation
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets) {
        const fileData = result.assets[0];
        const MediaData = {
          uri: fileData.uri,
          type: fileData.mimeType || 'image/jpeg',
          name: fileData.fileName || 'image.jpg',
        };
        callbackSuccess(MediaData);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  } else {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    // Show an alert or modal for user choice (Camera or Gallery)
    const userChoice = await new Promise(resolve => {
      Alert.alert(
        'Choose image source',
        'Would you like to take a photo or choose one from the gallery?',
        [
          {
            text: STRING_DATA.CAMERA,
            onPress: () => resolve(STRING_DATA.CAMERA.toLowerCase()),
          },
          {
            text: STRING_DATA.GALLERY,
            onPress: () => resolve(STRING_DATA.GALLERY.toLowerCase()),
          },
        ],
        { cancelable: true },
      );
    });

    let result;
    if (userChoice === STRING_DATA.CAMERA.toLowerCase()) {
      // Open Camera
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
      });
    } else if (userChoice === STRING_DATA.GALLERY.toLowerCase()) {
      // Open Gallery
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
    } else {
      // alert("No option selected!");
      return;
    }

    if (!result.canceled) {
      const fileData = result?.assets?.[0] as any;
      const MediaData = {
        uri: fileData?.uri,
        type: fileData?.mimeType || 'image/jpeg', // Default MIME type
        name: fileData?.fileName || 'image.jpg', // Default file name
      };
      // mutateUpload({ files: MediaData, userId: userData?.id });
      callbackSuccess(MediaData);
    } else {
      // alert("You did not select any image.");
    }
  }
};
