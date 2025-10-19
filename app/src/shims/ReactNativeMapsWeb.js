import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Marker = ({ coordinate, title }) => (
  <View style={styles.marker}>
    <Text style={styles.markerText}>{title || 'Marker'}</Text>
  </View>
);

export default function MapView(props) {
  // A very small stub for web: render children in a scrollable box and show coords if present
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.header}>Map (web stub)</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f2ff',
    borderRadius: 8,
    padding: 12,
    minHeight: 300,
  },
  header: {
    fontWeight: '700',
    marginBottom: 8,
  },
  marker: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 6,
    marginVertical: 4,
  },
  markerText: {
    color: '#007AFF',
  },
});
