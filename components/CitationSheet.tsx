import { Linking, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { COLORS, TYPOGRAPHY } from '@/constants/design';
import {
  EVIDENCE_LEVEL_COLOR,
  EVIDENCE_LEVEL_LABEL,
  type Evidence,
} from '@/data/science';

interface Props {
  evidence: Evidence | null;
  onClose: () => void;
}

export function CitationSheet({ evidence, onClose }: Props) {
  if (!evidence) return null;
  const levelColor = EVIDENCE_LEVEL_COLOR[evidence.evidenceLevel];

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 100,
      }}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={onClose}
      />
      <Animated.View
        entering={SlideInDown.duration(300)}
        exiting={SlideOutDown.duration(200)}
        style={{
          backgroundColor: COLORS.deepSurface,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          padding: 24,
          paddingBottom: 36,
          borderTopWidth: 1,
          borderTopColor: COLORS.goldDim,
          gap: 14,
        }}
      >
        <View
          style={{
            width: 36,
            height: 3,
            borderRadius: 2,
            backgroundColor: COLORS.goldDim,
            alignSelf: 'center',
            marginBottom: 4,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            alignSelf: 'flex-start',
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: levelColor,
          }}
        >
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 3,
              backgroundColor: levelColor,
            }}
          />
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.cream,
              fontSize: 9,
              letterSpacing: 1.8,
              textTransform: 'uppercase',
            }}
          >
            {EVIDENCE_LEVEL_LABEL[evidence.evidenceLevel]}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.cream,
            fontSize: 22,
            lineHeight: 28,
          }}
        >
          {evidence.technique}
        </Text>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serifItalic,
            color: COLORS.creamDim,
            fontSize: 14,
            lineHeight: 21,
          }}
        >
          {evidence.claim}
        </Text>

        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.gold,
              fontSize: 9,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
            }}
          >
            Mechanism
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sansLight,
              color: COLORS.creamDim,
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {evidence.mechanism}
          </Text>
        </View>

        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.gold,
              fontSize: 9,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
            }}
          >
            Finding
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sansLight,
              color: COLORS.creamDim,
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {evidence.effectSize}
          </Text>
        </View>

        <View
          style={{
            marginTop: 4,
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: 'rgba(122,104,40,0.25)',
            gap: 6,
          }}
        >
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 11,
              lineHeight: 17,
            }}
          >
            {evidence.citation.authors} ({evidence.citation.year}). {evidence.citation.title}.
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.goldDim,
              fontSize: 11,
            }}
          >
            {evidence.citation.journal}.
          </Text>
        </View>

        <Pressable
          onPress={() => Linking.openURL(evidence.citation.doi)}
          style={{
            alignSelf: 'flex-start',
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: COLORS.gold,
          }}
        >
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sansMedium,
              color: COLORS.gold,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Open paper ↗
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
