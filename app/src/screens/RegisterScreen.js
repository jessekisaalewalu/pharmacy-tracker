// app/src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { createPharmacy } from '../api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [latlng, setLatlng] = useState(null);
  const [busy, setBusy] = useState(false);

  async function getLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is required to set coordinates.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLatlng({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (e) {
      Alert.alert('Error', 'Could not get location: ' + e.message);
    }
  }

  async function submit() {
    if (!name.trim()) return Alert.alert('Validation', 'Please provide a pharmacy name.');
    setBusy(true);
    try {
      const payload = {
        name: name.trim(),
        phone_number: contact.trim(),
        address: address.trim(),
        latitude: latlng?.latitude ?? 0.0,
        longitude: latlng?.longitude ?? 0.0
      };
      await createPharmacy(payload);
      Alert.alert('Success', 'Pharmacy registered successfully.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to register: ' + (e.message || JSON.stringify(e)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h}>Register Pharmacy</Text>

      <TextInput value={name} onChangeText={setName} placeholder="Name *" style={styles.input} />
      <TextInput value={contact} onChangeText={setContact} placeholder="Contact (phone/email)" style={styles.input} />
      <TextInput value={address} onChangeText={setAddress} placeholder="Address" style={styles.input} />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Short description"
        style={[styles.input, { height: 90 }]}
        multiline
      />

      <View style={{ marginTop: 8 }}>
        <Button title={latlng ? `Location set: ${latlng.latitude.toFixed(4)}, ${latlng.longitude.toFixed(4)}` : 'Use my current location'} onPress={getLocation} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title={busy ? 'Submitting...' : 'Submit'} onPress={submit} disabled={busy} />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, backgroundColor: '#fff', flexGrow: 1 },
  h: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e6e9ef', borderRadius: 10, padding: 12, marginTop: 10, backgroundColor: '#fbfdff' }
});
