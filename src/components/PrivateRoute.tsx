import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!token) {
    return null; // oder eine Lade-Animation
  }

  return <>{children}</>;
};

export default PrivateRoute; 