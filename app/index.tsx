import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import { MODE_LABELS, type Mode } from '@/data/sessions';
import { useRiteStore } from '@/store/useRiteStore';

function useClock(): { time: string; date: string } {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  return { time, date };
}

export default function HomeScreen() {
  const router = useRouter();
  const guideName = useRiteStore((s) => s.selectedGuideName);
  const streak = useRiteStore((s) => s.streakCount);
  const { time, date } = useClock();

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian, paddingHorizontal: 28 }}
    >
      <AmbientOrb color={COLORS.gold} size={360} position={{ top: -180, left: -20 }} opacity={0.35} />

      <View style={{ paddingTop: 72, alignItems: 'center' }}>
        <Brand />
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serif,
              color: COLORS.cream,
              fontSize: 56,
              lineHeight: 60,
            }}
          >
            {time}
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sansLight,
              color: COLORS.creamDim,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {date}
          </Text>
          {streak > 0 ? (
            <Text
              style={{
                marginTop: 6,
                fontFamily: TYPOGRAPHY.family.sans,
                color: COLORS.goldDim,
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Streak · {streak}
            </Text>
          ) : null}
        </View>

        <View style={{ width: '100%', gap: 14 }}>
          {(['stolen', 'winddown'] as Mode[]).map((mode) => {
            const { title, tagline, framing } = MODE_LABELS[mode];
            return (
              <Pressable
                key={mode}
                onPress={() =>
                  router.push({ pathname: '/checkin', params: { mode } })
                }
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.goldDim,
                  backgroundColor: COLORS.surface,
                  borderRadius: 18,
                  padding: 22,
                }}
              >
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sans,
                    color: COLORS.gold,
                    fontSize: 10,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  {mode === 'stolen' ? '⚡  Stolen Moment' : '🌑  Wind Down Rite'}
                </Text>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.serif,
                    color: COLORS.cream,
                    fontSize: 24,
                    marginBottom: 4,
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sansLight,
                    color: COLORS.creamDim,
                    fontSize: 13,
                  }}
                >
                  {tagline}
                </Text>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.serifItalic,
                    color: COLORS.goldDim,
                    fontSize: 12,
                    marginTop: 10,
                  }}
                >
                  {framing}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ paddingBottom: 32, alignItems: 'center' }}>
        <Pressable onPress={() => router.push('/onboarding')}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Guided by {guideName ?? '—'} · change
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
