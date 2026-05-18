import Constants from 'expo-constants';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

function resolveApiBase(): string {
  if (Platform.OS === 'web') return '';
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | undefined)
      ?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:8081`;
  }
  return 'http://localhost:8081';
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk))
    );
  }
  // eslint-disable-next-line no-undef
  return globalThis.btoa(binary);
}

let audioModeConfigured = false;
async function ensureAudioMode() {
  if (audioModeConfigured) return;
  audioModeConfigured = true;
  if (Platform.OS !== 'web') {
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
    } catch {}
  }
}

export interface UseVoice {
  play: (text: string, voiceId: string) => Promise<void>;
  stop: () => Promise<void>;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useVoice(): UseVoice {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const webUrlRef = useRef<string | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);
  const tokenRef = useRef(0);

  const cleanupWeb = useCallback(() => {
    if (webAudioRef.current) {
      try {
        webAudioRef.current.pause();
      } catch {}
      webAudioRef.current = null;
    }
    if (webUrlRef.current) {
      try {
        URL.revokeObjectURL(webUrlRef.current);
      } catch {}
      webUrlRef.current = null;
    }
  }, []);

  const cleanupNative = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.remove();
      } catch {}
      playerRef.current = null;
    }
  }, []);

  const stop = useCallback(async () => {
    if (Platform.OS === 'web') cleanupWeb();
    else cleanupNative();
    setIsPlaying(false);
  }, [cleanupWeb, cleanupNative]);

  const play = useCallback(
    async (text: string, voiceId: string) => {
      const token = ++tokenRef.current;
      setError(null);
      setIsLoading(true);
      try {
        await stop();
        await ensureAudioMode();
        const base = resolveApiBase();
        const res = await fetch(`${base}/api/voice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceId }),
        });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          throw new Error(`voice api ${res.status}: ${body || 'failed'}`);
        }

        if (token !== tokenRef.current) return; // superseded

        if (Platform.OS === 'web') {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          webUrlRef.current = url;
          const audio = new Audio(url);
          webAudioRef.current = audio;
          audio.onended = () => {
            if (webAudioRef.current === audio) {
              cleanupWeb();
              setIsPlaying(false);
            }
          };
          audio.onerror = () => {
            cleanupWeb();
            setIsPlaying(false);
            setError('audio playback failed');
          };
          await audio.play();
          setIsPlaying(true);
        } else {
          const buffer = await res.arrayBuffer();
          const base64 = arrayBufferToBase64(buffer);
          const uri = `${FileSystem.cacheDirectory}rite-utterance-${Date.now()}.mp3`;
          await FileSystem.writeAsStringAsync(uri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          if (token !== tokenRef.current) return;
          const player = createAudioPlayer({ uri });
          playerRef.current = player;
          player.addListener('playbackStatusUpdate', (status) => {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          });
          player.play();
          setIsPlaying(true);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'voice error');
        setIsPlaying(false);
      } finally {
        if (token === tokenRef.current) setIsLoading(false);
      }
    },
    [stop, cleanupWeb]
  );

  useEffect(
    () => () => {
      tokenRef.current++;
      cleanupWeb();
      cleanupNative();
    },
    [cleanupWeb, cleanupNative]
  );

  return { play, stop, isPlaying, isLoading, error };
}
