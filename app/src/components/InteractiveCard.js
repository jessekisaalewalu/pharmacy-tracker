import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function InteractiveCard({ pharmacy, onPress }) {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{pharmacy.name}</Text>
          <Text style={styles.distance}>{pharmacy.distance} km away</Text>
        </View>
        <Text style={styles.address}>{pharmacy.address}</Text>
        <Text style={styles.contact}>📞 {pharmacy.phone_number}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
  },
  distance: {
    fontSize: 14,
    color: "#555",
  },
  address: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  contact: {
    fontSize: 15,
    color: "#888",
  },
});