import { Metadata } from 'next'
import Layout from '../../src/components/Layout'
import { auth } from '../../src/utils/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard - LinkedIn Automation',
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return <Layout>{children}</Layout>
} 