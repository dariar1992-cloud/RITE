import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { BreathingRing } from '@/components/BreathingRing';
import { GoldButton } from '@/components/GoldButton';
import { Waveform } from '@/components/Waveform';
import { AmbientOrb } from '@/components/AmbientOrb';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import {
  MODE_LABELS,
  getSessionScript,
  getStepsForMode,
  type Step,
} from '@/data/sessions';
import { useVoice } from '@/hooks/useVoice';
import { useRiteStore } from '@/store/useRiteStore';

function StepView({
  step,
  index,
  total,
  voiceId,
}: {
  step: Step;
  index: number;
  total: number;
  voiceId: string | null;
}) {
  const { play, stop, isPlaying, isLoading, error } = useVoice();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (triggeredRef.current) return;
    if (!voiceId) return;
    triggeredRef.current = true;
    const id = setTimeout(() => {
      play(getSessionScript(step), voiceId);
    }, ANIMATION.voiceAutoplayDelayMs);
    return () => clearTimeout(id);
  }, [step, voiceId, play]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const onToggleVoice = () => {
    if (isPlaying) {
      stop();
    } else if (voiceId) {
      play(getSessionScript(step), voiceId);
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

      <View style={{ alignItems: 'center', marginVertical: 18 }}>
        <BreathingRing size={240} symbol={step.symbol} />
      </View>

      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serifItalic,
          color: COLORS.cream,
          fontSize: 22,
          lineHeight: 30,
          textAlign: 'center',
          paddingHorizontal: 8,
          marginBottom: 18,
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
          marginBottom: 16,
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
          marginBottom: 24,
          lineHeight: 21,
        }}
      >
        {step.wisdom}
      </Text>

      <View style={{ alignItems: 'center', marginBottom: 16 }}>
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
  const steps = useMemo(() => getStepsForMode(mode), [mode]);
  const stepIndex = Math.min(current.stepIndex, steps.length - 1);
  const isLastStep = stepIndex === steps.length - 1;
  const step = steps[stepIndex];

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
      advanceStep();
    }
  };

  if (!current.mode) {
    return <View style={{ flex: 1, backgroundColor: COLORS.obsidian }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.obsidian }}>
      <AmbientOrb color={COLORS.gold} size={520} position={{ top: -200, left: -100 }} opacity={0.3} />
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
      />

      <View style={{ paddingHorizontal: 28, paddingBottom: 32 }}>
        <GoldButton
          label={isLastStep ? 'Complete Rite' : 'Continue'}
          onPress={onContinue}
        />
      </View>
    </View>
  );
}
