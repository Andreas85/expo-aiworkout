import { API_ENPOINTS } from '@/services/api';
import { getRequest } from '@/utils/axios';
import { base64ToBlob } from '@/utils/helper';
import * as FileSystem from 'expo-file-system';

export default function useImageUpload() {
  const awsPreSignedURLUploadNative = async (imageFile: any) => {
    try {
      // Step 1: Get pre-signed URL from your backend
      const apiUrl = API_ENPOINTS.AWS_SIGNED_URL + '?fileName=' + imageFile.name;
      const response = await getRequest({ API: apiUrl });
      const signedUrl = response?.data?.data;
      const uploadedFileUrl = signedUrl?.split('?')[0];

      // Step 2: Read file from URI as binary (not base64)
      const fileBinary = await FileSystem.readAsStringAsync(imageFile.url, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Step 3: Convert base64 to Uint8Array
      const byteCharacters = atob(fileBinary);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      // Step 4: Upload binary to S3 using pre-signed URL
      await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': imageFile.type, // e.g., image/jpeg
        },
        body: byteArrays,
      });

      return uploadedFileUrl;
    } catch (err) {
      console.error('awsPreSignedURLUpload error:', err);
      throw err;
    }
  };

  const awsPreSignedURLUploadWeb = async (imageFile: any) => {
    const apiUrl = API_ENPOINTS.AWS_SIGNED_URL + '?fileName=' + imageFile.name;
    const response = await getRequest({ API: apiUrl });
    const signedUrl = response?.data?.data;
    const uploadedFileUrl = signedUrl?.split('?')[0];

    const blobData = base64ToBlob(imageFile.url, imageFile.type);
    await fetch(signedUrl, {
      method: 'PUT',
      body: blobData,
    });
    return uploadedFileUrl;
  };

  return {
    awsPreSignedURLUploadNative,
    awsPreSignedURLUploadWeb,
  };
}
