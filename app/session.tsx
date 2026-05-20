import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { BreathingRing } from '@/components/BreathingRing';
import { GoldButton } from '@/components/GoldButton';
import { Waveform } from '@/components/Waveform';
import { WisdomTransition } from '@/components/WisdomTransition';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import {
  MODE_LABELS,
  STATE_OPENERS,
  getSessionScript,
  getStepsForMode,
  type CheckInState,
  type Step,
} from '@/data/sessions';
import { useVoice } from '@/hooks/useVoice';
import { useRiteStore } from '@/store/useRiteStore';

function stripAttribution(wisdom: string): string {
  const idx = wisdom.indexOf(' — ');
  return idx === -1 ? wisdom : wisdom.slice(0, idx);
}

function StepView({
  step,
  index,
  total,
  voiceId,
  stateOpener,
}: {
  step: Step;
  index: number;
  total: number;
  voiceId: string | null;
  stateOpener: string | null;
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

      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sans,
          color: COLORS.goldDim,
          fontSize: 9,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
          textAlign: 'center',
          paddingHorizontal: 16,
          marginBottom: 14,
          lineHeight: 14,
        }}
      >
        {step.science}
      </Text>

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

  const mode = current.mode ?? 'stolen';
  const checkInState: CheckInState | null = current.currentState;
  const steps = useMemo(() => getStepsForMode(mode), [mode]);
  const stepIndex = Math.min(current.stepIndex, steps.length - 1);
  const isLastStep = stepIndex === steps.length - 1;
  const step = steps[stepIndex];
  const stateOpener = checkInState ? STATE_OPENERS[checkInState] : null;

  const [showingTransition, setShowingTransition] = useState(false);
  const [transitionQuote, setTransitionQuote] = useState<string>('');

  useEffect(() => {
    if (!current.mode) {
      router.replace('/');
    }
  }, [current.mode, router]);

  const onContinue = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
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
        voiceId={voiceId}
        stateOpener={index0Opener(stepIndex, stateOpener)}
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
    </View>
  );
}

function index0Opener(stepIndex: number, opener: { display: string; spoken: string } | null) {
  if (stepIndex !== 0 || !opener) return null;
  return opener.display;
}
