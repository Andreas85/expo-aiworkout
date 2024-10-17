import React from 'react';
import Modal from 'react-native-modal';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import { IAddAndEditWorkoutModalProps } from '@/utils/interfaces';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

function ModalWrapper(props: IAddAndEditWorkoutModalProps) {
  const { isModalVisible, closeModal, headerTitle, children, footerChildren } = props;
  const { isExtraLargeScreenOnly, isLargeAndMediumScreen, isExtraSmallScreenOnly } =
    useWebBreakPoints();

  return (
    <Container style={tailwind('bg-black')}>
      <Modal isVisible={isModalVisible} backdropColor="white" onBackdropPress={closeModal}>
        <Container
          style={Platform.select({
            web: tailwind(
              `flex gap-4 rounded-xl  bg-black p-6
                ${isExtraLargeScreenOnly && 'm-auto w-2/5 '} 
                ${isLargeAndMediumScreen && 'm-auto w-3/5 '} 
                ${isExtraSmallScreenOnly && 'm-auto w-11/12 '}
              `,
            ),
            native: tailwind('flex gap-4 rounded-xl bg-black p-6'),
          })}>
          {headerTitle && (
            <Container style={tailwind('flex items-center justify-center')}>
              <TextContainer style={tailwind('text-lg font-bold')} data={headerTitle} />
            </Container>
          )}
          <Container style={tailwind('')}>{children}</Container>
          <Container style={tailwind('')}>{footerChildren}</Container>
        </Container>
      </Modal>
    </Container>
  );
}

export default ModalWrapper;
