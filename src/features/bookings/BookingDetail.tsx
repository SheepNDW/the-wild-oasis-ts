import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '~/ui/Button';
import ButtonGroup from '~/ui/ButtonGroup';
import ButtonText from '~/ui/ButtonText';
import ConfirmDelete from '~/ui/ConfirmDelete';
import Heading from '~/ui/Heading';
import Modal from '~/ui/Modal';
import Row from '~/ui/Row';
import Spinner from '~/ui/Spinner';
import Tag from '~/ui/Tag';

import BookingDataBox from '~/features/bookings/BookingDataBox';
import { useBooking } from '~/features/bookings/useBooking';
import { useDeleteBooking } from '~/features/bookings/useDeleteBooking';
import { useCheckout } from '~/features/check-in-out/useCheckout';
import { useMoveBack } from '~/hooks/useMoveBack';
import Empty from '~/ui/Empty';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  const { checkout, isCheckingOut } = useCheckout();

  const { deleteBooking, isDeleteingBooking } = useDeleteBooking();

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;

  const { status, id: bookingId } = booking;

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      <ButtonGroup>
        {status === 'unconfirmed' && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>Check in</Button>
        )}

        {status === 'checked-in' && (
          <Button onClick={() => checkout(bookingId)} disabled={isCheckingOut}>
            Check out
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete-booking">
            <Button color="danger">Delete</Button>
          </Modal.Open>

          <Modal.Window name="delete-booking">
            <ConfirmDelete
              resourceName="booking"
              onConfirm={() => deleteBooking(bookingId, { onSettled: moveBack })}
              disabled={isDeleteingBooking}
            />
          </Modal.Window>
        </Modal>

        <Button color="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
