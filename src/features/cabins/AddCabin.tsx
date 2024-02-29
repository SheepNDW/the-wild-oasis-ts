import { useState } from 'react';
import CreateCabinForm from '~/features/cabins/CreateCabinForm';
import Button from '~/ui/Button';
import Modal from '~/ui/Modal';

function AddCabin() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCloseModal = () => setIsOpenModal(false);

  return (
    <div>
      <Button onClick={() => setIsOpenModal((show) => !show)}>Add new cabin</Button>

      {isOpenModal && (
        <Modal onClose={handleCloseModal}>
          <CreateCabinForm onCloseModal={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default AddCabin;
