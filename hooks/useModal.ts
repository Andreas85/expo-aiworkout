import { useState } from 'react';

export default function useModal() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const showModal = () => setOpenModal(true);
  const hideModal = () => setOpenModal(false);

  return {
    openModal,
    showModal,
    hideModal,
  };
}
