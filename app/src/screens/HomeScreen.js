// app/src/screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AnimatedButton from '../components/AnimatedButton';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.svg')} style={styles.logo} />
      <Text style={styles.title}>Pharmacy Tracker</Text>
      <Text style={styles.subtitle}>Find the nearest pharmacies instantly — web & mobile.</Text>

      <View style={{ width: '100%', marginTop: 28 }}>
        <AnimatedButton title="Find Nearby Pharmacies" onPress={() => navigation.navigate('List')} />
      </View>

      <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.secondaryText}>Register a Pharmacy</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Research for Development — Rwanda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#f6f8fb' },
  logo: { width: 84, height: 84, marginBottom: 12, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: '800', color: '#0b1226' },
  subtitle: { marginTop: 6, color: '#556', textAlign: 'center' },
  secondary: { marginTop: 14, padding: 12 },
  secondaryText: { color: '#0a84ff', fontWeight: '700' },
  footer: { position: 'absolute', bottom: 18, color: '#999', fontSize: 12 }
});
