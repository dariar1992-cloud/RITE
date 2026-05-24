import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Brand } from '@/components/Brand';
import { ChargePicker } from '@/components/ChargePicker';
import { GoldButton } from '@/components/GoldButton';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import {
  MODE_LABELS,
  STATES,
  getDurationsForMode,
  type CheckInState,
  type Mode,
} from '@/data/sessions';
import { haptics } from '@/hooks/useHaptics';
import { useRiteStore } from '@/store/useRiteStore';

function asMode(value: unknown): Mode {
  return value === 'winddown' ? 'winddown' : 'stolen';
}

export default function CheckinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = asMode(params.mode);
  const startSession = useRiteStore((s) => s.startSession);

  const [state, setState] = useState<CheckInState | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [charge, setCharge] = useState<number | null>(null);

  const durations = getDurationsForMode(mode);
  const ready = state !== null && duration !== null;

  const onBegin = () => {
    if (!ready) return;
    startSession(mode, state!, duration!, charge);
    router.push('/session');
  };

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 28,
          paddingTop: 64,
          paddingBottom: 48,
          minHeight: '100%',
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Brand />
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.gold,
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginTop: 12,
            }}
          >
            {MODE_LABELS[mode].title}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.cream,
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 6,
          }}
        >
          How are you arriving?
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sansLight,
            color: COLORS.creamDim,
            fontSize: 13,
            textAlign: 'center',
            marginBottom: 18,
          }}
        >
          One word. The protocol adapts.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 28,
          }}
        >
          {STATES.map((s) => {
            const selected = state === s;
            return (
              <Pressable
                key={s}
                onPress={() => {
                  haptics.select();
                  setState(s);
                }}
                style={{
                  paddingVertical: 11,
                  paddingHorizontal: 18,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: selected ? COLORS.gold : COLORS.goldDim,
                  backgroundColor: selected ? COLORS.surface : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sans,
                    color: selected ? COLORS.cream : COLORS.creamDim,
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  {s}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.cream,
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 6,
          }}
        >
          How much time?
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sansLight,
            color: COLORS.creamDim,
            fontSize: 13,
            textAlign: 'center',
            marginBottom: 18,
          }}
        >
          Minutes — choose precisely.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 28,
          }}
        >
          {durations.map((d) => {
            const selected = duration === d;
            return (
              <Pressable
                key={d}
                onPress={() => {
                  haptics.select();
                  setDuration(d);
                }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  borderWidth: 1,
                  borderColor: selected ? COLORS.gold : COLORS.goldDim,
                  backgroundColor: selected ? COLORS.surface : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.serif,
                    color: selected ? COLORS.gold : COLORS.creamDim,
                    fontSize: 24,
                  }}
                >
                  {d}
                </Text>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sans,
                    color: COLORS.goldDim,
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  min
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.cream,
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 6,
          }}
        >
          Charge level — now.
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sansLight,
            color: COLORS.creamDim,
            fontSize: 13,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          Honest read. We will measure the delta after.
        </Text>

        <View style={{ marginBottom: 36 }}>
          <ChargePicker
            value={charge}
            onChange={(n) => {
              haptics.select();
              setCharge(n);
            }}
          />
        </View>

        <GoldButton label="Begin Rite" disabled={!ready} onPress={onBegin} />

        {charge == null ? (
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            Charge optional — skip to begin
          </Text>
        ) : null}
      </ScrollView>
    </Animated.View>
  );
}
