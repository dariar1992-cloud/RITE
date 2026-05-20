import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { ReadinessRing } from '@/components/ReadinessRing';
import {
  ANIMATION,
  COLORS,
  PHASE_ACCENT,
  PHASE_LABEL,
  TYPOGRAPHY,
  getDayPhase,
  recommendedModeForPhase,
} from '@/constants/design';
import { MODE_LABELS, type Mode } from '@/data/sessions';
import {
  computeReadiness,
  readinessLabel,
  useRiteStore,
} from '@/store/useRiteStore';

function useClock(): { time: string; date: string; phase: ReturnType<typeof getDayPhase> } {
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
  return { time, date, phase: getDayPhase(now) };
}

export default function HomeScreen() {
  const router = useRouter();
  const guideName = useRiteStore((s) => s.selectedGuideName);
  const streak = useRiteStore((s) => s.streakCount);
  const lastSessionDate = useRiteStore((s) => s.lastSessionDate);
  const lastDelta = useRiteStore((s) => s.lastChargeDelta);
  const historyCount = useRiteStore((s) => s.history.length);
  const totalSessions = useRiteStore((s) => s.totalSessions);
  const { time, date, phase } = useClock();

  const accent = PHASE_ACCENT[phase];
  const recommendedMode = recommendedModeForPhase(phase);

  const readiness = useMemo(
    () =>
      computeReadiness({
        streakCount: streak,
        lastSessionDate,
        lastChargeDelta: lastDelta,
      }),
    [streak, lastSessionDate, lastDelta]
  );

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian, paddingHorizontal: 28 }}
    >
      <AmbientOrb
        color={accent}
        size={420}
        position={{ top: -200, left: -40 }}
        opacity={0.35}
      />
      <AmbientOrb
        color={COLORS.indigoAccent}
        size={300}
        position={{ bottom: -120, right: -60 }}
        opacity={1}
      />

      <View style={{ paddingTop: 60, alignItems: 'center' }}>
        <Brand />
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginTop: 10,
          }}
        >
          {PHASE_LABEL[phase]} · {date}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.cream,
            fontSize: 42,
            lineHeight: 46,
          }}
        >
          {time}
        </Text>

        <ReadinessRing
          score={readiness}
          label={readinessLabel(readiness)}
          accentColor={accent}
        />

        <View style={{ width: '100%', gap: 12 }}>
          {(['stolen', 'winddown'] as Mode[]).map((mode) => {
            const { title, tagline, framing } = MODE_LABELS[mode];
            const recommended = mode === recommendedMode;
            return (
              <Pressable
                key={mode}
                onPress={() =>
                  router.push({ pathname: '/checkin', params: { mode } })
                }
                style={{
                  borderWidth: 1,
                  borderColor: recommended ? accent : COLORS.goldDim,
                  backgroundColor: COLORS.surface,
                  borderRadius: 18,
                  padding: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: TYPOGRAPHY.family.sans,
                      color: recommended ? accent : COLORS.gold,
                      fontSize: 10,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                    }}
                  >
                    {mode === 'stolen' ? '⚡  Stolen Moment' : '🌑  Wind Down'}
                  </Text>
                  {recommended ? (
                    <Text
                      style={{
                        fontFamily: TYPOGRAPHY.family.sans,
                        color: COLORS.obsidian,
                        backgroundColor: accent,
                        fontSize: 9,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 999,
                        overflow: 'hidden',
                      }}
                    >
                      Recommended now
                    </Text>
                  ) : null}
                </View>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.serif,
                    color: COLORS.cream,
                    fontSize: 22,
                    marginBottom: 4,
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sansLight,
                    color: COLORS.creamDim,
                    fontSize: 12,
                  }}
                >
                  {tagline}
                </Text>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.serifItalic,
                    color: COLORS.goldDim,
                    fontSize: 11,
                    marginTop: 8,
                  }}
                >
                  {framing}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={{
          paddingBottom: 28,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={() => router.push('/history')}
          disabled={historyCount === 0}
          style={{ opacity: historyCount === 0 ? 0.5 : 1 }}
        >
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            History · {totalSessions}
          </Text>
        </Pressable>

        {streak > 0 ? (
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: accent,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Streak · {streak}
          </Text>
        ) : (
          <View />
        )}

        <Pressable onPress={() => router.push('/onboarding')}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {guideName ?? '—'} · change
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
