'use client';

import { Card, Title, BarChart, Subtitle } from '@tremor/react';
import { Box } from '@mui/material';

const chartdata = [
  {
    name: 'Montag',
    'Likes': 23,
    'Kommentare': 12,
    'Shares': 8,
  },
  {
    name: 'Dienstag',
    'Likes': 35,
    'Kommentare': 15,
    'Shares': 10,
  },
  {
    name: 'Mittwoch',
    'Likes': 42,
    'Kommentare': 18,
    'Shares': 12,
  },
  {
    name: 'Donnerstag',
    'Likes': 38,
    'Kommentare': 20,
    'Shares': 15,
  },
  {
    name: 'Freitag',
    'Likes': 45,
    'Kommentare': 25,
    'Shares': 18,
  },
];

const dataFormatter = (number: number) => {
  return Intl.NumberFormat('de').format(number).toString();
};

export default function EngagementAnalysisPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <Title>Engagement-Analyse</Title>
        <Subtitle>
          Übersicht der Interaktionen mit Ihren LinkedIn-Posts
        </Subtitle>
        <BarChart
          className="mt-6"
          data={chartdata}
          index="name"
          categories={['Likes', 'Kommentare', 'Shares']}
          colors={['blue', 'teal', 'amber']}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
        />
      </Card>
    </Box>
  );
} 