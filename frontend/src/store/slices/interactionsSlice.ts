import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Interaction {
  id: string;
  type: 'like' | 'comment' | 'connection_request' | 'message';
  targetProfileId?: string;
  targetPostId?: string;
  content?: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: {
    targetName: string;
    targetTitle: string;
    targetCompany: string;
    responseReceived: boolean;
    responseContent: string;
  };
}

interface InteractionsState {
  interactions: Interaction[];
  loading: boolean;
  error: string | null;
  stats: {
    dailyConnections: number;
    dailyLikes: number;
    dailyComments: number;
  };
}

const initialState: InteractionsState = {
  interactions: [],
  loading: false,
  error: null,
  stats: {
    dailyConnections: 0,
    dailyLikes: 0,
    dailyComments: 0,
  },
};

export const fetchInteractions = createAsyncThunk('interactions/fetchInteractions', async () => {
  const response = await axios.get('/api/interactions');
  return response.data;
});

export const createInteraction = createAsyncThunk(
  'interactions/createInteraction',
  async (interactionData: Omit<Interaction, 'id' | 'status'>) => {
    const response = await axios.post('/api/interactions', interactionData);
    return response.data;
  }
);

export const updateInteraction = createAsyncThunk(
  'interactions/updateInteraction',
  async ({ id, interactionData }: { id: string; interactionData: Partial<Interaction> }) => {
    const response = await axios.put(`/api/interactions/${id}`, interactionData);
    return response.data;
  }
);

export const fetchStats = createAsyncThunk('interactions/fetchStats', async () => {
  const response = await axios.get('/api/interactions/stats');
  return response.data;
});

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Interactions
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractions.fulfilled, (state, action: PayloadAction<Interaction[]>) => {
        state.loading = false;
        state.interactions = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fehler beim Laden der Interaktionen';
      })
      // Create Interaction
      .addCase(createInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInteraction.fulfilled, (state, action: PayloadAction<Interaction>) => {
        state.loading = false;
        state.interactions.push(action.payload);
      })
      .addCase(createInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fehler beim Erstellen der Interaktion';
      })
      // Update Interaction
      .addCase(updateInteraction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInteraction.fulfilled, (state, action: PayloadAction<Interaction>) => {
        state.loading = false;
        const index = state.interactions.findIndex(interaction => interaction.id === action.payload.id);
        if (index !== -1) {
          state.interactions[index] = action.payload;
        }
      })
      .addCase(updateInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fehler beim Aktualisieren der Interaktion';
      })
      // Fetch Stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action: PayloadAction<InteractionsState['stats']>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fehler beim Laden der Statistiken';
      });
  },
});

export const { clearError } = interactionsSlice.actions;
export default interactionsSlice.reducer; 