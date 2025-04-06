import { Metadata } from 'next'
import InteractionManagerSettings from '../../../src/pages/InteractionManagerSettings'

export const metadata: Metadata = {
  title: 'Interaktions-Manager - LinkedIn Automation',
}

export default function InteractionManagerPage() {
  return <InteractionManagerSettings />
} 