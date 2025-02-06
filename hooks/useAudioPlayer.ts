import { useState, useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

type AudioPlayerHook = {
  isPlaying: boolean;
  duration: number;
  position: number;
  startAudio: (muted?: boolean) => Promise<void>;
  loadAudio: (uri: string) => Promise<void>;
  playPauseAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
};

export const useAudioPlayer = (): AudioPlayerHook => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async (uri: string) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    // const { sound } = await Audio.Sound.createAsync(
    //   { uri },
    //   { shouldPlay: false },
    //   onPlaybackStatusUpdate,
    // );

    const { sound } = await Audio.Sound.createAsync(uri as any);
    soundRef.current = sound;
  };

  //   const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
  //     if (!status.isLoaded) return;

  //     setDuration(status.durationMillis || 0);
  //     setPosition(status.positionMillis || 0);
  //     setIsPlaying(status.isPlaying);
  //   };

  const playPauseAudio = async () => {
    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
    }
  };

  const startAudio = async (muted?: boolean) => {
    if (muted) return;
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(positionMillis);
    }
  };

  const setVolume = async (volume: number) => {
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(volume);
    }
  };

  return {
    isPlaying,
    duration,
    position,
    loadAudio,
    playPauseAudio,
    stopAudio,
    seekTo,
    setVolume,
    startAudio,
  };
};
