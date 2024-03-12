import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '~/features/authentication/useUser';
import Spinner from '~/ui/Spinner';

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  // 1. load the authenticated user
  const { isLoading, isAuthenticated, fetchStatus } = useUser();

  // 2. if the user is not authenticated, redirect to the login page
  useEffect(() => {
    if (!isAuthenticated && !isLoading && fetchStatus !== 'fetching') {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate, fetchStatus]);

  // 3. while loading, show a spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. if the user is authenticated, render the app
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
