import React, { useEffect, useState, useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text, Animated } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Badge wrapper to display a small count badge on top-right of an icon
function BadgeWrapper({ children, count }: { children: React.ReactNode; count?: number }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (typeof count === 'number' && count > 0) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [count, scale]);

  return (
    <View style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
      {children}
      {typeof count === 'number' && count > 0 && (
        <Animated.View
          style={{
            transform: [{ scale }],
            position: 'absolute',
            right: -6,
            top: -6,
            backgroundColor: '#ff3b30',
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          pointerEvents="none"
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>{count > 99 ? '99+' : String(count)}</Text>
        </Animated.View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [pharmacyCount, setPharmacyCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    async function fetchCount() {
      try {
        // Try relative path first; adjust if your API runs on a different origin/port
        const res = await fetch('/api/v1/pharmacies');
        if (!mounted) return;
        if (!res.ok) {
          // fallback: try localhost with dev port
          const res2 = await fetch('http://127.0.0.1:8000/api/v1/pharmacies');
          if (!res2.ok) return;
          const data2 = await res2.json();
          setPharmacyCount(Array.isArray(data2) ? data2.length : (data2?.data?.length ?? undefined));
          return;
        }
        const data = await res.json();
        // API might return array or { data: [...] }
        const count = Array.isArray(data) ? data.length : (data?.data?.length ?? undefined);
        setPharmacyCount(typeof count === 'number' ? count : undefined);
      } catch (err) {
        // Network error or CORS: leave undefined and don't crash the UI
        // You can log to remote reporting here if desired
        // console.warn('Failed to fetch pharmacy count', err);
      }
    }

    fetchCount();

    // optional: refresh count periodically
    const t = setInterval(fetchCount, 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Find Pharmacies',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
          tabBarAccessibilityLabel: 'Find nearby pharmacies',
          tabBarTestID: 'tab-find-pharmacies',
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Register',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
          tabBarAccessibilityLabel: 'Register a pharmacy',
          tabBarTestID: 'tab-register',
        }}
      />
      {/* Added list tab: does not remove existing screens, just appends */}
      <Tabs.Screen
        name="list"
        options={{
          title: 'All Pharmacies',
          tabBarIcon: ({ color }) => (
            <BadgeWrapper count={pharmacyCount}>
              <TabBarIcon name="list" color={color} />
            </BadgeWrapper>
          ),
          tabBarAccessibilityLabel: 'All registered pharmacies',
          tabBarTestID: 'tab-all-pharmacies',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
          tabBarAccessibilityLabel: 'Map of pharmacies',
          tabBarTestID: 'tab-map',
        }}
      />
    </Tabs>
  );
}
