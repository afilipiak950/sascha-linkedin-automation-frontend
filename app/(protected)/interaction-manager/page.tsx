'use client';

import { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'Interaktions-Manager - LinkedIn Automation',
}

export default function InteractionManagerPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    }>
      <InteractionManagerSettings />
    </Suspense>
  )
} 