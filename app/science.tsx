import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { CitationSheet } from '@/components/CitationSheet';
import { GoldButton } from '@/components/GoldButton';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import {
  CATEGORY_LABEL,
  EVIDENCE,
  EVIDENCE_LEVEL_COLOR,
  EVIDENCE_LEVEL_LABEL,
  type Evidence,
} from '@/data/science';

const CATEGORIES = [
  'breath',
  'nervous_system',
  'mind',
  'recovery',
  'cycle',
] as const;

export default function ScienceScreen() {
  const router = useRouter();
  const [open, setOpen] = useState<Evidence | null>(null);

  const grouped = useMemo(() => {
    const m = new Map<string, Evidence[]>();
    CATEGORIES.forEach((c) => m.set(c, []));
    for (const e of EVIDENCE) {
      const arr = m.get(e.category);
      if (arr) arr.push(e);
    }
    return m;
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <AmbientOrb color={COLORS.gold} size={360} position={{ top: -180 }} opacity={0.22} />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 40 }}
      >
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
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
            The Evidence
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.creamDim,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 10,
              paddingHorizontal: 12,
              lineHeight: 21,
            }}
          >
            Every technique in RITE traces to a peer-reviewed source. Tap any
            entry to read the study.
          </Text>
        </View>

        {CATEGORIES.map((cat) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          return (
            <View key={cat} style={{ marginTop: 18 }}>
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.family.sans,
                  color: COLORS.gold,
                  fontSize: 9,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                {CATEGORY_LABEL[cat]}
              </Text>

              <View style={{ gap: 8 }}>
                {items.map((e) => {
                  const levelColor = EVIDENCE_LEVEL_COLOR[e.evidenceLevel];
                  return (
                    <Pressable
                      key={e.id}
                      onPress={() => setOpen(e)}
                      style={{
                        borderWidth: 1,
                        borderColor: 'rgba(122,104,40,0.3)',
                        borderRadius: 12,
                        padding: 14,
                        backgroundColor: COLORS.surface,
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: levelColor,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: TYPOGRAPHY.family.sans,
                            color: COLORS.goldDim,
                            fontSize: 9,
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                          }}
                        >
                          {EVIDENCE_LEVEL_LABEL[e.evidenceLevel]}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: TYPOGRAPHY.family.serif,
                          color: COLORS.cream,
                          fontSize: 17,
                          lineHeight: 22,
                        }}
                      >
                        {e.technique}
                      </Text>
                      <Text
                        style={{
                          fontFamily: TYPOGRAPHY.family.sansLight,
                          color: COLORS.creamDim,
                          fontSize: 12,
                          lineHeight: 18,
                        }}
                      >
                        {e.claim}
                      </Text>
                      <Text
                        style={{
                          fontFamily: TYPOGRAPHY.family.sans,
                          color: COLORS.goldDim,
                          fontSize: 10,
                          marginTop: 2,
                        }}
                      >
                        {e.citation.authors} ({e.citation.year})
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sansLight,
            color: COLORS.goldDim,
            fontSize: 10,
            lineHeight: 16,
            textAlign: 'center',
            marginTop: 28,
            opacity: 0.8,
            paddingHorizontal: 12,
          }}
        >
          RITE does not provide medical advice. The protocols described are
          intended for general wellbeing and performance, not the diagnosis or
          treatment of any condition.
        </Text>
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <GoldButton label="Return" variant="ghost" onPress={() => router.replace('/')} />
      </View>

      <CitationSheet evidence={open} onClose={() => setOpen(null)} />
    </Animated.View>
  );
}
