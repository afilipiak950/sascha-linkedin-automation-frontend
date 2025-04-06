'use client';

import { Card, Title, LineChart, Subtitle } from '@tremor/react';
import { Box } from '@mui/material';

const growthData = [
  {
    date: 'Jan 24',
    'Neue Verbindungen': 45,
    'Akzeptierte Anfragen': 38,
  },
  {
    date: 'Feb 24',
    'Neue Verbindungen': 52,
    'Akzeptierte Anfragen': 43,
  },
  {
    date: 'Mär 24',
    'Neue Verbindungen': 61,
    'Akzeptierte Anfragen': 52,
  },
  {
    date: 'Apr 24',
    'Neue Verbindungen': 58,
    'Akzeptierte Anfragen': 49,
  },
  {
    date: 'Mai 24',
    'Neue Verbindungen': 63,
    'Akzeptierte Anfragen': 55,
  },
];

const dataFormatter = (number: number) => {
  return Intl.NumberFormat('de').format(number).toString();
};

export default function NetworkGrowthPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <Title>Netzwerk-Wachstum</Title>
        <Subtitle>
          Entwicklung Ihrer LinkedIn-Verbindungen
        </Subtitle>
        <LineChart
          className="mt-6"
          data={growthData}
          index="date"
          categories={['Neue Verbindungen', 'Akzeptierte Anfragen']}
          colors={['emerald', 'blue']}
          valueFormatter={dataFormatter}
          yAxisWidth={40}
        />
      </Card>
    </Box>
  );
} 