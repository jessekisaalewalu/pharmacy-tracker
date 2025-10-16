// app/src/components/AnimatedButton.js
import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Text, StyleSheet } from 'react-native';

export default function AnimatedButton({ title, onPress, style }) {
  const a = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(a, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  }
  function pressOut() {
    Animated.spring(a, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  }

  return (
    <Animated.View style={[{ transform: [{ scale: a }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.85}
        style={styles.button}
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0a84ff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: { color: '#fff', fontWeight: '700' }
});
