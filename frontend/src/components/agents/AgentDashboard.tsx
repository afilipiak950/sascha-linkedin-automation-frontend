import React, { useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import ContentStrategyPanel from './ContentStrategyPanel';
import EngagementAnalysisPanel from './EngagementAnalysisPanel';
import NetworkGrowthPanel from './NetworkGrowthPanel';
import MetricsPanel from './MetricsPanel';

const AgentDashboard: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('content');

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          KI-Agenten Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {selectedAgent === 'content' && <ContentStrategyPanel />}
            {selectedAgent === 'engagement' && <EngagementAnalysisPanel />}
            {selectedAgent === 'network' && <NetworkGrowthPanel />}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <MetricsPanel />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AgentDashboard; 