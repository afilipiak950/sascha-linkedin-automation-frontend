import { Metadata } from 'next'
import PostGeneratorSettings from '../../../src/pages/PostGeneratorSettings'

export const metadata: Metadata = {
  title: 'Post-Generator - LinkedIn Automation',
}

export default function PostGeneratorPage() {
  return <PostGeneratorSettings />
} 