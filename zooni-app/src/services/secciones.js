export const TODAS_LAS_SECCIONES = [
  { key: 'inicio',        label: 'Inicio',                    icono: 'home-outline',               ruta: 'Home' },
  { key: 'comunidad',     label: 'Comunidad',                 icono: 'people-outline',              ruta: 'Comunidad' },
  { key: 'match',         label: 'Match',                     icono: 'paw-outline',                 ruta: 'Match' },
  { key: 'planificador',  label: 'Planificador de Servicios', icono: 'calendar-outline',            ruta: 'Planificador' },
  { key: 'ficha_medica',  label: 'Ficha Médica',              icono: 'medkit-outline',              ruta: 'FichaMedica' },
  { key: 'calendario',    label: 'Calendario',                icono: 'today-outline',               ruta: 'Calendario' },
  { key: 'eventos',       label: 'Eventos',                   icono: 'sparkles-outline',            ruta: 'Eventos' },
  { key: 'chatbot',       label: 'ChatBot',                   icono: 'chatbubble-ellipses-outline', ruta: 'ChatBot' },
  { key: 'closet',        label: 'Closet',                    icono: 'shirt-outline',               ruta: 'Closet' },
  { key: 'perfil',        label: 'Perfil',                    icono: 'person-outline',              ruta: 'Perfil' },
  { key: 'configuracion', label: 'Configuración',             icono: 'settings-outline',            ruta: 'Configuracion' },
];

export const DEFAULT_BOTONES_HOME = ['comunidad', 'ficha_medica', 'mis_mascotas'];

export function getSeccion(key) {
  return TODAS_LAS_SECCIONES.find((s) => s.key === key);
}
