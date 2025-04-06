import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
  Button,
  TextField,
} from '@mui/material';
import { RootState } from '../store';
import { fetchPreferences, updatePreferences } from '../store/slices/settingsSlice';

const InteractionManagerSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { preferences, loading, error } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  const handleSave = async () => {
    if (preferences) {
      await dispatch(updatePreferences(preferences));
    }
  };

  const strategies = [
    { value: 'aggressive', label: 'Aggressiv' },
    { value: 'moderate', label: 'Moderat' },
    { value: 'conservative', label: 'Konservativ' },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Interaktions-Manager Einstellungen
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Tägliche Limits */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Tägliche Limits
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Likes pro Tag
                </Typography>
                <Slider
                  value={preferences?.dailyLikeLimit || 50}
                  onChange={(_, value) => {
                    if (preferences) {
                      dispatch(updatePreferences({
                        ...preferences,
                        dailyLikeLimit: value as number,
                      }));
                    }
                  }}
                  min={0}
                  max={100}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Kommentare pro Tag
                </Typography>
                <Slider
                  value={preferences?.dailyCommentLimit || 20}
                  onChange={(_, value) => {
                    if (preferences) {
                      dispatch(updatePreferences({
                        ...preferences,
                        dailyCommentLimit: value as number,
                      }));
                    }
                  }}
                  min={0}
                  max={50}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Verbindungsanfragen pro Tag
                </Typography>
                <Slider
                  value={preferences?.dailyConnectionLimit || 25}
                  onChange={(_, value) => {
                    if (preferences) {
                      dispatch(updatePreferences({
                        ...preferences,
                        dailyConnectionLimit: value as number,
                      }));
                    }
                  }}
                  min={0}
                  max={50}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Strategien */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Like-Strategie</InputLabel>
              <Select
                value={preferences?.likeStrategy || 'moderate'}
                onChange={(e) => {
                  if (preferences) {
                    dispatch(updatePreferences({
                      ...preferences,
                      likeStrategy: e.target.value,
                    }));
                  }
                }}
              >
                {strategies.map((strategy) => (
                  <MenuItem key={strategy.value} value={strategy.value}>
                    {strategy.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Kommentar-Strategie</InputLabel>
              <Select
                value={preferences?.commentStrategy || 'moderate'}
                onChange={(e) => {
                  if (preferences) {
                    dispatch(updatePreferences({
                      ...preferences,
                      commentStrategy: e.target.value,
                    }));
                  }
                }}
              >
                {strategies.map((strategy) => (
                  <MenuItem key={strategy.value} value={strategy.value}>
                    {strategy.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Zielgruppen */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Zielgruppen
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ziel-Industrien"
                  value={preferences?.targetIndustries?.join(', ') || ''}
                  onChange={(e) => {
                    if (preferences) {
                      dispatch(updatePreferences({
                        ...preferences,
                        targetIndustries: e.target.value.split(',').map(i => i.trim()),
                      }));
                    }
                  }}
                  helperText="Komma-getrennte Liste von Industriesektoren"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ziel-Rollen"
                  value={preferences?.targetRoles?.join(', ') || ''}
                  onChange={(e) => {
                    if (preferences) {
                      dispatch(updatePreferences({
                        ...preferences,
                        targetRoles: e.target.value.split(',').map(r => r.trim()),
                      }));
                    }
                  }}
                  helperText="Komma-getrennte Liste von Jobtiteln"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Automatisierung */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Automatisierung
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences?.autoLike || false}
                      onChange={(e) => {
                        if (preferences) {
                          dispatch(updatePreferences({
                            ...preferences,
                            autoLike: e.target.checked,
                          }));
                        }
                      }}
                    />
                  }
                  label="Automatisches Liken"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences?.autoComment || false}
                      onChange={(e) => {
                        if (preferences) {
                          dispatch(updatePreferences({
                            ...preferences,
                            autoComment: e.target.checked,
                          }));
                        }
                      }}
                    />
                  }
                  label="Automatisches Kommentieren"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences?.autoConnect || false}
                      onChange={(e) => {
                        if (preferences) {
                          dispatch(updatePreferences({
                            ...preferences,
                            autoConnect: e.target.checked,
                          }));
                        }
                      }}
                    />
                  }
                  label="Automatische Verbindungsanfragen"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Speichern Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Wird gespeichert...' : 'Einstellungen speichern'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default InteractionManagerSettings; 