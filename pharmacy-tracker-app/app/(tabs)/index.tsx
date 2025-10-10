import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type Pharmacy = { id?: number | string; name: string; address?: string };

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pharmacy[]>([]);

  async function search() {
    try {
      // naive search: fetch all and filter client-side
      const res = await fetch('/api/v1/pharmacies');
      const data = await (res.ok ? res.json() : (await fetch('http://127.0.0.1:8000/api/v1/pharmacies')).json());
      const items = Array.isArray(data) ? data : data?.data ?? [];
      if (!query) setResults(items);
      else setResults(items.filter((p: any) => p.name?.toLowerCase().includes(query.toLowerCase())));
    } catch (e) {
      // ignore for now
    }
  }

  useEffect(() => {
    search();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].tint }]}>Find Pharmacies</Text>
  <View style={styles.separator} />
      <TextInput
        placeholder="Search by name"
        value={query}
        onChangeText={setQuery}
        style={{ width: '100%', padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 }}
      />
      <View style={{ height: 8 }} />
      <Button title="Search" onPress={search} />

      <FlatList
        data={results}
        keyExtractor={(i) => String(i.id ?? i.name)}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            {item.address ? <Text>{item.address}</Text> : null}
          </TouchableOpacity>
        )}
        style={{ width: '100%', marginTop: 12 }}
        ListEmptyComponent={() => <Text>No results</Text>}
      />

      <View style={{ height: 12 }} />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 8,
    height: 1,
    width: '80%',
  },
});
