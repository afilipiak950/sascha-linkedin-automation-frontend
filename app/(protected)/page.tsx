import { Metadata } from 'next'
import Dashboard from '../../src/pages/Dashboard'

export const metadata: Metadata = {
  title: 'Dashboard - LinkedIn Automation',
}

export default function DashboardPage() {
  return <Dashboard />
} 