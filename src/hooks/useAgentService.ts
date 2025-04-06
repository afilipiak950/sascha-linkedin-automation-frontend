import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const useAgentService = () => {
  const [error, setError] = useState<string | null>(null);

  const generateContentStrategy = async (keywords: string[]) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/agents/content-strategy`, {
        keywords,
      });
      return response.data;
    } catch (err) {
      setError('Fehler bei der Content-Strategie-Generierung');
      throw err;
    }
  };

  const analyzeEngagement = async (postData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/agents/engagement-analysis`, {
        postData,
      });
      return response.data;
    } catch (err) {
      setError('Fehler bei der Engagement-Analyse');
      throw err;
    }
  };

  const analyzeNetworkGrowth = async (profileData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/agents/network-growth`, {
        profileData,
      });
      return response.data;
    } catch (err) {
      setError('Fehler bei der Netzwerk-Wachstumsanalyse');
      throw err;
    }
  };

  const generateFullReport = async (keywords: string[], postData: any, profileData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/agents/full-report`, {
        keywords,
        postData,
        profileData,
      });
      return response.data;
    } catch (err) {
      setError('Fehler bei der Berichtsgenerierung');
      throw err;
    }
  };

  return {
    generateContentStrategy,
    analyzeEngagement,
    analyzeNetworkGrowth,
    generateFullReport,
    error,
  };
}; 