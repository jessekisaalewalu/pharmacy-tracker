// app/src/screens/PharmacyListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { fetchNearest, fetchAll } from '../api';
import PharmacyCard from '../components/PharmacyCard';

export default function PharmacyListScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [coords, setCoords] = useState(null);

  useEffect(() => { loadNearest(); }, []);

  async function loadNearest() {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location permission', 'Permission denied — showing all pharmacies instead.');
        const all = await fetchAll();
        setList(all);
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords(loc.coords);
      const near = await fetchNearest(loc.coords.latitude, loc.coords.longitude, 50);
      setList(near);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not fetch pharmacies: ' + (e.message || e));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title="Refresh" onPress={loadNearest} />
        <Button title="Add Pharmacy" onPress={() => navigation.navigate('Register')} />
      </View>

      <FlatList
        data={list}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <PharmacyCard item={item} onPress={() => navigation.navigate('Detail', { item, coords })} />
        )}
        ListEmptyComponent={<View style={styles.center}><Text>No pharmacies found.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
