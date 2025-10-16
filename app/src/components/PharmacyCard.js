// app/src/components/PharmacyCard.js
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

export default function PharmacyCard({ item, onPress }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const opacity = anim;

  return (
    <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ padding: 6 }}>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.title}>{item.name}</Text>
            <Text numberOfLines={2} style={styles.addr}>{item.address || 'No address provided'}</Text>
            {item.contact ? <Text style={styles.contact}>Contact: {item.contact}</Text> : null}
          </View>
          {item.distance_km !== undefined && item.distance_km !== null ? (
            <View style={styles.distWrap}>
              <Text style={styles.dist}>{item.distance_km.toFixed(2)} km</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, paddingRight: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#111' },
  addr: { marginTop: 6, color: '#555' },
  contact: { marginTop: 6, color: '#333', fontSize: 13 },
  distWrap: { justifyContent: 'center', alignItems: 'flex-end' },
  dist: { color: '#666', fontSize: 12 }
});
