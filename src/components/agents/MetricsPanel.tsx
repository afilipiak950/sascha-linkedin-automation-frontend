import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface MetricData {
  timestamp: string;
  value: number;
}

interface AgentMetrics {
  contentStrategy: {
    successRate: number;
    averageResponseTime: number;
    errorRate: number;
  };
  engagementAnalysis: {
    successRate: number;
    averageResponseTime: number;
    errorRate: number;
  };
  networkGrowth: {
    successRate: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

const MetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [historicalData, setHistoricalData] = useState<MetricData[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/metrics`);
        setMetrics(response.data.metrics);
        setHistoricalData(response.data.historicalData);
        setAlerts(response.data.alerts);
      } catch (error) {
        console.error('Fehler beim Abrufen der Metriken:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Alle 30 Sekunden aktualisieren

    return () => clearInterval(interval);
  }, []);

  const renderMetricBar = (label: string, value: number) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: value > 80 ? '#4caf50' : value > 50 ? '#ff9800' : '#f44336',
          },
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {value}%
      </Typography>
    </Box>
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Agenten-Metriken
        </Typography>

        {metrics && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Content-Strategie Agent
            </Typography>
            {renderMetricBar('Erfolgsrate', metrics.contentStrategy.successRate)}
            {renderMetricBar('Durchschnittliche Antwortzeit', metrics.contentStrategy.averageResponseTime)}
            {renderMetricBar('Fehlerrate', metrics.contentStrategy.errorRate)}

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Engagement-Analyse Agent
            </Typography>
            {renderMetricBar('Erfolgsrate', metrics.engagementAnalysis.successRate)}
            {renderMetricBar('Durchschnittliche Antwortzeit', metrics.engagementAnalysis.averageResponseTime)}
            {renderMetricBar('Fehlerrate', metrics.engagementAnalysis.errorRate)}

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Netzwerk-Wachstum Agent
            </Typography>
            {renderMetricBar('Erfolgsrate', metrics.networkGrowth.successRate)}
            {renderMetricBar('Durchschnittliche Antwortzeit', metrics.networkGrowth.averageResponseTime)}
            {renderMetricBar('Fehlerrate', metrics.networkGrowth.errorRate)}
          </>
        )}

        {historicalData.length > 0 && (
          <Box sx={{ mt: 3, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {alerts.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Aktuelle Warnungen
            </Typography>
            {alerts.map((alert, index) => (
              <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                {alert}
              </Alert>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsPanel; 