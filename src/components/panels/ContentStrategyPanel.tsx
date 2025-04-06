'use client';

import { Card, Title, DonutChart, Subtitle } from '@tremor/react';
import { Box } from '@mui/material';

const contentData = [
  {
    name: 'Technologie',
    value: 35,
  },
  {
    name: 'Leadership',
    value: 25,
  },
  {
    name: 'Innovation',
    value: 20,
  },
  {
    name: 'Best Practices',
    value: 15,
  },
  {
    name: 'Branchen-News',
    value: 5,
  },
];

const valueFormatter = (number: number) => `${number}%`;

export default function ContentStrategyPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <Title>Content-Strategie</Title>
        <Subtitle>
          Verteilung Ihrer Content-Themen
        </Subtitle>
        <DonutChart
          className="mt-6"
          data={contentData}
          category="value"
          index="name"
          valueFormatter={valueFormatter}
          colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
        />
      </Card>
    </Box>
  );
} 