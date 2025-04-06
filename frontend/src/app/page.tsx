'use client';

import { Card, Title, Text } from '@tremor/react';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from '@tremor/react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('content');

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>LinkedIn Automation Dashboard</Title>
      <Text>Optimieren Sie Ihre LinkedIn-Präsenz mit KI-gestützten Analysen</Text>

      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {['content', 'engagement', 'network'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <Title>Erfolgsrate</Title>
            <BarChart
              className="mt-6"
              data={[
                {
                  name: 'Content',
                  value: 85,
                },
                {
                  name: 'Engagement',
                  value: 75,
                },
                {
                  name: 'Network',
                  value: 90,
                },
              ]}
              index="name"
              categories={['value']}
              colors={['blue']}
              valueFormatter={(number) => `${number}%`}
              yAxisWidth={48}
            />
          </Card>

          <Card>
            <Title>Aktivitätstrends</Title>
            <LineChart
              className="mt-6"
              data={[
                {
                  date: 'Jan 22',
                  'Neue Verbindungen': 100,
                  'Post Engagement': 150,
                },
                {
                  date: 'Feb 22',
                  'Neue Verbindungen': 120,
                  'Post Engagement': 180,
                },
                {
                  date: 'Mär 22',
                  'Neue Verbindungen': 170,
                  'Post Engagement': 220,
                },
              ]}
              index="date"
              categories={['Neue Verbindungen', 'Post Engagement']}
              colors={['blue', 'green']}
              valueFormatter={(number) => `${number}`}
              yAxisWidth={48}
            />
          </Card>

          <Card>
            <Title>Top Keywords</Title>
            <div className="mt-6">
              {[
                { keyword: 'KI', count: 245 },
                { keyword: 'Automation', count: 189 },
                { keyword: 'Marketing', count: 156 },
                { keyword: 'LinkedIn', count: 134 },
                { keyword: 'Growth', count: 98 },
              ].map((item) => (
                <div
                  key={item.keyword}
                  className="flex items-center justify-between py-2"
                >
                  <Text>{item.keyword}</Text>
                  <Text>{item.count}</Text>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {activeTab === 'content' && (
          <div className="mt-6">
            <Card>
              <Title>Content-Strategie Empfehlungen</Title>
              <div className="mt-4 space-y-4">
                {[
                  'Teilen Sie mehr Beiträge über KI-Trends',
                  'Erhöhen Sie die Posting-Frequenz auf 3x pro Woche',
                  'Nutzen Sie mehr Video-Content',
                  'Engagieren Sie sich in relevanten Gruppen',
                ].map((recommendation, index) => (
                  <div
                    key={index}
                    className="p-4 bg-blue-50 rounded-lg text-blue-700"
                  >
                    {recommendation}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
} 