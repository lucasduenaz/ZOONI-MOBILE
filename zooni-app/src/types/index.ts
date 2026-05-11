// ─── Domain Types ────────────────────────────────────────────────────────────

export interface Usuario {
  id: number;
  nombre: string;
  apellido?: string;
  fotoPerfil?: string | null;
}

export interface MascotaActiva {
  id: number;
  nombre: string;
  especie: 'perro' | 'gato' | 'otro';
  raza: string;
  fotoUrl: string | null;
  edadAnios: number;
  edadMeses: number;
}

export interface HomeData {
  usuario: Usuario;
  mascotaActiva: MascotaActiva | null;
  notificacionesNoLeidas: number;
}

export interface BotonConfig {
  seccion: string;
  orden: number;
  visible: boolean;
}

export interface HomeConfig {
  botones: BotonConfig[];
}

export type NotificacionTipo =
  | 'follow'
  | 'post_from_following'
  | 'friend_request'
  | 'friend_accepted'
  | 'match'
  | 'reminder_care'
  | 'reminder_appointment'
  | 'event';

export interface Notificacion {
  id: number;
  tipo: NotificacionTipo;
  titulo: string;
  cuerpo: string;
  leida: boolean;
  fotoUrl: string | null;
  redirigea: string | null;
  createdAt: string;
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Home: undefined;
  Comunidad: undefined;
  FichaMedica: { mascotaId: number };
  MisMascotas: undefined;
  Match: undefined;
  Planificador: undefined;
  Calendario: undefined;
  Eventos: undefined;
  ChatBot: undefined;
  Closet: undefined;
  Perfil: undefined;
  Configuracion: undefined;
  Login: undefined;
  Notificaciones: undefined;
};

// ─── Section metadata used by drawer & FAB modal ─────────────────────────────

export interface SeccionInfo {
  key: string;
  label: string;
  icono: string; // Ionicons name
  ruta: keyof RootStackParamList;
}
