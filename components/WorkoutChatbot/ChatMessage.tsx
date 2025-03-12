import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

interface ChatMessageProps {
  isBot: boolean;
  children: React.ReactNode;
  wrapChildren?: boolean; // ✅ New prop to conditionally wrap children
}

export function ChatMessage({ isBot, children, wrapChildren }: ChatMessageProps) {
  return (
    <View style={styles.messageContainer}>
      <View style={[styles.messageHeader, isBot ? styles.botHeader : styles.userHeader]}>
        {isBot ? (
          <View style={[styles.iconContainer, styles.botIcon]}>
            <FontAwesome5 name="robot" size={16} color="#fff" />
          </View>
        ) : (
          <View style={[styles.iconContainer, styles.userIcon]}>
            <FontAwesome name="user" size={16} color="#fff" />
          </View>
        )}
        <Text style={styles.senderText}>{isBot ? 'Trainer Bot' : 'You'}</Text>
      </View>
      <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
        {/* ✅ Use the flag to wrap children when needed */}
        {wrapChildren ? (
          <View>{children}</View>
        ) : (
          <Text style={styles.messageText}>{children}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botHeader: {
    justifyContent: 'flex-start',
  },
  userHeader: {
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  botIcon: {
    backgroundColor: '#6b46c1',
  },
  userIcon: {
    backgroundColor: '#805ad5',
  },
  senderText: {
    fontSize: 12,
    color: '#bbb',
  },
  messageBubble: {
    maxWidth: '90%',
    borderRadius: 16,
    padding: 12,
    marginTop: 4,
    flex: 1,
  },
  botBubble: {
    backgroundColor: '#1a202c',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#6b46c1',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff',
  },
});
