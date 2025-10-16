// app/src/screens/PharmacyDetailScreen.js
import React from 'react';
import { View, Text, Linking, Button, StyleSheet, Platform } from 'react-native';

export default function PharmacyDetailScreen({ route }) {
  const { item } = route.params || {};

  function openMaps() {
    const lat = item?.latitude;
    const lng = item?.longitude;
    if (lat == null || lng == null) {
      alert('No coordinates available for this pharmacy');
      return;
    }
    // prefer Google Maps web link (works on web, Android, iOS)
    const gUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(gUrl).catch((err) => alert('Could not open maps: ' + err.message));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h}>{item?.name || 'Pharmacy'}</Text>
      <Text style={styles.addr}>{item?.address || 'No address provided'}</Text>
      {item?.contact ? <Text style={styles.meta}>Contact: {item.contact}</Text> : null}
      {item?.description ? <Text style={styles.meta}>Description: {item.description}</Text> : null}
      {item?.distance_km != null ? <Text style={styles.meta}>Distance: {item.distance_km.toFixed(2)} km</Text> : null}

      <View style={{ marginTop: 18 }}>
        <Button title="Open in Maps" onPress={openMaps} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#fff' },
  h: { fontSize: 22, fontWeight: '800', color: '#0b1226' },
  addr: { marginTop: 8, color: '#444' },
  meta: { marginTop: 8, color: '#666' }
});
