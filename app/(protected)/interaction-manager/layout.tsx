import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interaktions-Manager - LinkedIn Automation',
};

export default function InteractionManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 