// app/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PharmacyListScreen from './src/screens/PharmacyListScreen';
import PharmacyDetailScreen from './src/screens/PharmacyDetailScreen';
import MapScreen from './src/screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pharmacy Tracker' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register Pharmacy' }} />
        <Stack.Screen name="List" component={PharmacyListScreen} options={{ title: 'Nearby Pharmacies' }} />
        <Stack.Screen name="Detail" component={PharmacyDetailScreen} options={{ title: 'Pharmacy Details' }} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Pharmacy Map' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
