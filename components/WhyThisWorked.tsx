import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { COLORS, TYPOGRAPHY } from '@/constants/design';
import { PHASES, type CyclePhase } from '@/data/cycle';
import {
  MODE_LABELS,
  type CheckInState,
  type Mode,
} from '@/data/sessions';
import {
  type Evidence,
} from '@/data/science';

interface Props {
  mode: Mode;
  durationMinutes: number;
  state: CheckInState | null;
  phase: CyclePhase | null;
  charge: number | null;
  citations: Evidence[];
  onOpenCitation: (e: Evidence) => void;
}

export function WhyThisWorked({
  mode,
  durationMinutes,
  state,
  phase,
  charge,
  citations,
  onOpenCitation,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const protocolLine = `${durationMinutes}-minute ${MODE_LABELS[mode].title}${state ? `, calibrated to "${state}"` : ''}${phase ? `, ${PHASES[phase].label} phase` : ''}${charge != null ? `, starting charge ${charge}/10` : ''}.`;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'rgba(122,104,40,0.35)',
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={() => setExpanded((e) => !e)}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.gold,
            fontSize: 10,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
          }}
        >
          Why this worked
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.gold,
            fontSize: 18,
            transform: [{ rotate: expanded ? '90deg' : '0deg' }],
          }}
        >
          ›
        </Text>
      </Pressable>

      {expanded ? (
        <Animated.View
          entering={FadeIn.duration(250)}
          style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}
        >
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.cream,
              fontSize: 14,
              lineHeight: 21,
            }}
          >
            {protocolLine}
          </Text>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: 'rgba(122,104,40,0.2)',
              paddingTop: 12,
              gap: 10,
            }}
          >
            <Text
              style={{
                fontFamily: TYPOGRAPHY.family.sans,
                color: COLORS.goldDim,
                fontSize: 9,
                letterSpacing: 2.5,
                textTransform: 'uppercase',
              }}
            >
              Sources
            </Text>

            {citations.map((c) => (
              <Pressable key={c.id} onPress={() => onOpenCitation(c)}>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sans,
                    color: COLORS.cream,
                    fontSize: 12,
                    lineHeight: 18,
                  }}
                >
                  {c.technique}
                  <Text style={{ color: COLORS.goldDim }}>
                    {'  '}— {c.citation.authors} ({c.citation.year}) ↗
                  </Text>
                </Text>
              </Pressable>
            ))}

            {citations.length === 0 ? (
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.family.sansLight,
                  color: COLORS.creamDim,
                  fontSize: 12,
                  fontStyle: 'italic',
                }}
              >
                Citations for this protocol pattern live in the science library.
              </Text>
            ) : null}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
