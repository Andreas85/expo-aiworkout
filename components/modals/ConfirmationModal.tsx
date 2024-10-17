import React from 'react';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import ModalWrapper from './ModalWrapper';
import { ActionButton } from '../atoms/ActionButton';

interface IConfirmationModal {
  isModalVisible: boolean;
  closeModal: () => void;
  message: string;
  title?: string;
  labelAction: string;
  isLoading: boolean;
  handleAction: () => void;
}

function ConfirmationModal(props: IConfirmationModal) {
  const { isModalVisible, title, closeModal, handleAction, isLoading, message, labelAction } =
    props;

  return (
    <>
      <ModalWrapper
        isModalVisible={isModalVisible}
        headerTitle={title ?? ''}
        closeModal={closeModal}>
        <Container>
          <Container className="w-full space-y-4" style={tailwind('gap-y-4')}>
            <TextContainer style={tailwind('text-center text-sm')} data={message} />

            <Container style={tailwind('flex flex-row items-center justify-center gap-2')}>
              <ActionButton
                label={'Cancel'}
                onPress={closeModal}
                isOutline={true}
                style={tailwind('grow rounded-md')}
              />
              <ActionButton
                uppercase={true}
                isLoading={isLoading}
                label={labelAction}
                onPress={handleAction}
                style={tailwind('grow rounded-md')}
              />
            </Container>
          </Container>
        </Container>
      </ModalWrapper>
    </>
  );
}

export default ConfirmationModal;
