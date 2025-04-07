import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface SelectableImageProps {
  url: string;
  title: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SelectableImage({
  url,
  title,
  isSelected,
  onSelect,
}: SelectableImageProps) {
  return (
    <View style={styles.container}>
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
        </View>
      </TouchableOpacity>
      {/* <Text style={styles.title}>{title}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 2,
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
    // backgroundColor: '#8B5CF6',
    // borderColor: '#8B5CF6',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
