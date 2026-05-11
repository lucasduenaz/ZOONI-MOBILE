import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BASE_URL = 'http://10.0.2.2:5000/api/v1';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request
api.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// SecureStore no funciona en web — usamos localStorage como fallback
export async function getStoredToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem('jwt_token');
  }
  return SecureStore.getItemAsync('jwt_token');
}

export async function saveToken(token) {
  if (Platform.OS === 'web') {
    localStorage.setItem('jwt_token', token);
    return;
  }
  await SecureStore.setItemAsync('jwt_token', token);
}

export async function clearToken() {
  if (Platform.OS === 'web') {
    localStorage.removeItem('jwt_token');
    return;
  }
  await SecureStore.deleteItemAsync('jwt_token');
}

export async function fetchHome() {
  const res = await api.get('/home');
  return res.data;
}

export async function fetchHomeConfig() {
  const res = await api.get('/home/config');
  return res.data;
}

export async function saveHomeConfig(config) {
  await api.put('/home/config', config);
}

export async function activarMascota(mascotaId) {
  await api.patch(`/mascotas/${mascotaId}/activar`);
}

export async function fetchNotificaciones(page = 1, limit = 20, soloNoLeidas = false) {
  const res = await api.get('/notificaciones', {
    params: { page, limit, leidas: soloNoLeidas ? 'false' : undefined },
  });
  return res.data;
}

export async function marcarNotificacionLeida(id) {
  await api.patch(`/notificaciones/${id}/leer`);
}

export async function marcarTodasLeidas() {
  await api.patch('/notificaciones/leer-todas');
}
