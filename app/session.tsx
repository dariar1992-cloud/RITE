import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { BreathingRing } from '@/components/BreathingRing';
import { CitationSheet } from '@/components/CitationSheet';
import { GoldButton } from '@/components/GoldButton';
import { SettlingBeat } from '@/components/SettlingBeat';
import { Waveform } from '@/components/Waveform';
import { WisdomTransition } from '@/components/WisdomTransition';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import { PHASES, computeCycleState } from '@/data/cycle';
import {
  MODE_LABELS,
  STATE_OPENERS,
  getSessionScript,
  getStepsForMode,
  type CheckInState,
  type Step,
} from '@/data/sessions';
import {
  STEP_CITATIONS,
  getEvidence,
  type Evidence,
} from '@/data/science';
import { useVoice } from '@/hooks/useVoice';
import { haptics } from '@/hooks/useHaptics';
import { useRiteStore } from '@/store/useRiteStore';

function stripAttribution(wisdom: string): string {
  const idx = wisdom.indexOf(' — ');
  return idx === -1 ? wisdom : wisdom.slice(0, idx);
}

function citationKey(mode: 'stolen' | 'winddown', layer: Step['layer']): string {
  return `${mode}-${layer.toLowerCase()}`;
}

function StepView({
  step,
  index,
  total,
  voiceId,
  stateOpener,
  primaryEvidence,
  onOpenEvidence,
}: {
  step: Step;
  index: number;
  total: number;
  voiceId: string | null;
  stateOpener: string | null;
  primaryEvidence: Evidence | null;
  onOpenEvidence: (e: Evidence) => void;
}) {
  const { play, stop, isPlaying, isLoading, error } = useVoice();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (triggeredRef.current) return;
    if (!voiceId) return;
    triggeredRef.current = true;
    const id = setTimeout(() => {
      const script = stateOpener
        ? `${stateOpener} ... ${getSessionScript(step)}`
        : getSessionScript(step);
      play(script, voiceId);
    }, ANIMATION.voiceAutoplayDelayMs);
    return () => clearTimeout(id);
  }, [step, voiceId, play, stateOpener]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const onToggleVoice = () => {
    haptics.select();
    if (isPlaying) {
      stop();
    } else if (voiceId) {
      const script = stateOpener
        ? `${stateOpener} ... ${getSessionScript(step)}`
        : getSessionScript(step);
      play(script, voiceId);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, paddingHorizontal: 28 }}
    >
      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 8 }}>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.gold,
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {step.layer} · Layer {index + 1} of {total}
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginVertical: 14 }}>
        <BreathingRing size={220} symbol={step.symbol} />
      </View>

      {index === 0 && stateOpener ? (
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serifItalic,
            color: COLORS.gold,
            fontSize: 15,
            lineHeight: 22,
            textAlign: 'center',
            paddingHorizontal: 8,
            marginBottom: 14,
          }}
        >
          {stateOpener}
        </Text>
      ) : null}

      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serifItalic,
          color: COLORS.cream,
          fontSize: 21,
          lineHeight: 28,
          textAlign: 'center',
          paddingHorizontal: 8,
          marginBottom: 16,
        }}
      >
        {step.instruction}
      </Text>

      <Pressable
        onPress={() => primaryEvidence && onOpenEvidence(primaryEvidence)}
        disabled={!primaryEvidence}
      >
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 9,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            textAlign: 'center',
            paddingHorizontal: 16,
            marginBottom: 4,
            lineHeight: 14,
          }}
        >
          {step.science}
        </Text>
        {primaryEvidence ? (
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.gold,
              fontSize: 8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: 14,
              opacity: 0.8,
            }}
          >
            Tap for source ↗
          </Text>
        ) : (
          <View style={{ marginBottom: 14 }} />
        )}
      </Pressable>

      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serifItalic,
          color: COLORS.creamDim,
          fontSize: 14,
          textAlign: 'center',
          paddingHorizontal: 12,
          marginBottom: 20,
          lineHeight: 21,
        }}
      >
        {step.wisdom}
      </Text>

      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Pressable
          onPress={onToggleVoice}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 22,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: COLORS.goldDim,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Waveform active={isPlaying} />
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.gold,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {isLoading ? 'Loading' : isPlaying ? 'Stop' : 'Replay'}
          </Text>
        </Pressable>
        {error ? (
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: '#c97a7a',
              fontSize: 10,
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

export default function SessionScreen() {
  const router = useRouter();
  const current = useRiteStore((s) => s.current);
  const advanceStep = useRiteStore((s) => s.advanceStep);
  const voiceId = useRiteStore((s) => s.selectedVoiceId);
  const cycle = useRiteStore((s) => s.cycle);

  const mode = current.mode ?? 'stolen';
  const checkInState: CheckInState | null = current.currentState;
  const steps = useMemo(() => getStepsForMode(mode), [mode]);
  const stepIndex = Math.min(current.stepIndex, steps.length - 1);
  const isLastStep = stepIndex === steps.length - 1;
  const step = steps[stepIndex];
  const stateOpener = checkInState ? STATE_OPENERS[checkInState] : null;

  const phaseOpener = useMemo(() => {
    if (!cycle.enabled || !cycle.lastPeriodStart) return null;
    const cs = computeCycleState({
      lastPeriodStart: cycle.lastPeriodStart,
      cycleLengthDays: cycle.cycleLengthDays,
      periodLengthDays: cycle.periodLengthDays,
    });
    if (!cs) return null;
    return PHASES[cs.phase].opener;
  }, [cycle]);

  const combinedOpener = useMemo(() => {
    const parts: string[] = [];
    if (stateOpener) parts.push(stateOpener.display);
    if (phaseOpener) parts.push(phaseOpener);
    return parts.length ? parts.join(' ') : null;
  }, [stateOpener, phaseOpener]);

  const primaryEvidence = useMemo<Evidence | null>(() => {
    const ids = STEP_CITATIONS[citationKey(mode, step.layer)] ?? [];
    const first = ids[0];
    return first ? (getEvidence(first) ?? null) : null;
  }, [mode, step.layer]);

  const [openEvidence, setOpenEvidence] = useState<Evidence | null>(null);
  const [showingTransition, setShowingTransition] = useState(false);
  const [transitionQuote, setTransitionQuote] = useState<string>('');
  // Settling beat only runs on step 0; subsequent steps go straight to voice.
  const [settling, setSettling] = useState(true);
  useEffect(() => {
    setSettling(stepIndex === 0);
  }, [stepIndex, mode]);

  useEffect(() => {
    if (!current.mode) {
      router.replace('/');
    }
  }, [current.mode, router]);

  const onContinue = () => {
    haptics.light();
    if (isLastStep) {
      router.replace('/complete');
    } else {
      setTransitionQuote(stripAttribution(step.wisdom));
      setShowingTransition(true);
    }
  };

  const onTransitionDone = () => {
    setShowingTransition(false);
    advanceStep();
  };

  if (!current.mode) {
    return <View style={{ flex: 1, backgroundColor: COLORS.obsidian }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.obsidian }}>
      <AmbientOrb
        color={COLORS.gold}
        size={520}
        position={{ top: -200, left: -100 }}
        opacity={0.28}
      />
      <AmbientOrb
        color={COLORS.indigoAccent}
        size={400}
        position={{ bottom: -160, right: -80 }}
        opacity={1}
      />

      <View style={{ paddingTop: 56, paddingHorizontal: 28, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {MODE_LABELS[mode].title}
        </Text>
      </View>

      <StepView
        key={`${mode}-${stepIndex}`}
        step={step}
        index={stepIndex}
        total={steps.length}
        voiceId={settling ? null : voiceId}
        stateOpener={stepIndex === 0 ? combinedOpener : null}
        primaryEvidence={primaryEvidence}
        onOpenEvidence={(e) => {
          haptics.select();
          setOpenEvidence(e);
        }}
      />

      <View style={{ paddingHorizontal: 28, paddingBottom: 32 }}>
        <GoldButton
          label={isLastStep ? 'Complete Rite' : 'Continue'}
          onPress={onContinue}
        />
      </View>

      {showingTransition ? (
        <WisdomTransition quote={transitionQuote} onDone={onTransitionDone} />
      ) : null}

      {settling && stepIndex === 0 ? (
        <SettlingBeat
          symbol={step.symbol}
          layerLabel={step.layer}
          onDone={() => setSettling(false)}
        />
      ) : null}

      <CitationSheet evidence={openEvidence} onClose={() => setOpenEvidence(null)} />
    </View>
  );
}
