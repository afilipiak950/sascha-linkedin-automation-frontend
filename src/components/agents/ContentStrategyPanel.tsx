import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { useAgentService } from '../../hooks/useAgentService';

const ContentStrategyPanel: React.FC = () => {
  const [keywords, setKeywords] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const { generateContentStrategy } = useAgentService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const keywordArray = keywords.split(',').map(k => k.trim());
      const strategy = await generateContentStrategy(keywordArray);
      setResults(strategy);
    } catch (error) {
      console.error('Fehler bei der Content-Strategie-Generierung:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Content-Strategie Generator
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Keywords (durch Kommas getrennt)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Strategie generieren
          </Button>
        </Box>

        {results && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Ergebnisse
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Trends"
                  secondary={results.trends.map((trend: string) => (
                    <Typography key={trend} variant="body2">
                      • {trend}
                    </Typography>
                  ))}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Empfehlungen"
                  secondary={results.recommendations.map((rec: string) => (
                    <Typography key={rec} variant="body2">
                      • {rec}
                    </Typography>
                  ))}
                />
              </ListItem>
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentStrategyPanel; 