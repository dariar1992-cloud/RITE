import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { GoldButton } from '@/components/GoldButton';
import {
  ANIMATION,
  COLORS,
  GUIDES,
  TYPOGRAPHY,
  WELCOME_SCRIPT,
  type Guide,
} from '@/constants/design';
import { useVoice } from '@/hooks/useVoice';
import { useRiteStore } from '@/store/useRiteStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const setGuide = useRiteStore((s) => s.setGuide);
  const completeOnboarding = useRiteStore((s) => s.completeOnboarding);
  const onboarded = useRiteStore((s) => s.onboarded);

  const [selected, setSelected] = useState<Guide | null>(null);
  const { play, isLoading, isPlaying, error } = useVoice();
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const onEnter = () => {
    if (!selected) return;
    setGuide(selected.name, selected.voiceId);
    completeOnboarding();
    router.replace('/');
  };

  const onPreview = (g: Guide) => {
    setPreviewingId(g.id);
    play(WELCOME_SCRIPT, g.voiceId).finally(() => setPreviewingId(null));
  };

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <AmbientOrb color={COLORS.gold} size={420} position={{ top: -200 }} opacity={0.3} />
      <ScrollView
        contentContainerStyle={{
          padding: 28,
          paddingTop: 72,
          paddingBottom: 48,
          minHeight: '100%',
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Brand />
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.creamDim,
              fontSize: 14,
              marginTop: 16,
              textAlign: 'center',
              paddingHorizontal: 8,
            }}
          >
            Choose your voice guide.
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginTop: 8,
            }}
          >
            One voice. Every session.
          </Text>
        </View>

        <View style={{ gap: 14, marginBottom: 28 }}>
          {GUIDES.map((g) => {
            const isSelected = selected?.id === g.id;
            return (
              <Pressable
                key={g.id}
                onPress={() => setSelected(g)}
                style={{
                  borderWidth: 1,
                  borderColor: isSelected ? COLORS.gold : COLORS.goldDim,
                  backgroundColor: isSelected ? COLORS.surface : COLORS.deepSurface,
                  borderRadius: 18,
                  padding: 22,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: TYPOGRAPHY.family.serif,
                      color: COLORS.cream,
                      fontSize: 26,
                    }}
                  >
                    {g.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: TYPOGRAPHY.family.sans,
                      color: COLORS.goldDim,
                      fontSize: 9,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                    }}
                  >
                    {g.archetype}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sansLight,
                    color: COLORS.creamDim,
                    fontSize: 13,
                    marginTop: 6,
                    lineHeight: 19,
                  }}
                >
                  {g.personality}
                </Text>
                <Pressable
                  onPress={() => onPreview(g)}
                  style={{
                    marginTop: 14,
                    alignSelf: 'flex-start',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: COLORS.goldDim,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: TYPOGRAPHY.family.sans,
                      color: COLORS.gold,
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    {previewingId === g.id
                      ? isLoading
                        ? 'Loading…'
                        : isPlaying
                          ? 'Playing…'
                          : 'Preview voice'
                      : 'Preview voice'}
                  </Text>
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        {error ? (
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: '#c97a7a',
              fontSize: 11,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Voice unavailable: {error}
          </Text>
        ) : null}

        <GoldButton
          label={onboarded ? 'Save guide' : 'Enter RITE'}
          disabled={!selected}
          onPress={onEnter}
        />
      </ScrollView>
    </Animated.View>
  );
}
