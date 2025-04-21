import React, { useRef } from 'react';
import { Platform, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface UploadedImage {
  id: string;
  url: string;
  title: string;
  type: string;
  name: string;
}

interface UploadButtonProps {
  loader: boolean;
  uploadedImages: UploadedImage[];
  imageUploadRequest: (image: UploadedImage) => Promise<void>;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  loader,
  uploadedImages,
  imageUploadRequest,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pickImage = async () => {
    // setSelectedImageUrl(null); // Reset selected image ID when generating new images

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const fileData = result.assets[0];
      const newImage: UploadedImage = {
        id: Date.now().toString(),
        url: fileData?.uri,
        title: `Uploaded ${uploadedImages.length + 1}`,
        type: fileData?.mimeType || 'image/jpeg', // Default MIME type
        name: fileData?.fileName || 'image.jpg', // Default file name
      };
      await imageUploadRequest(newImage);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file: any = e.target.files?.[0];
    if (!file) return;

    await imageUploadRequest(file);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.uploadButton, loader && styles.generateButtonDisabled]}
        onPress={pickImage}
        activeOpacity={0.7}>
        {loader ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.uploadButtonText}>Choose File</Text>
        )}
      </TouchableOpacity>

      {Platform.OS === 'web' && (
        <input
          type="file"
          accept="image/jpeg,image/png"
          ref={inputRef}
          style={styles.hiddenInput as React.CSSProperties}
          onChange={handleFileChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hiddenInput: {
    display: 'none',
  },
});

export default UploadButton;
