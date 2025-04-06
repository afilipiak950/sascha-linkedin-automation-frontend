import React from 'react'
import Layout from '@/src/components/Layout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
} 