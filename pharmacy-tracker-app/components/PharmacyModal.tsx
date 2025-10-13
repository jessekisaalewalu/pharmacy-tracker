// PharmacyModal.tsx
import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';

type Props = {
  visible: boolean;
  pharmacy: any | null;
  onClose: () => void;
};

export default function PharmacyModal({ visible, pharmacy, onClose }: Props) {
  if (!pharmacy) return null;

  const openDirections = () => {
    const lat = pharmacy.latitude;
    const lng = pharmacy.longitude;
    // Use platform deep-links when possible, fallback to google maps URL
    const url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${lat},${lng}(${encodeURIComponent(pharmacy.name)})`
        : Platform.OS === 'android'
        ? `geo:0,0?q=${lat},${lng}(${encodeURIComponent(pharmacy.name)})`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch((err) => console.warn('Failed to open maps', err));
  };

  const callPhone = () => {
    if (!pharmacy.phone_number) return;
    const tel = `tel:${pharmacy.phone_number}`;
    Linking.openURL(tel).catch((err) => console.warn('Failed to start call', err));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{pharmacy.name}</Text>
          {pharmacy.address ? <Text style={styles.text}>{pharmacy.address}</Text> : null}
          {pharmacy.phone_number ? <Text style={styles.text}>Phone: {pharmacy.phone_number}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity onPress={openDirections} style={styles.button}>
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>

            {pharmacy.phone_number ? (
              <TouchableOpacity onPress={callPhone} style={[styles.button, styles.callButton]}>
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity onPress={onClose} style={[styles.button, styles.close]}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '92%', backgroundColor: '#fff', padding: 18, borderRadius: 8, elevation: 4 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  text: { marginBottom: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap' },
  button: { padding: 10, backgroundColor: '#1976D2', borderRadius: 6, marginTop: 6, marginRight: 6 },
  callButton: { backgroundColor: '#2E7D32' },
  close: { backgroundColor: '#757575' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
