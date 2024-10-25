import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider, createTamagui } from 'tamagui';
import { config } from '@tamagui/config/v3';
import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from 'react-query';
import SplashScreenComponent from '@/components/SplashScreen';
import { CategoryDataProvider } from '@/hooks/useCategoryData';
import { ProfileContextProvider } from '@/hooks/useProfile';
import { UserProvider, useUser } from '@/components/userContext';
import { TimeAnimationProvider } from '@/components/TimeAnimationProvider';

import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import axios from 'axios';


//permission for ios
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();  
  } else {
    console.log('Notification permission denied');
  }
}

const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    if (token) {
      await AsyncStorage.setItem('fcmToken', token);
    } else {
      console.log('Failed to get FCM token');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

async function requestUserPermissionAndroid() {
  if (Platform.OS === 'android') {
    const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    console.log("isGranted: ",isGranted)

    if (isGranted) {
      console.log('Notification permission already granted.');
      return;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app needs permission to show notifications.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  }
}

const tamaguiConfig = createTamagui(config);
type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf { }
}

export default function RootLayout() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/Inter.ttf'),
    InterBold: require('../assets/fonts/Inter.ttf'),
  });
  const [showSplash, setShowSplash] = useState(true);
  const [isAnimationFinished, setAnimationFinished] = useState(false)

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //   console.log('Message handled in the background!', remoteMessage);
  // });


  useEffect(() => {
    // For iOS, request permission
    if (Platform.OS === 'ios') {
      requestUserPermission();
    } else {      
      // On Android, automatically get the FCM token
      requestUserPermissionAndroid()
      getFcmToken();
    }

    // listen for incoming notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
       await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
        },
        trigger: null
      });
      
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        setTimeout(async () => {
          await SplashScreen.hideAsync();
          setShowSplash(false);
        }, 100);
      }
    };

    hideSplash();
  }, [fontsLoaded]);



  if (showSplash || !isAnimationFinished) {
    return <SplashScreenComponent onAnimationFinish={(isCancelled: boolean) => {
      if (!isCancelled) {
        setAnimationFinished(true)
      }
    }} />
  }

  return (
    <TimeAnimationProvider>
      <UserProvider>
        <CategoryDataProvider>
          <ProfileContextProvider>
            <TamaguiProvider config={tamaguiConfig}>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <QueryClientProvider client={queryClient}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Settings' }} />
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                    <Stack.Screen name="oauthredirect" options={{ headerShown: false }} />
                    <Stack.Screen name="change-password" options={{ headerShown: true, title: 'Change Password' }} />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </QueryClientProvider>
              </ThemeProvider>
            </TamaguiProvider>
          </ProfileContextProvider>
        </CategoryDataProvider>
        </UserProvider>
    </TimeAnimationProvider>
  );
}
