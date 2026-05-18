import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { GoldButton } from '@/components/GoldButton';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import { getStepsForMode } from '@/data/sessions';
import { useRiteStore } from '@/store/useRiteStore';

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.goldDim,
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        padding: 16,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sans,
          color: COLORS.goldDim,
          fontSize: 9,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serif,
          color: COLORS.gold,
          fontSize: 26,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export default function CompleteScreen() {
  const router = useRouter();
  const completeSession = useRiteStore((s) => s.completeSession);
  const resetSession = useRiteStore((s) => s.resetSession);
  const streak = useRiteStore((s) => s.streakCount);
  const totalSessions = useRiteStore((s) => s.totalSessions);
  const mode = useRiteStore((s) => s.current.mode);

  const ranRef = useRef(false);
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    completeSession();
  }, [completeSession]);

  useEffect(() => {
    return () => {
      resetSession();
    };
  }, [resetSession]);

  const wisdom = useMemo(() => {
    if (!mode) return null;
    const steps = getStepsForMode(mode);
    return steps[steps.length - 1].wisdom;
  }, [mode]);

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{
        flex: 1,
        backgroundColor: COLORS.obsidian,
        paddingHorizontal: 28,
      }}
    >
      <AmbientOrb color={COLORS.gold} size={420} position={{ top: -180 }} opacity={0.35} />
      <AmbientOrb color={COLORS.indigoAccent} size={360} position={{ bottom: -120, right: -80 }} opacity={1} />

      <View style={{ paddingTop: 72, alignItems: 'center' }}>
        <Brand />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', gap: 28 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.gold,
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            Rite complete
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serif,
              color: COLORS.cream,
              fontSize: 30,
              textAlign: 'center',
            }}
          >
            The protocol is done.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Metric label="HRV est." value="+12%" />
          <Metric label="Cortisol est." value="−18%" />
          <Metric label="Streak" value={String(streak)} />
        </View>

        {wisdom ? (
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.creamDim,
              fontSize: 15,
              lineHeight: 22,
              textAlign: 'center',
              paddingHorizontal: 12,
            }}
          >
            {wisdom}
          </Text>
        ) : null}

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {totalSessions} {totalSessions === 1 ? 'rite' : 'rites'} completed
        </Text>
      </View>

      <View style={{ paddingBottom: 32 }}>
        <GoldButton
          label="Return to the world"
          onPress={() => router.replace('/')}
        />
      </View>
    </Animated.View>
  );
}
