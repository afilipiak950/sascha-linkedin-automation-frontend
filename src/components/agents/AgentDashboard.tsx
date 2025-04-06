'use client';

import { Box, Container, Grid, Typography } from '@mui/material';
import {
  ContentStrategyPanel,
  EngagementAnalysisPanel,
  NetworkGrowthPanel,
  MetricsPanel
} from '../panels';

export default function AgentDashboard() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          LinkedIn Automation Dashboard
        </Typography>
        
        <MetricsPanel />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ContentStrategyPanel />
          </Grid>
          <Grid item xs={12} md={6}>
            <EngagementAnalysisPanel />
          </Grid>
          <Grid item xs={12}>
            <NetworkGrowthPanel />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 