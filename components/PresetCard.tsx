import { Pressable, Text, View } from 'react-native';

import { COLORS, TYPOGRAPHY } from '@/constants/design';
import type { SessionPreset } from '@/data/presets';

interface Props {
  preset: SessionPreset;
  onPress: () => void;
  accent?: string;
}

export function PresetCard({ preset, onPress, accent = COLORS.gold }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 220,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(122,104,40,0.4)',
        backgroundColor: COLORS.surface,
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: accent,
            fontSize: 20,
          }}
        >
          {preset.symbol}
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 9,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          {preset.recommendedDurationMinutes} min
        </Text>
      </View>

      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serif,
          color: COLORS.cream,
          fontSize: 16,
          lineHeight: 20,
        }}
      >
        {preset.title}
      </Text>

      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sansLight,
          color: COLORS.creamDim,
          fontSize: 11,
          lineHeight: 16,
        }}
      >
        {preset.tagline}
      </Text>
    </Pressable>
  );
}
