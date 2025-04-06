import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Switch,
  FormControlLabel,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { fetchStats } from '../store/slices/interactionsSlice';
import { fetchPreferences } from '../store/slices/settingsSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state: RootState) => state.interactions);
  const { preferences } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchPreferences());
  }, [dispatch]);

  const agents = [
    {
      id: 'post-generator',
      name: 'Post-Generator',
      description: 'Generiert professionelle LinkedIn-Posts basierend auf Ihren Keywords',
      icon: <AutoAwesomeIcon fontSize="large" />,
      status: preferences?.postFrequency ? 'active' : 'inactive',
    },
    {
      id: 'interaction-manager',
      name: 'Interaktions-Manager',
      description: 'Verwaltet Likes, Kommentare und Verbindungsanfragen',
      icon: <AnalyticsIcon fontSize="large" />,
      status: preferences?.likeStrategy ? 'active' : 'inactive',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Überschrift */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            Verwalten Sie Ihre LinkedIn-Automatisierung
          </Typography>
        </Grid>

        {/* Statistiken */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Tägliche Statistiken
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Neue Verbindungen
              </Typography>
              <Typography variant="h4">{stats.dailyConnections}</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Likes
              </Typography>
              <Typography variant="h4">{stats.dailyLikes}</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Kommentare
              </Typography>
              <Typography variant="h4">{stats.dailyComments}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* KI-Agenten */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              KI-Agenten
            </Typography>
            <Grid container spacing={2}>
              {agents.map((agent) => (
                <Grid item xs={12} key={agent.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {agent.icon}
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6">{agent.name}</Typography>
                          <Typography color="text.secondary">
                            {agent.description}
                          </Typography>
                        </Box>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={agent.status === 'active'}
                            onChange={() => {
                              // Toggle-Agent-Logik hier
                            }}
                          />
                        }
                        label={agent.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      />
                    </CardContent>
                    <CardActions>
                      <Button
                        startIcon={agent.status === 'active' ? <PauseIcon /> : <PlayArrowIcon />}
                        size="small"
                      >
                        {agent.status === 'active' ? 'Pausieren' : 'Starten'}
                      </Button>
                      <Button
                        startIcon={<SettingsIcon />}
                        size="small"
                      >
                        Einstellungen
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Einstellungen */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Einstellungen
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Post-Frequenz
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={preferences?.postFrequency || 0}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {preferences?.postFrequency || 0} Posts pro Woche
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  KI-Ton
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {preferences?.aiTone || 'Professionell'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 