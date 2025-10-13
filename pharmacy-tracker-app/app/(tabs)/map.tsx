// map.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import PharmacyModal from '../../components/PharmacyModal'; // relative to app/(tabs)/map.tsx
// Sample data is in the same folder
const samplePharmacies: any = require('./pharmacies_sample.json');

export default function MapTab() {
  const [pharmacies, setPharmacies] = useState<any[]>(samplePharmacies || []);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // If/when you have a backend, replace this with a fetch:
    // fetch('/api/pharmacies').then(r => r.json()).then(setPharmacies)
    // For now we use the included sample JSON.
  }, []);

  const onMarkerPress = (pharmacy: any) => {
    setSelected(pharmacy);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const initialRegion = pharmacies.length
    ? {
        latitude: pharmacies[0].latitude,
        longitude: pharmacies[0].longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }
    : { latitude: -1.944, longitude: 30.061, latitudeDelta: 0.1, longitudeDelta: 0.1 };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {pharmacies.map((p) => (
          <Marker
            key={String(p.id)}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            description={p.address}
            onPress={() => onMarkerPress(p)}
          />
        ))}
      </MapView>

      <PharmacyModal
        visible={modalVisible}
        pharmacy={selected}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});
