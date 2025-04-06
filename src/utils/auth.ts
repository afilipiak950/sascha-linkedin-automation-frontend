import { store } from '../store';

export async function auth() {
  const state = store.getState();
  return state.auth.user;
} 