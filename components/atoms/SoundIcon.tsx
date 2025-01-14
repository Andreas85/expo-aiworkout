import { interactionStore } from '@/store/interactionStore';
import React, { useEffect } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';

export default function SoundIcon() {
  const hasUserInteracted = interactionStore(state => state.hasInteracted);
  const isMuted = interactionStore(state => state.muted);
  const { updateMuted } = interactionStore();

  useEffect(() => {
    if (Platform.OS === 'web') {
      updateMuted(!hasUserInteracted);
    }
  }, [hasUserInteracted]);

  const handleMuteToggle = () => {
    if (Platform.OS === 'web') {
      updateMuted(!isMuted);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleMuteToggle}
      style={{
        flex: 1,
      }}>
      <Text style={{ fontSize: 24, color: '#fff' }}>{isMuted ? '🔇' : '🔊'}</Text>
    </TouchableOpacity>
  );
}
