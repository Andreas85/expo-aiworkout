import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

interface SelectableImageProps {
  url: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

export default function SelectableImage({
  url,
  isSelected,
  onSelect,
  onDelete,
  showDelete = false,
}: SelectableImageProps) {
  const { isLargeScreen } = useWebBreakPoints();

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <>
      <View style={{ ...styles.container, width: isLargeScreen ? '50%' : '33%' }}>
        <TouchableOpacity
          onPress={onSelect}
          style={[
            styles.imageContainer,
            Platform.select({
              web: { cursor: 'pointer' },
            }),
          ]}>
          <Image source={{ uri: url }} style={styles.image} />
          <View style={styles.overlay}>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <AntDesign name="checksquare" size={16} color="#FFFFFF" />}
            </View>
            {showDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                style={[
                  styles.deleteButton,
                  Platform.select({
                    web: { cursor: 'pointer' },
                  }),
                ]}>
                <Entypo name="trash" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
