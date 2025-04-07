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
// Dummy data for Asset Library
const dummyAssets = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
    title: 'Push-ups',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&q=80',
    title: 'Squats',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&q=80',
    title: 'Plank',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=500&q=80',
    title: 'Lunges',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&q=80',
    title: 'Plank',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=500&q=80',
    title: 'Lunges',
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500&q=80',
    title: 'Plank',
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=500&q=80',
    title: 'Lunges',
  },
];

interface ImageGenerationModalProps {
  isVisible: boolean;
  onClose: () => void;
  exerciseName: string;
}

export default function ImageGenerationModal({
  isVisible,
  onClose,
  exerciseName,
}: ImageGenerationModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'generate'>('library');
  const { isLargeScreen } = useWebBreakPoints();
  const { isExtraSmallDevice, isMobileDevice } = useBreakPoints();
  const isKeyboardVisible = useKeyboardVisibility();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const { height } = useWindowDimensions();
  const handleGenerate = async () => {
    setSelectedImageId(null); // Reset selected image ID when generating new images
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo, add a random image from dummy assets
      const newImage = dummyAssets[Math.floor(Math.random() * dummyAssets.length)].url;
      setGeneratedImages(prev => [...prev, newImage]);
      setPrompt(''); // Clear the prompt after generating
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
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
    onClose();
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
    if (activeTab === 'library') {
      return (
        <ModalFooter onCancel={onClose} onFinish={handleFinish} finishDisabled={!selectedImageId} />
      );
    }

    if (activeTab === 'generate' && generatedImages.length > 0) {
      return (
        <ModalFooter onCancel={onClose} onFinish={handleFinish} finishDisabled={!selectedImageId} />
      );
    }

    return null;
  };

  const handleTabClick = (tab: 'library' | 'generate') => {
    setActiveTab(tab);
    setSelectedImageId(null); // Reset selected image ID when switching tabs
  };

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
            <Text style={styles.title}>Exercise Images - {exerciseName}</Text>
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
          </View>

          <ScrollView style={[scrollContainerStyle(), styles.libraryContainer]}>
            {activeTab === 'library' ? (
              <View style={styles.imageGrid}>
                {dummyAssets.map(asset => (
                  <SelectableImage
                    key={asset.id}
                    url={asset.url}
                    title={asset.title}
                    isSelected={selectedImageId === asset.id}
                    onSelect={() => setSelectedImageId(asset.id)}
                  />
                ))}
              </View>
            ) : (
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

                  <ActionButton
                    label="Generate"
                    onPress={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    isLoading={isGenerating}
                    style={[
                      styles.generateButton,
                      (!prompt.trim() || isGenerating) && styles.generateButtonDisabled,
                    ]}
                  />

                  {generatedImages.length > 0 && (
                    <View style={styles.generatedImagesContainer}>
                      <Text style={styles.generatedTitle}>Generated images</Text>
                      <Text style={styles.generatedHelper}>
                        These images are stored for 14 days, then removed. To keep one, select it
                        and save it for later.
                      </Text>
                      <View style={styles.grid}>
                        {generatedImages.map((url, index) => (
                          <SelectableImage
                            key={index}
                            url={url}
                            title={`Generated ${index + 1}`}
                            isSelected={selectedImageId === url}
                            onSelect={() => {
                              setSelectedImageId(url);
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
});
