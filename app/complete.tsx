import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { ChargePicker } from '@/components/ChargePicker';
import { CitationSheet } from '@/components/CitationSheet';
import { GoldButton } from '@/components/GoldButton';
import { WhyThisWorked } from '@/components/WhyThisWorked';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import { computeCycleState } from '@/data/cycle';
import { getStepsForMode } from '@/data/sessions';
import {
  PHASE_CITATIONS,
  STEP_CITATIONS,
  getEvidence,
  type Evidence,
} from '@/data/science';
import { haptics } from '@/hooks/useHaptics';
import { useRiteStore } from '@/store/useRiteStore';

function Metric({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'positive' | 'neutral' | 'negative';
}) {
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
  const state = useRiteStore((s) => s.current.currentState);
  const duration = useRiteStore((s) => s.current.durationMinutes);
  const chargeBefore = useRiteStore((s) => s.current.chargeBefore);
  const cycle = useRiteStore((s) => s.cycle);
  const sessionCompletedRef = useRef(false);

  const [chargeAfter, setLocalChargeAfter] = useState<number | null>(null);
  const [recorded, setRecorded] = useState(false);
  const [openEvidence, setOpenEvidence] = useState<Evidence | null>(null);

  useEffect(() => {
    if (sessionCompletedRef.current) return;
    if (chargeBefore == null) {
      sessionCompletedRef.current = true;
      completeSession();
      setRecorded(true);
      haptics.success();
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
    setTimeout(() => {
      completeSession();
      setRecorded(true);
      haptics.success();
    }, 0);
  };

  const wisdom = useMemo(() => {
    if (!mode) return null;
    const steps = getStepsForMode(mode);
    return steps[steps.length - 1].wisdom;
  }, [mode]);

  const cyclePhase = useMemo(() => {
    if (!cycle.enabled || !cycle.lastPeriodStart) return null;
    const cs = computeCycleState({
      lastPeriodStart: cycle.lastPeriodStart,
      cycleLengthDays: cycle.cycleLengthDays,
      periodLengthDays: cycle.periodLengthDays,
    });
    return cs?.phase ?? null;
  }, [cycle]);

  const citations = useMemo<Evidence[]>(() => {
    if (!mode) return [];
    const ids = new Set<string>();
    const layers: Array<'body' | 'energy' | 'mind' | 'soul'> = ['body', 'energy', 'mind', 'soul'];
    layers.forEach((layer) => {
      (STEP_CITATIONS[`${mode}-${layer}`] ?? []).forEach((id) => ids.add(id));
    });
    if (cyclePhase) {
      (PHASE_CITATIONS[cyclePhase] ?? []).forEach((id) => ids.add(id));
    }
    return Array.from(ids)
      .map((id) => getEvidence(id))
      .filter((x): x is Evidence => Boolean(x))
      .slice(0, 4);
  }, [mode, cyclePhase]);

  const delta =
    chargeBefore != null && chargeAfter != null ? chargeAfter - chargeBefore : null;
  const deltaText =
    delta == null ? '—' : delta > 0 ? `+${delta}` : `${delta}`;
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

      <View style={{ flex: 1, justifyContent: 'center', gap: 20 }}>
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
            <ChargePicker
              value={chargeAfter}
              onChange={(n) => {
                haptics.select();
                setLocalChargeAfter(n);
              }}
            />
            <GoldButton
              label="Lock delta"
              disabled={chargeAfter == null}
              onPress={onLockDelta}
              variant="ghost"
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Metric label="Charge Δ" value={deltaText} tone={deltaTone} />
            <Metric label="Streak" value={String(streak)} />
            <Metric label="Lifetime" value={String(totalSessions)} />
          </View>
        )}

        {mode && duration != null ? (
          <WhyThisWorked
            mode={mode}
            durationMinutes={duration}
            state={state}
            phase={cyclePhase}
            charge={chargeBefore}
            citations={citations}
            onOpenCitation={(e) => {
              haptics.select();
              setOpenEvidence(e);
            }}
          />
        ) : null}

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
      </View>

      <View style={{ paddingBottom: 32 }}>
        <GoldButton
          label="Return to the world"
          onPress={() => router.replace('/')}
        />
      </View>

      <CitationSheet evidence={openEvidence} onClose={() => setOpenEvidence(null)} />
    </Animated.View>
  );
}
