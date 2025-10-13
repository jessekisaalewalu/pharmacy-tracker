import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type Pharmacy = {
  id?: number | string;
  name: string;
  address?: string;
  phone_number?: string;
};

export default function ListScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [data, setData] = useState<Pharmacy[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/pharmacies');
      if (!res.ok) {
        throw new Error('Failed to fetch pharmacies from backend');
      }
      const d = await res.json();
      setData(Array.isArray(d) ? d : (d?.data ?? []));
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {error && (
        <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
      )}

      <FlatList
        data={data}
        keyExtractor={(i) => String(i.id ?? i.name)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/pharmacy/${item.id ?? ''}`)}
            style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            {item.address ? <Text>{item.address}</Text> : null}
            {item.phone_number ? <Text style={{ color: Colors[colorScheme ?? 'light'].tint }}>{item.phone_number}</Text> : null}
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchList} />}
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text>No pharmacies found. Pull to refresh or register one.</Text>
          </View>
        )}
      />
    </View>
  );
}
