import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Usuario, MascotaActiva } from '../types';
import { clearToken } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 320);

interface DrawerItem {
  key: string;
  label: string;
  icono: string;
  ruta?: keyof RootStackParamList;
  isLogout?: boolean;
  isDivider?: boolean;
}

const MENU_ITEMS: DrawerItem[] = [
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
  { key: 'divider',       label: '',                          icono: '',                            isDivider: true },
  { key: 'logout',        label: 'Cerrar sesión',             icono: 'log-out-outline',             isLogout: true },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  mascotaActiva: MascotaActiva | null;
  activeRoute?: string;
}

export default function HamburgerDrawer({ visible, onClose, usuario, mascotaActiva, activeRoute }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, { toValue: -DRAWER_WIDTH, duration: 200, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleNavigate = (item: DrawerItem) => {
    onClose();
    if (item.ruta) {
      if (item.ruta === 'FichaMedica' && mascotaActiva) {
        navigation.navigate('FichaMedica', { mascotaId: mascotaActiva.id });
      } else {
        navigation.navigate(item.ruta as any);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '¿Cerrar sesión?',
      '¿Seguro que querés salir de tu cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, salir',
          style: 'destructive',
          onPress: async () => {
            onClose();
            await clearToken();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ]
    );
  };

  const getInitials = (nombre?: string, apellido?: string) => {
    const n = nombre?.[0] ?? '';
    const a = apellido?.[0] ?? '';
    return (n + a).toUpperCase() || '?';
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Drawer panel */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        {/* Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.avatarContainer}>
            {usuario?.fotoPerfil ? (
              <Image source={{ uri: usuario.fotoPerfil }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>
                  {getInitials(usuario?.nombre, (usuario as any)?.apellido)}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerNombre} numberOfLines={1}>
              {usuario?.nombre ?? 'Usuario'}
            </Text>
            {mascotaActiva && (
              <Text style={styles.headerMascota} numberOfLines={1}>
                {mascotaActiva.nombre} · {mascotaActiva.raza}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.dividerLine} />

        {/* Menu items */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {MENU_ITEMS.map((item) => {
            if (item.isDivider) {
              return <View key={item.key} style={styles.dividerLine} />;
            }

            const isActive = activeRoute === item.ruta;
            const isLogout = item.isLogout;

            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => (isLogout ? handleLogout() : handleNavigate(item))}
                accessibilityLabel={item.label}
              >
                <Ionicons
                  name={item.icono as any}
                  size={22}
                  color={isLogout ? '#E63946' : isActive ? '#2DBD72' : '#2C2C2C'}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    isActive && styles.menuLabelActive,
                    isLogout && styles.menuLabelLogout,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    paddingTop: 50,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2DBD72',
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C8F0D8',
    borderWidth: 2,
    borderColor: '#2DBD72',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27AE60',
  },
  headerInfo: {
    flex: 1,
  },
  headerNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C2C2C',
  },
  headerMascota: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 2,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 0,
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 20,
  },
  menuItemActive: {
    backgroundColor: 'rgba(45, 189, 114, 0.12)',
  },
  menuIcon: {
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 15,
    color: '#2C2C2C',
    fontWeight: '400',
  },
  menuLabelActive: {
    color: '#2DBD72',
    fontWeight: '700',
  },
  menuLabelLogout: {
    color: '#E63946',
  },
});
