import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Settings as SettingsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { login } from '../store/slices/authSlice';
import { RootState } from '../store';

const Login: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLinkedInConnect = async () => {
    try {
      // Hier kommt die LinkedIn OAuth-Logik
      // Nach erfolgreicher Verbindung:
      router.push('/dashboard');
    } catch (error) {
      console.error('LinkedIn-Verbindung fehlgeschlagen:', error);
    }
  };

  const features = [
    {
      title: 'KI-gestützte Posts',
      description: 'Automatische Generierung von professionellen LinkedIn-Posts mit GPT-4',
      icon: <AutoAwesomeIcon fontSize="large" />,
    },
    {
      title: 'Intelligente Interaktionen',
      description: 'Automatisierte Likes, Kommentare und Verbindungsanfragen basierend auf Ihrer Strategie',
      icon: <AnalyticsIcon fontSize="large" />,
    },
    {
      title: 'Anpassbare Einstellungen',
      description: 'Feinabstimmung der KI-Agenten und Automatisierungsstrategien',
      icon: <SettingsIcon fontSize="large" />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 800,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            LinkedIn Automation
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Verbinden Sie Ihr LinkedIn-Konto und lassen Sie unsere KI-Agenten für Sie arbeiten
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<LinkedInIcon />}
            onClick={handleLinkedInConnect}
            sx={{ mt: 3, mb: 4 }}
            disabled={loading}
          >
            {loading ? 'Verbindung wird hergestellt...' : 'Mit LinkedIn verbinden'}
          </Button>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Mehr erfahren">
                      <IconButton>
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 