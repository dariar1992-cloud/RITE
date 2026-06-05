import '@/global.css';

import {
  CormorantGaramond_300Light,
  CormorantGaramond_300Light_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { setAudioModeAsync } from 'expo-audio';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { COLORS } from '@/constants/design';
import { useRiteStore } from '@/store/useRiteStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_300Light_Italic,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  const hydrated = useRiteStore.persist.hasHydrated();
  const onboarded = useRiteStore((s) => s.onboarded);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded && hydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, hydrated]);

  // Onboarding gate — runs only after the Stack has mounted. Guard with a
  // short delay to ensure the navigator is fully ready before .replace().
  useEffect(() => {
    if (!fontsLoaded || !hydrated) return;
    const top = segments[0];
    if (!onboarded && top !== 'onboarding') {
      const id = setTimeout(() => router.replace('/onboarding'), 0);
      return () => clearTimeout(id);
    }
  }, [fontsLoaded, hydrated, onboarded, segments, router]);

  // Always mount the Stack; expo-splash-screen covers it until ready.
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.obsidian }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: COLORS.obsidian },
        }}
      />
    </GestureHandlerRootView>
  );
}
