import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { HomeData, HomeConfig, Notificacion } from '../types';

// Change this to your backend URL (emulator: 10.0.2.2, device: your machine IP)
const BASE_URL = 'http://10.0.2.2:5000/api/v1';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync('jwt_token');
}

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync('jwt_token', token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync('jwt_token');
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export async function fetchHome(): Promise<HomeData> {
  const res = await api.get<HomeData>('/home');
  return res.data;
}

// ─── Home Config (FABs) ───────────────────────────────────────────────────────

export async function fetchHomeConfig(): Promise<HomeConfig> {
  const res = await api.get<HomeConfig>('/home/config');
  return res.data;
}

export async function saveHomeConfig(config: HomeConfig): Promise<void> {
  await api.put('/home/config', config);
}

// ─── Mascotas ─────────────────────────────────────────────────────────────────

export async function activarMascota(mascotaId: number): Promise<void> {
  await api.patch(`/mascotas/${mascotaId}/activar`);
}

export async function updateMascotaFoto(mascotaId: number, fotoUrl: string): Promise<void> {
  await api.patch(`/mascotas/${mascotaId}`, { foto_url: fotoUrl });
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

export async function fetchNotificaciones(
  page = 1,
  limit = 20,
  soloNoLeidas = false
): Promise<{ notificaciones: Notificacion[]; totalNoLeidas: number }> {
  const res = await api.get('/notificaciones', {
    params: { page, limit, leidas: soloNoLeidas ? 'false' : undefined },
  });
  return res.data;
}

export async function marcarNotificacionLeida(id: number): Promise<void> {
  await api.patch(`/notificaciones/${id}/leer`);
}

export async function marcarTodasLeidas(): Promise<void> {
  await api.patch('/notificaciones/leer-todas');
}
