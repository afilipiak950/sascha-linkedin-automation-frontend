'use client'

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
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
  const dispatch = useAppDispatch();
  const { preferences, loading, error } = useAppSelector((state: RootState) => state.settings);

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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Interaktions-Manager Einstellungen
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSave} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Tägliche Interaktionen
                </Typography>
                <Slider
                  defaultValue={30}
                  step={5}
                  marks
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Interaktionstyp</InputLabel>
                  <Select
                    value="all"
                    label="Interaktionstyp"
                  >
                    <MenuItem value="all">Alle</MenuItem>
                    <MenuItem value="likes">Nur Likes</MenuItem>
                    <MenuItem value="comments">Nur Kommentare</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Zielgruppe</InputLabel>
                  <Select
                    value="network"
                    label="Zielgruppe"
                  >
                    <MenuItem value="network">Mein Netzwerk</MenuItem>
                    <MenuItem value="industry">Gleiche Branche</MenuItem>
                    <MenuItem value="custom">Benutzerdefiniert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Schlüsselwörter für Interaktionen"
                  helperText="Geben Sie Schlüsselwörter ein, auf die der Bot reagieren soll"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Automatische Verbindungsanfragen"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Einstellungen speichern
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default InteractionManagerSettings; 