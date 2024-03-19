import { useCheckout } from '~/features/check-in-out/useCheckout';
import Button from '~/ui/Button';

function CheckoutButton({ bookingId }: { bookingId: number }) {
  const { checkout, isCheckingOut } = useCheckout();

  return (
    <Button
      color="primary"
      size="small"
      onClick={() => checkout(bookingId)}
      disabled={isCheckingOut}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
