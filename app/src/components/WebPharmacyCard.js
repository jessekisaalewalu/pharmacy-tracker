import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WebPharmacyCard({ pharmacy, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(pharmacy)} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name}>{pharmacy.name}</Text>
          <Text style={styles.address}>{pharmacy.address}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.phone}>📞 {pharmacy.phone_number || 'N/A'}</Text>
          <Text style={styles.coords}>📍 {pharmacy.latitude?.toFixed?.(4) || '-'}, {pharmacy.longitude?.toFixed?.(4) || '-'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    boxShadow: '0 6px 18px rgba(20,20,20,0.06)',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  name: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  address: { color: '#666' },
  meta: { alignItems: 'flex-end' },
  phone: { color: '#0a84ff' },
  coords: { color: '#999', fontSize: 12, marginTop: 6 }
});
