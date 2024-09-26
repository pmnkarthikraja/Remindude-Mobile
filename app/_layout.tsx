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


const tamaguiConfig = createTamagui(config);
type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
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
  const [isAnimationFinished,setAnimationFinished]=useState(false)

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
    return <SplashScreenComponent onAnimationFinish={(isCancelled:boolean)=>{
      if (!isCancelled){
        setAnimationFinished(true)
      }
    }}/>
  }

  return (
    <CategoryDataProvider>
      <ProfileContextProvider>
    <TamaguiProvider config={tamaguiConfig}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </ThemeProvider>
    </TamaguiProvider>
    </ProfileContextProvider>
    </CategoryDataProvider>
  );
}
