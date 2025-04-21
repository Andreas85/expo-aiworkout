import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import SelectableImage from './SelectableImage';
import { ActionButton } from './ActionButton';
import ModalFooter from './ModalFooter';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { tailwind } from '@/utils/tailwind';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import { useFetchData } from '@/hooks/useFetchData';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import {
  generateWorkoutImageService,
  getImageService,
  updateWorkoutDataRequest,
} from '@/services/workouts';
import Loading from './Loading';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TextContainer from './TextContainer';
import { IGeneratedWorkoutImage } from '@/services/interfaces';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { useLocalSearchParams } from 'expo-router';
import useImageUpload from '@/hooks/useImageUpload';
import usePlatform from '@/hooks/usePlatform';
import UploadButton from './UploadButton';

interface ImageGenerationModalProps {
  isVisible: boolean;
  onClose: () => void;
  workoutName: string;
}

interface UploadedImage {
  id: string;
  url: string;
  title: string;
  type: string;
  name: string;
}

export default function ImageGenerationModal({
  isVisible,
  onClose,
  workoutName,
}: ImageGenerationModalProps) {
  const { slug } = useLocalSearchParams() as { slug: string };
  const queryClient = useQueryClient();
  const { isWeb } = usePlatform();
  const { awsPreSignedURLUploadNative, awsPreSignedURLUploadWeb } = useImageUpload();
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const [errorMessage, setErrorMessage] = useState('');
  const { data: imageData, isLoading } = useFetchData({
    queryFn: getImageService,
    queryKey: [REACT_QUERY_API_KEYS.FETCHED_IMAGE],
    staleTime: 0,
  });

  const { mutate: mutateGenerateWorkoutImage, isPending: isGenerating } = useMutation({
    mutationFn: generateWorkoutImageService,
    onSuccess: async data => {
      const newImage = data?.data?.url || '';
      console.log(newImage, 'newImage');
      setGeneratedImages(prev => [...prev, newImage]);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.FETCHED_IMAGE],
      });
    },
    onError: (error: string) => {
      setErrorMessage(error || 'Something went wrong');
    },
  });

  const { mutate: mutateUpdatedWorkout, isPending: isPendingUpdateWorkout } = useMutation({
    mutationFn: updateWorkoutDataRequest,
    onSuccess: data => {
      // alert('HERE---');
      console.log(data, 'datamutateUpdatedWorkout');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
      });
      setWorkoutDetail(data?.data);
      onClose();
    },
    onError: (error: string) => {
      console.log(error);
    },
  });

  const [activeTab, setActiveTab] = useState<'library' | 'generate' | 'upload'>('library');
  const { isLargeScreen } = useWebBreakPoints();
  const { isExtraSmallDevice, isMobileDevice } = useBreakPoints();
  const isKeyboardVisible = useKeyboardVisibility();
  const [loader, setLoader] = useState<boolean>(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const { height } = useWindowDimensions();

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const imageUploadRequest = async (file: UploadedImage) => {
    try {
      setLoader(true);
      let res: string = '';

      if (isWeb) {
        res = await awsPreSignedURLUploadWeb(file);
      } else {
        res = await awsPreSignedURLUploadNative(file);
      }
      // console.log(res, 'res');
      setUploadedImages(prev => [...prev, { ...file, url: res }]);
      setSelectedImageUrl(res); // Set the selected image URL to the uploaded image URL
    } catch (error: any) {
      console.log(error, 'error');
    } finally {
      setLoader(false);
      console.log('finally');
    }
  };

  const handleFileUpdateChange = async (data: UploadedImage) => {
    await imageUploadRequest(data);
  };

  const handleGenerate = async () => {
    setSelectedImageUrl(null); // Reset selected image ID when generating new images
    if (!prompt.trim()) return;
    mutateGenerateWorkoutImage({
      prompt,
    });
  };

  const getScrollHeight = () => {
    if (Platform.OS === 'web') return isLargeScreen ? 500 : height * 0.9; // Fixed max height for web

    if (isExtraSmallDevice) {
      return isKeyboardVisible ? 340 : height * 0.9;
    }

    if (isMobileDevice) {
      return isKeyboardVisible ? 400 : height * 0.9;
    }

    return height * 0.9;
  };

  const scrollContainerStyle = useCallback(() => {
    return {
      maxHeight: getScrollHeight(),
    };
  }, [isKeyboardVisible, isMobileDevice, isExtraSmallDevice, height]);

  const handleFinish = () => {
    let payload = {
      formData: {
        image: selectedImageUrl || '',
      },
      queryParams: { id: slug },
    };

    console.log(payload, 'handleFinishpayload');
    mutateUpdatedWorkout(payload);
  };

  const TabButton = ({
    title,
    isActive,
    onPress,
  }: {
    title: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tabButton,
        isActive && styles.activeTab,
        Platform.select({
          web: { cursor: 'pointer' },
        }),
      ]}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderModalFooter = () => {
    const shouldShowFooter =
      activeTab === 'library' ||
      (activeTab === 'generate' && generatedImages.length > 0) ||
      (activeTab === 'upload' && uploadedImages.length > 0);

    return shouldShowFooter ? (
      <ModalFooter
        onCancel={onClose}
        onFinish={handleFinish}
        finishDisabled={!selectedImageUrl}
        isLoading={isPendingUpdateWorkout}
      />
    ) : null;
  };

  const handleTabClick = (tab: 'library' | 'generate') => {
    setActiveTab(tab);
    setSelectedImageUrl(null); // Reset selected image ID when switching tabs
  };

  const renderAssetLibraryContainer = useCallback(() => {
    if (isLoading) {
      return <Loading />;
    }
    if (!imageData || imageData.length === 0) {
      return (
        <View style={styles.libraryContainer}>
          <Text style={{ color: '#fff' }}>No images found</Text>
        </View>
      );
    }
    return (
      <View style={styles.libraryContainer}>
        <View style={styles.imageGrid}>
          {imageData.map((asset: IGeneratedWorkoutImage) => (
            <SelectableImage
              key={asset._id}
              url={asset.url}
              isSelected={selectedImageUrl === asset.url}
              onSelect={() => setSelectedImageUrl(asset.url)}
            />
          ))}
        </View>
      </View>
    );
  }, [imageData, isLoading, selectedImageUrl]);

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="white"
      useNativeDriver
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={Platform.select({
        web: isLargeScreen ? { margin: 0, justifyContent: 'flex-end' } : {},
        native: { margin: 0, justifyContent: 'flex-end' }, // Full-screen modal
      })}>
      <View
        style={Platform.select({
          web: isLargeScreen
            ? styles.modalContainer
            : tailwind('mx-auto h-full w-3/5 rounded-lg bg-NAVBAR_BACKGROUND p-4 pb-0'),
          native: styles.modalContainer,
        })}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Exercise Images - {workoutName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            <TabButton
              title="Asset Library"
              isActive={activeTab === 'library'}
              onPress={() => handleTabClick('library')}
            />
            <TabButton
              title="Generate Image"
              isActive={activeTab === 'generate'}
              onPress={() => handleTabClick('generate')}
            />
            <TabButton
              title="Upload"
              isActive={activeTab === 'upload'}
              onPress={() => setActiveTab('upload')}
            />
          </View>

          <ScrollView style={[scrollContainerStyle(), styles.libraryContainer]}>
            {activeTab === 'library' && renderAssetLibraryContainer()}
            {activeTab === 'generate' && (
              <View style={styles.contentContainer}>
                <View style={styles.generateContainer}>
                  <Text style={styles.generateTitle}>Generate images with AI</Text>
                  <TextInput
                    style={styles.promptInput}
                    placeholder="Describe the kind of image that you want"
                    placeholderTextColor="#888888"
                    value={prompt}
                    onChangeText={setPrompt}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top" // Aligns text to the top
                  />
                  <Text style={styles.promptHelper}>
                    Describe the exercise, equipment, colors, style, and background. Faces and
                    people aren’t supported.
                  </Text>
                  {errorMessage && (
                    <TextContainer
                      style={tailwind('text-3 mb-4 text-center text-red-400')}
                      data={errorMessage}
                    />
                  )}
                  <ActionButton
                    label={isGenerating ? 'Generating...' : 'Generate'}
                    onPress={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    style={[
                      styles.generateButton,
                      (!prompt.trim() || isGenerating) && styles.generateButtonDisabled,
                    ]}
                  />

                  {generatedImages.length > 0 && (
                    <View style={styles.generatedImagesContainer}>
                      <Text style={styles.generatedTitle}>Generated images</Text>

                      <View style={styles.grid}>
                        {generatedImages.map((url, index) => (
                          <SelectableImage
                            key={index}
                            url={url}
                            isSelected={selectedImageUrl === url}
                            onSelect={() => {
                              setSelectedImageUrl(url);
                              // Handle selection of generated images
                            }}
                          />
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}

            {activeTab === 'upload' && (
              <View style={styles.uploadContainer}>
                <Text style={styles.uploadTitle}>Upload your own image</Text>
                <Text style={styles.uploadHelper}>
                  Select an image from your device to use as the workout image
                </Text>

                <UploadButton
                  loader={loader}
                  uploadedImages={uploadedImages}
                  imageUploadRequest={handleFileUpdateChange}
                />
                {uploadedImages.length > 0 && (
                  <View style={styles.generatedImagesContainer}>
                    <Text style={styles.generatedTitle}>Uploaded images</Text>
                    <Text style={styles.generatedHelper}>
                      Select an image to use it for your exercise.
                    </Text>
                    <View style={styles.grid}>
                      {uploadedImages.map(image => (
                        <SelectableImage
                          key={image.id}
                          url={image.url}
                          isSelected={selectedImageUrl === image.url}
                          onSelect={() => {
                            setSelectedImageUrl(image.url);
                          }}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
          {renderModalFooter()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#252425',
  } as any,
  contentContainer: {
    // flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  tabButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
  activeTabText: {
    opacity: 1,
  },
  libraryContainer: {
    flex: 1,
    // flexGrow: 1,
    paddingBottom: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  generateContainer: {
    padding: 16,
  },
  generateButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  generatingButton: {
    opacity: 0.7,
  },
  generateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  promptInput: {
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333333',
  },
  promptHelper: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
    marginBottom: 16,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generatedImagesContainer: {
    marginTop: 24,
  },
  generatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  generatedHelper: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  uploadContainer: {
    padding: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  uploadHelper: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
