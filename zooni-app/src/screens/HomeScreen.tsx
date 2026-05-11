import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeData, BotonConfig, RootStackParamList } from '../types';
import { fetchHome, fetchHomeConfig, saveHomeConfig } from '../services/api';
import { getSeccion } from '../services/secciones';
import SkeletonLoader from '../components/SkeletonLoader';
import HamburgerDrawer from '../components/HamburgerDrawer';
import NotificationsPanel from '../components/NotificationsPanel';
import AddButtonModal from '../components/AddButtonModal';
import NavButton from '../components/NavButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Data state
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [botones, setBotones] = useState<BotonConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Animations
  const petNameOpacity = useRef(new Animated.Value(0)).current;
  const petImageScale = useRef(new Animated.Value(0.9)).current;

  // ─── Load data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const [data, config] = await Promise.all([fetchHome(), fetchHomeConfig()]);
      setHomeData(data);
      setBotones(config.botones);

      // Animate hero elements in
      Animated.parallel([
        Animated.timing(petNameOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(petImageScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Edit mode helpers ──────────────────────────────────────────────────────
  const handleDeleteButton = (seccion: string) => {
    setBotones((prev) => prev.filter((b) => b.seccion !== seccion));
  };

  const handleAddButton = (seccionKey: string) => {
    setBotones((prev) => [
      ...prev,
      { seccion: seccionKey, orden: prev.length + 1, visible: true },
    ]);
  };

  const handleSaveConfig = async () => {
    const updated = botones.map((b, i) => ({ ...b, orden: i + 1, visible: true }));
    setBotones(updated);
    setEditMode(false);
    await saveHomeConfig({ botones: updated });
  };

  // ─── Navigate from notification ─────────────────────────────────────────────
  const handleNotifNavigate = (ruta: string) => {
    const parts = ruta.split('/');
    const screen = parts[0];
    const screenMap: Record<string, keyof RootStackParamList> = {
      perfil: 'Perfil',
      match: 'Match',
      fichamedica: 'FichaMedica',
      comunidad: 'Comunidad',
    };
    const target = screenMap[screen];
    if (target) navigation.navigate(target as any);
  };

  // ─── Visible buttons (excluding SOS which is always shown) ──────────────────
  const visibleBotones = botones.filter((b) => b.visible);
  const mascota = homeData?.mascotaActiva;
  const usuario = homeData?.usuario ?? null;
  const badge = homeData?.notificacionesNoLeidas ?? 0;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── ZONA 1: HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          accessibilityLabel="Abrir menú"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color="#2C2C2C" />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setNotifOpen(true)}
            accessibilityLabel={`Notificaciones${badge > 0 ? `, ${badge} sin leer` : ''}`}
            style={styles.bellWrap}
          >
            <Ionicons name="notifications-outline" size={26} color="#F5A623" />
            {badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── ZONA 2: HERO ── */}
        <View style={styles.heroZone}>
          {/* Background — solid color fallback until real asset is provided */}
          <View style={[styles.heroBg, { backgroundColor: '#C8F0D8' }]} />

          {/* Pet name */}
          <Animated.View style={[styles.petNameWrap, { opacity: petNameOpacity }]}>
            {loading ? (
              <SkeletonLoader width={140} height={36} borderRadius={10} />
            ) : mascota ? (
              <Text style={styles.petName} numberOfLines={1}>
                {mascota.nombre.length > 20
                  ? mascota.nombre.slice(0, 20) + '…'
                  : mascota.nombre}
              </Text>
            ) : null}
          </Animated.View>

          {/* Pet image */}
          <Animated.View style={[styles.petImageWrap, { transform: [{ scale: petImageScale }] }]}>
            {loading ? (
              <SkeletonLoader width={180} height={190} borderRadius={90} />
            ) : mascota?.fotoUrl ? (
              <Image
                source={{ uri: mascota.fotoUrl }}
                style={styles.petImage}
                resizeMode="contain"
                accessibilityLabel={`Foto de ${mascota.nombre}`}
              />
            ) : (
              <View style={styles.petPlaceholder}>
                <Ionicons name="paw" size={80} color="#CCCCCC" />
              </View>
            )}
          </Animated.View>
        </View>

        {/* ── ZONA 3: BOTONES ── */}
        <View style={styles.buttonsZone}>

          {/* Empty state */}
          {!loading && !mascota && (
            <View style={styles.emptyState}>
              <Ionicons name="paw-outline" size={56} color="#AAAAAA" />
              <Text style={styles.emptyTitle}>¡Agregá tu primera mascota!</Text>
              <Text style={styles.emptySubtitle}>
                Registrá a tu compañero para empezar a usar Zooni.
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('MisMascotas')}
                accessibilityLabel="Ir a Mis Mascotas"
              >
                <Text style={styles.emptyBtnText}>Agregar mascota</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Dynamic nav buttons */}
          {visibleBotones.map((boton) => {
            const seccion = getSeccion(boton.seccion);
            if (!seccion) return null;
            return (
              <NavButton
                key={boton.seccion}
                label={seccion.label}
                iconName={seccion.icono}
                editMode={editMode}
                onDelete={() => handleDeleteButton(boton.seccion)}
                onPress={() => {
                  if (editMode) return;
                  if (boton.seccion === 'ficha_medica' && mascota) {
                    navigation.navigate('FichaMedica', { mascotaId: mascota.id });
                  } else {
                    navigation.navigate(seccion.ruta as any);
                  }
                }}
                accessibilityLabel={`Ir a ${seccion.label}`}
              />
            );
          })}

          {/* Save button in edit mode */}
          {editMode && (
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveConfig}
              accessibilityLabel="Guardar configuración"
            >
              <Text style={styles.saveBtnText}>Guardar</Text>
            </TouchableOpacity>
          )}

          {/* SOS — always last, always visible */}
          <NavButton
            label="S.O.S Veterinario"
            iconName="alert-circle-outline"
            variant="danger"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              // TODO: navigate to SOS flow
            }}
            accessibilityLabel="Emergencia veterinaria"
          />
        </View>
      </ScrollView>

      {/* ── ZONA 4: FABs ── */}
      <View style={styles.fabContainer}>
        {/* Reorder FAB */}
        <TouchableOpacity
          style={[styles.fab, editMode && styles.fabActive]}
          onPress={() => setEditMode((v) => !v)}
          accessibilityLabel="Personalizar orden de botones"
        >
          <Ionicons name="grid-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Add button FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setAddModalOpen(true)}
          accessibilityLabel="Agregar sección a la Home"
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ── OVERLAYS ── */}
      <HamburgerDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        usuario={usuario}
        mascotaActiva={mascota ?? null}
        activeRoute="Home"
      />

      <NotificationsPanel
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        onNavigate={handleNotifNavigate}
      />

      <AddButtonModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        botonesActivos={botones}
        onAdd={handleAddButton}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#C8F0D8',
  },

  // Header
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#E63946',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Hero zone
  heroZone: {
    height: SCREEN_HEIGHT * 0.45,
    overflow: 'hidden',
    alignItems: 'center',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  petNameWrap: {
    marginTop: 16,
    alignItems: 'center',
  },
  petName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#27AE60',
    textAlign: 'center',
  },
  petImageWrap: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  petImage: {
    width: 190,
    height: 190,
  },
  petPlaceholder: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Buttons zone
  buttonsZone: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100, // space for FABs
    backgroundColor: '#C8F0D8',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C2C2C',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: '#F5C842',
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  emptyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C2C2C',
  },

  // Save button (edit mode)
  saveBtn: {
    backgroundColor: '#F5C842',
    borderRadius: 30,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C2C2C',
  },

  // FABs
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 10,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2DBD72',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  fabActive: {
    backgroundColor: '#27AE60',
  },
});
