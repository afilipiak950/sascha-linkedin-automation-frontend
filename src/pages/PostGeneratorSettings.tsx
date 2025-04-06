import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const dispatch = useDispatch();
  const { preferences, loading, error } = useSelector((state: RootState) => state.settings);
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Post-Generator Einstellungen
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Post-Frequenz */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Post-Frequenz
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={preferences?.postFrequency || 0}
                onChange={(_, value) => {
                  if (preferences) {
                    dispatch(updatePreferences({
                      ...preferences,
                      postFrequency: value as number,
                    }));
                  }
                }}
                min={0}
                max={7}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
              <Typography variant="body2" color="text.secondary" align="center">
                {preferences?.postFrequency || 0} Posts pro Woche
              </Typography>
            </Box>
          </Grid>

          {/* Keywords */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Ziel-Keywords
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Neues Keyword hinzufügen"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddKeyword();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddKeyword}
                disabled={!newKeyword}
              >
                Hinzufügen
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleRemoveKeyword(keyword)}
                />
              ))}
            </Box>
          </Grid>

          {/* KI-Ton und Stil */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>KI-Ton</InputLabel>
              <Select
                value={preferences?.aiTone || 'professional'}
                onChange={(e) => {
                  if (preferences) {
                    dispatch(updatePreferences({
                      ...preferences,
                      aiTone: e.target.value,
                    }));
                  }
                }}
              >
                {tones.map((tone) => (
                  <MenuItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Post-Stil</InputLabel>
              <Select
                value={preferences?.aiStyle || 'news'}
                onChange={(e) => {
                  if (preferences) {
                    dispatch(updatePreferences({
                      ...preferences,
                      aiStyle: e.target.value,
                    }));
                  }
                }}
              >
                {styles.map((style) => (
                  <MenuItem key={style.value} value={style.value}>
                    {style.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Automatische Veröffentlichung */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences?.autoPublish || false}
                  onChange={(e) => {
                    if (preferences) {
                      dispatch(updatePreferences({
                        ...preferences,
                        autoPublish: e.target.checked,
                      }));
                    }
                  }}
                />
              }
              label="Posts automatisch veröffentlichen"
            />
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

export default PostGeneratorSettings; 