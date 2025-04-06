import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Slider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { RootState } from '../store';
import { fetchPreferences, updatePreferences } from '../store/slices/settingsSlice';

const PostGeneratorSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { preferences, loading, error } = useAppSelector((state: RootState) => state.settings);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (preferences?.targetKeywords) {
      setKeywords(preferences.targetKeywords);
    }
  }, [preferences]);

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSave = async () => {
    if (preferences) {
      await dispatch(updatePreferences({
        ...preferences,
        targetKeywords: keywords,
      }));
    }
  };

  const tones = [
    { value: 'professional', label: 'Professionell' },
    { value: 'casual', label: 'Lässig' },
    { value: 'enthusiastic', label: 'Enthusiastisch' },
    { value: 'informative', label: 'Informativ' },
  ];

  const styles = [
    { value: 'news', label: 'Nachrichten' },
    { value: 'story', label: 'Story' },
    { value: 'question', label: 'Frage' },
    { value: 'tip', label: 'Tipp' },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Hier kommt die Logik zum Speichern der Einstellungen
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Post-Generator Einstellungen
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Keywords und Themen"
                  helperText="Geben Sie Keywords und Themen ein, die für Ihre Posts relevant sind"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Ton</InputLabel>
                  <Select
                    value="professional"
                    label="Ton"
                  >
                    <MenuItem value="professional">Professionell</MenuItem>
                    <MenuItem value="casual">Locker</MenuItem>
                    <MenuItem value="formal">Formell</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Post-Länge</InputLabel>
                  <Select
                    value="medium"
                    label="Post-Länge"
                  >
                    <MenuItem value="short">Kurz</MenuItem>
                    <MenuItem value="medium">Mittel</MenuItem>
                    <MenuItem value="long">Lang</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Posts pro Woche
                </Typography>
                <Slider
                  defaultValue={3}
                  step={1}
                  marks
                  min={1}
                  max={7}
                  valueLabelDisplay="auto"
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

export default PostGeneratorSettings; 