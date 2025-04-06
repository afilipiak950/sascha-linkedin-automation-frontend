import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    { title: 'Posts generiert', value: '0' },
    { title: 'Interaktionen', value: '0' },
    { title: 'Neue Verbindungen', value: '0' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Willkommen, {user?.name || 'Benutzer'}!
        </Typography>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.title}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography component="p" variant="h4">
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Letzte Aktivitäten
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keine Aktivitäten vorhanden.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 