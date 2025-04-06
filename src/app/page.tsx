'use client';

import React from 'react';
import { Card, Title, Text, Tab, TabList, TabGroup, TabPanels, TabPanel } from '@tremor/react';
import { BarChart, LineChart } from '@tremor/react';
import { useAppSelector } from '../hooks';

const chartdata = [
  {
    date: "Jan 23",
    Connections: 167,
    Engagement: 145
  },
  // ... existing code ...
];

const recommendations = [
  {
    title: "Optimize Post Timing",
    description: "Schedule posts during peak engagement hours (9-11 AM)"
  },
  // ... existing code ...
];

export default function Home() {
  const user = useAppSelector((state) => state.auth.user);
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Dashboard</Title>
      <Text>Welcome back, {user?.name || 'User'}! Here's your activity overview.</Text>
      
      <TabGroup className="mt-6">
        <TabList>
          <Tab>Content</Tab>
          <Tab>Engagement</Tab>
          <Tab>Network</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <Title>Post Performance</Title>
                <BarChart 
                  data={chartdata}
                  index="date"
                  categories={["Connections", "Engagement"]}
                  colors={["blue", "teal"]}
                  yAxisWidth={48}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <Title>Engagement Trends</Title>
                <LineChart 
                  data={chartdata}
                  index="date"
                  categories={["Engagement"]}
                  colors={["teal"]}
                  yAxisWidth={48}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <Title>Network Growth</Title>
                <LineChart 
                  data={chartdata}
                  index="date"
                  categories={["Connections"]}
                  colors={["blue"]}
                  yAxisWidth={48}
                />
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <div className="mt-6">
        <Card>
          <Title>Recommendations</Title>
          <div className="mt-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <Text className="font-medium">{rec.title}</Text>
                <Text className="text-gray-600">{rec.description}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
} 