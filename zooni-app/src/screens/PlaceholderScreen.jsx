import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PlaceholderScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.name}</Text>
      <Text style={styles.subtitle}>Pantalla en construcción 🚧</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#C8F0D8', gap: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#27AE60' },
  subtitle: { fontSize: 16, color: '#6B6B6B' },
  btn: { marginTop: 16, backgroundColor: '#F5C842', borderRadius: 30, paddingHorizontal: 28, paddingVertical: 14 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#2C2C2C' },
});
