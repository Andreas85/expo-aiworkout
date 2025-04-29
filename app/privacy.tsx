import { StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const privacyMarkdown = `
# Privacy Policy for AI Fitness Journey

**Effective Date:** April 29, 2023

Thank you for using **AI Fitness Journey**. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.

## 1. Information We Collect

We may collect the following types of information:

- **Personal Information** (such as name, email) – only if you choose to provide it.
- **Device Information** – such as device type, operating system, and unique identifiers.
- **Usage Data** – information about how you use the app (e.g., time spent, features used).

## 2. How We Use Your Information

We use your data to:

- Improve app functionality and user experience.
- Provide personalized workout and fitness recommendations.
- Monitor app performance and fix issues.

## 3. Sharing Your Information

We do not sell or rent your personal information. We may share data with:

- Service providers who help us run the app.
- Legal authorities if required by law.

## 4. Data Security

We take reasonable measures to protect your information from unauthorized access.

## 5. Your Choices

You can:

- Stop using the app at any time.
- Contact us to access or delete your personal data (if any).

## 6. Children's Privacy

We do not knowingly collect data from children under 13.

## 7. Changes to This Policy

We may update this Privacy Policy. Any changes will be posted here with a new effective date.

## 8. Contact Us

If you have any questions, please contact us at:  
📧 andx84@gmail.com
`;

export default function PrivacyScreen() {
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={Platform.select({
            web: tailwind(`${!isLargeScreen ? 'mt-24 w-full px-32 ' : 'p-4'} flex-1`),
            native: tailwind('!mt-0 flex-1'),
          })}
          showsVerticalScrollIndicator={false}>
          <Markdown>{privacyMarkdown}</Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
});
