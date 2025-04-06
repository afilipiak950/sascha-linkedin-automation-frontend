import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserPreferences {
  postFrequency: number;
  preferredTimes: string[];
  targetKeywords: string[];
  targetIndustries: string[];
  targetRoles: string[];
  commentStrategy: string;
  likeStrategy: string;
  aiTone: string;
  aiStyle: string;
}

interface SettingsState {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  preferences: null,
  loading: false,
  error: null,
};

export const fetchPreferences = createAsyncThunk('settings/fetchPreferences', async () => {
  const response = await axios.get('/api/settings/preferences');
  return response.data;
});

export const updatePreferences = createAsyncThunk(
  'settings/updatePreferences',
  async (preferences: Partial<UserPreferences>) => {
    const response = await axios.put('/api/settings/preferences', preferences);
    return response.data;
  }
);

export const updateLinkedInCredentials = createAsyncThunk(
  'settings/updateLinkedInCredentials',
  async (credentials: { email: string; password: string }) => {
    const response = await axios.put('/api/settings/linkedin-credentials', credentials);
    return response.data;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Preferences
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action: PayloadAction<UserPreferences>) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fehler beim Laden der Einstellungen';
      })
      // Update Preferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action: PayloadAction<Partial<UserPreferences>>) => {
        state.loading = false;
        state.preferences = {
          ...state.preferences,
          ...action.payload,
        } as UserPreferences;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fehler beim Aktualisieren der Einstellungen';
      })
      // Update LinkedIn Credentials
      .addCase(updateLinkedInCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLinkedInCredentials.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateLinkedInCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fehler beim Aktualisieren der LinkedIn-Anmeldedaten';
      });
  },
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer; 