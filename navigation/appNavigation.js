import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import BuatLamaran from '../screens/BuatLamaran';
import DataPelamar from '../screens/DataPelamar';
import DataPemberiKerja from '../screens/DataPemberiKerja';
import DetailPelamar from '../screens/DetailPelamar';
import HomeScreen from '../screens/HomeScreen';
import JobDetailCompany from '../screens/JobDetailCompany';
import JobDetailScreen from '../screens/JobDetailScreen';
import Lamaran from '../screens/Lamaran';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ViewPdf from '../screens/ViewPdf';
import WelcomeScreen from '../screens/WelcomeScreen';
import Spinner from '../src/components/Spinner';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [status, setStatus] = useState('loading');
  const [userToken, setUserToken] = useState(null);
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setUserToken(token);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error(error);
        setStatus('unauthenticated');
      }
    };

    checkToken();
  }, []);

  if (status === 'loading') {
    return <Spinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={status === 'authenticated' ? 'Home' : 'Welcome'}>
        {status === 'authenticated' ? (
          <>
            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
            <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
            <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
            <Stack.Screen name="Spinner" options={{ headerShown: false }} component={Spinner} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
            <Stack.Screen name="Lamaran" options={{ headerShown: false }} component={Lamaran} />
            <Stack.Screen name="BuatLamaran" options={{ headerShown: false }} component={BuatLamaran} />
            <Stack.Screen name="JobDetail" options={{ headerShown: false }} component={JobDetailScreen} />
            <Stack.Screen name="CV" options={{ headerShown: false }} component={DataPelamar} />
            <Stack.Screen name="ViewPdf" options={{ headerShown: false }} component={ViewPdf} />
            <Stack.Screen name="CompanyProfile" options={{ headerShown: false }} component={DataPemberiKerja} />
            <Stack.Screen name="JobDetailCompany" options={{ headerShown: false }} component={JobDetailCompany} />
            <Stack.Screen name="DetailPelamar" options={{ headerShown: false }} component={DetailPelamar} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
            <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
            <Stack.Screen name="Spinner" options={{ headerShown: false }} component={Spinner} />
            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
            <Stack.Screen name="Lamaran" options={{ headerShown: false }} component={Lamaran} />
            <Stack.Screen name="BuatLamaran" options={{ headerShown: false }} component={BuatLamaran} />
            <Stack.Screen name="JobDetail" options={{ headerShown: false }} component={JobDetailScreen} />
            <Stack.Screen name="CV" options={{ headerShown: false }} component={DataPelamar} />
            <Stack.Screen name="ViewPdf" options={{ headerShown: false }} component={ViewPdf} />
            <Stack.Screen name="CompanyProfile" options={{ headerShown: false }} component={DataPemberiKerja} />
            <Stack.Screen name="JobDetailCompany" options={{ headerShown: false }} component={JobDetailCompany} />
            <Stack.Screen name="DetailPelamar" options={{ headerShown: false }} component={DetailPelamar} />
          
          
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
