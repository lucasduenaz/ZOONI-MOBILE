import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TODAS_LAS_SECCIONES } from '../services/secciones';

const SECCIONES_DISPONIBLES = TODAS_LAS_SECCIONES.filter((s) => s.key !== 'inicio');

export default function AddButtonModal({ visible, onClose, botonesActivos, onAdd }) {
  const activeKeys = new Set(botonesActivos.filter((b) => b.visible).map((b) => b.seccion));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Agregar sección</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#2C2C2C" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={SECCIONES_DISPONIBLES}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              const isActive = activeKeys.has(item.key);
              return (
                <TouchableOpacity
                  style={[styles.item, isActive && styles.itemDisabled]}
                  onPress={() => { if (!isActive) { onAdd(item.key); onClose(); } }}
                  disabled={isActive}
                >
                  <Ionicons
                    name={item.icono}
                    size={22}
                    color={isActive ? '#AAAAAA' : '#2DBD72'}
                    style={styles.itemIcon}
                  />
                  <Text style={[styles.itemLabel, isActive && styles.itemLabelDisabled]}>
                    {item.label}
                  </Text>
                  {isActive && <Ionicons name="checkmark-circle" size={20} color="#AAAAAA" />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 32, maxHeight: '75%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D0D0D0', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  title: { fontSize: 17, fontWeight: '700', color: '#2C2C2C' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  itemDisabled: { opacity: 0.5 },
  itemIcon: { marginRight: 14 },
  itemLabel: { flex: 1, fontSize: 15, color: '#2C2C2C', fontWeight: '500' },
  itemLabelDisabled: { color: '#AAAAAA' },
});
