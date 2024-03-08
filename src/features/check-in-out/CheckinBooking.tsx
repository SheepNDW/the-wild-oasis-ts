import { useEffect, useState } from 'react';
import styled from 'styled-components';
import BookingDataBox from '~/features/bookings/BookingDataBox';
import { useBooking } from '~/features/bookings/useBooking';
import { useCheckin } from '~/features/check-in-out/useCheckin';

import Button from '~/ui/Button';
import ButtonGroup from '~/ui/ButtonGroup';
import ButtonText from '~/ui/ButtonText';
import Checkbox from '~/ui/Checkbox';
import Heading from '~/ui/Heading';
import Row from '~/ui/Row';
import Spinner from '~/ui/Spinner';

import { useMoveBack } from '~/hooks/useMoveBack';
import { formatCurrency } from '~/utils/helpers';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const [confirmPaid, setConfirmPaid] = useState(false);
  const { booking, isLoading } = useBooking();
  const { checkin, isCheckingIn } = useCheckin();

  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking.isPaid]);

  if (isLoading) return <Spinner />;

  const { id: bookingId, guests, totalPrice, numGuests, hasBreakfast, numNights } = booking;

  function handleCheckin() {
    if (!confirmPaid) return;
    checkin(bookingId);
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          disabled={confirmPaid || isCheckingIn}
          id="confirm"
        >
          I confirm that {guests.fullName} has paid the total amount of {formatCurrency(totalPrice)}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button color="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;