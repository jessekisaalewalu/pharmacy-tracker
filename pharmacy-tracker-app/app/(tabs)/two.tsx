import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  async function submit() {
    if (!name || !phone) {
      Alert.alert('Name and phone are required');
      return;
    }
    try {
      const payload = { name, phone_number: phone, address };
      const res = await fetch('/api/v1/pharmacies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const res2 = await fetch('http://127.0.0.1:8000/api/v1/pharmacies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res2.ok) throw new Error('Failed to register');
        Alert.alert('Registered (fallback)');
      } else {
        Alert.alert('Registered');
      }
      setName('');
      setAddress('');
      setPhone('');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? String(err));
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <TextInput placeholder="Pharmacy name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
        <TextInput placeholder="Phone number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <Button title="Register Pharmacy" onPress={submit} color={Colors[colorScheme ?? 'light'].tint} />
      </View>
      <View style={{ height: 12 }} />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
});
