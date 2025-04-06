'use client';

import { Card, Title, Grid, Metric, Text } from '@tremor/react';
import { Box } from '@mui/material';
import { TrendingUp, Group, ThumbUp, Comment } from '@mui/icons-material';

const metrics = [
  {
    title: 'Reichweite',
    metric: '12.456',
    description: '+14% vs. letzter Monat',
    icon: TrendingUp,
    color: 'blue',
  },
  {
    title: 'Neue Verbindungen',
    metric: '245',
    description: '+22% vs. letzter Monat',
    icon: Group,
    color: 'emerald',
  },
  {
    title: 'Likes',
    metric: '892',
    description: '+18% vs. letzter Monat',
    icon: ThumbUp,
    color: 'amber',
  },
  {
    title: 'Kommentare',
    metric: '156',
    description: '+25% vs. letzter Monat',
    icon: Comment,
    color: 'indigo',
  },
];

export default function MetricsPanel() {
  return (
    <Box sx={{ p: 2 }}>
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
        {metrics.map((item) => (
          <Card key={item.title}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <item.icon sx={{ color: `${item.color}.500` }} />
              <Title>{item.title}</Title>
            </Box>
            <Metric>{item.metric}</Metric>
            <Text>{item.description}</Text>
          </Card>
        ))}
      </Grid>
    </Box>
  );
} 