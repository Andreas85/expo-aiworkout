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
  isLoading?: boolean;
  disabledAction?: boolean;
  isDeleteAction?: boolean;
  handleAction: () => void;
  responseError?: string;
}

function ConfirmationModal(props: IConfirmationModal) {
  const {
    isModalVisible,
    title,
    closeModal,
    handleAction,
    isLoading,
    message,
    labelAction,
    isDeleteAction,
    disabledAction,
    responseError,
  } = props;

  return (
    <>
      <ModalWrapper
        isModalVisible={isModalVisible}
        headerTitle={title ?? ''}
        closeModal={closeModal}>
        <Container>
          <Container className="w-full space-y-4" style={tailwind('gap-y-4')}>
            <TextContainer style={tailwind('text-center text-sm')} data={message} />
            {responseError && (
              <TextContainer
                style={tailwind('text-3 text-center text-red-400')}
                className="text-center text-sm !text-red-400"
                data={responseError}
              />
            )}
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
                disabled={disabledAction || isLoading}
                onPress={handleAction}
                style={tailwind(`grow rounded-md ${isDeleteAction ? 'bg-red-500' : ''}`)}
              />
            </Container>
          </Container>
        </Container>
      </ModalWrapper>
    </>
  );
}

export default ConfirmationModal;
