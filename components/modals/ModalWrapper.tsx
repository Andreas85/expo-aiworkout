import React from 'react';
import Modal from 'react-native-modal';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import { IAddAndEditWorkoutModalProps } from '@/utils/interfaces';
import { Platform, ScrollView, View, Dimensions } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const { height: screenHeight } = Dimensions.get('window');

function ModalWrapper(props: IAddAndEditWorkoutModalProps) {
  const { isModalVisible, closeModal, headerTitle, children, footerChildren } = props;
  const { isExtraLargeScreenOnly, isLargeAndMediumScreen, isExtraSmallScreenOnly } =
    useWebBreakPoints();

  return (
    <Container style={tailwind('bg-black')}>
      <Modal
        isVisible={isModalVisible}
        backdropColor="white"
        onBackdropPress={closeModal}
        useNativeDriver={true}
        animationIn="fadeIn"
        animationOut="fadeOut">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
            }}
            style={{ maxHeight: screenHeight * 0.8 }}>
            <Container
              style={Platform.select({
                web: tailwind(
                  `flex gap-4 rounded-xl bg-black p-6
                   ${isExtraLargeScreenOnly && 'm-auto w-2/5 '} 
                   ${isLargeAndMediumScreen && 'm-auto w-3/5 '} 
                   ${isExtraSmallScreenOnly && 'm-auto w-11/12 '}
                 `,
                ),
                native: tailwind('flex gap-4 rounded-xl bg-black p-6'),
              })}>
              {headerTitle && (
                <Container style={tailwind('mb-4 flex items-center justify-center')}>
                  <TextContainer style={tailwind('text-lg font-bold')} data={headerTitle} />
                </Container>
              )}
              <Container style={tailwind('flex-grow')}>{children}</Container>
              <Container style={tailwind('mt-4')}>{footerChildren}</Container>
            </Container>
          </ScrollView>
        </View>
      </Modal>
    </Container>
  );
}

export default ModalWrapper;
