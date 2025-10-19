import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import InteractiveCard from "../components/InteractiveCard";
import { fetchNearest } from "../api";

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Please enable location services to find nearby pharmacies."
          );
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        // Fetch nearby pharmacies once we have location
        const nearbyPharmacies = await fetchNearest(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        setPharmacies(nearbyPharmacies);
      } catch (error) {
        Alert.alert("Error", "Failed to get location or fetch pharmacies");
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a84ff" />
      </View>
    );
  }

  // Web fallback: react-native-maps has limited web support and caused build-time warnings.
  // Avoid importing it on web. Render a simple list with coordinates instead.
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { padding: 16 }]}>
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Nearby Pharmacies</Text>
        <FlatList
          data={pharmacies}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.webItem}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
              <Text style={styles.contact}>📍 {item.latitude}, {item.longitude}</Text>
              <Text style={styles.contact}>📞 {item.phone_number}</Text>
              <Text style={{ color: '#0a84ff', marginTop: 6 }} onPress={() => navigation.navigate('PharmacyDetail', { pharmacy: item })}>View details</Text>
            </View>
          )}
        />
      </View>
    );
  }

  // Native (iOS/Android): dynamic require to avoid bundling react-native-maps into web build
  let MapView, Marker;
  try {
    const maps = require('react-native-maps');
    MapView = maps.default || maps.MapView || maps;
    Marker = maps.Marker || maps;
  } catch (e) {
    console.warn('react-native-maps not available', e);
  }

  return (
    <View style={styles.container}>
      {MapView ? (
        <MapView
          style={styles.map}
          initialRegion={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : null
          }
        >
          {location && (
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="You are here"
              pinColor="#0a84ff"
            />
          )}
          {pharmacies.map((pharmacy) => (
            <Marker
              key={pharmacy.id}
              coordinate={{ latitude: pharmacy.latitude, longitude: pharmacy.longitude }}
              title={pharmacy.name}
              onPress={() => setSelectedPharmacy(pharmacy)}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Map unavailable on this device.</Text>
        </View>
      )}

      {selectedPharmacy && (
        <View style={styles.cardContainer}>
          <InteractiveCard
            pharmacy={selectedPharmacy}
            onPress={() => navigation.navigate('PharmacyDetail', { pharmacy: selectedPharmacy })}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
});