import { Metadata } from 'next'
import Login from '@/src/pages/Login'

export const metadata: Metadata = {
  title: 'Login - LinkedIn Automation',
}

export default function LoginPage() {
  return <Login />
} 