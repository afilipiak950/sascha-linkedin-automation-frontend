'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const InteractionManagerSettings = dynamic(
  () => import('../../../src/pages/InteractionManagerSettings'),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    ),
  }
);

export default function InteractionManagerPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    }>
      <InteractionManagerSettings />
    </Suspense>
  );
} 