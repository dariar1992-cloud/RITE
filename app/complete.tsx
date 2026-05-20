import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { ChargePicker } from '@/components/ChargePicker';
import { GoldButton } from '@/components/GoldButton';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import { getStepsForMode } from '@/data/sessions';
import { useRiteStore } from '@/store/useRiteStore';

function Metric({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'positive' | 'neutral' | 'negative' }) {
  const valueColor =
    tone === 'positive' ? '#7AD27A' : tone === 'negative' ? '#c97a7a' : COLORS.gold;
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.goldDim,
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        padding: 14,
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
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serif,
          color: valueColor,
          fontSize: 24,
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
  const setChargeAfter = useRiteStore((s) => s.setChargeAfter);
  const streak = useRiteStore((s) => s.streakCount);
  const totalSessions = useRiteStore((s) => s.totalSessions);
  const mode = useRiteStore((s) => s.current.mode);
  const chargeBefore = useRiteStore((s) => s.current.chargeBefore);
  const sessionCompletedRef = useRef(false);

  const [chargeAfter, setLocalChargeAfter] = useState<number | null>(null);
  const [recorded, setRecorded] = useState(false);

  // Complete on mount only if chargeBefore was not set (skip-the-question path)
  useEffect(() => {
    if (sessionCompletedRef.current) return;
    if (chargeBefore == null) {
      sessionCompletedRef.current = true;
      completeSession();
      setRecorded(true);
    }
  }, [chargeBefore, completeSession]);

  useEffect(() => {
    return () => {
      resetSession();
    };
  }, [resetSession]);

  const onLockDelta = () => {
    if (sessionCompletedRef.current || chargeAfter == null) return;
    setChargeAfter(chargeAfter);
    sessionCompletedRef.current = true;
    // Defer to allow state update before completeSession reads it
    setTimeout(() => {
      completeSession();
      setRecorded(true);
    }, 0);
  };

  const wisdom = useMemo(() => {
    if (!mode) return null;
    const steps = getStepsForMode(mode);
    return steps[steps.length - 1].wisdom;
  }, [mode]);

  const delta = chargeBefore != null && chargeAfter != null ? chargeAfter - chargeBefore : null;
  const deltaText =
    delta == null
      ? '—'
      : delta > 0
        ? `+${delta}`
        : `${delta}`;
  const deltaTone: 'positive' | 'neutral' | 'negative' =
    delta == null ? 'neutral' : delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';

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

      <View style={{ paddingTop: 60, alignItems: 'center' }}>
        <Brand />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', gap: 22 }}>
        <View style={{ alignItems: 'center', gap: 6 }}>
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
              fontSize: 28,
              textAlign: 'center',
            }}
          >
            The protocol is done.
          </Text>
        </View>

        {chargeBefore != null && !recorded ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: COLORS.goldDim,
              borderRadius: 14,
              padding: 18,
              gap: 14,
            }}
          >
            <Text
              style={{
                fontFamily: TYPOGRAPHY.family.serif,
                color: COLORS.cream,
                fontSize: 18,
                textAlign: 'center',
              }}
            >
              Where is your charge now?
            </Text>
            <Text
              style={{
                fontFamily: TYPOGRAPHY.family.sansLight,
                color: COLORS.creamDim,
                fontSize: 12,
                textAlign: 'center',
                marginTop: -8,
              }}
            >
              You started at {chargeBefore} / 10.
            </Text>
            <ChargePicker value={chargeAfter} onChange={setLocalChargeAfter} />
            <GoldButton
              label="Lock delta"
              disabled={chargeAfter == null}
              onPress={onLockDelta}
              variant="ghost"
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Metric label="HRV est." value="+12%" tone="positive" />
            <Metric
              label="Charge Δ"
              value={deltaText}
              tone={deltaTone}
            />
            <Metric label="Streak" value={String(streak)} />
          </View>
        )}

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
