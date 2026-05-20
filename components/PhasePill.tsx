import { Text, View } from 'react-native';

import { COLORS, TYPOGRAPHY } from '@/constants/design';
import { PHASES, type CyclePhase } from '@/data/cycle';

interface Props {
  phase: CyclePhase;
  cycleDay?: number;
  compact?: boolean;
}

export function PhasePill({ phase, cycleDay, compact }: Props) {
  const info = PHASES[phase];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: compact ? 4 : 6,
        paddingHorizontal: compact ? 10 : 14,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: info.accent,
        backgroundColor: 'rgba(26,26,36,0.7)',
        alignSelf: 'flex-start',
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: info.accent,
        }}
      />
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sans,
          color: COLORS.cream,
          fontSize: compact ? 9 : 10,
          letterSpacing: compact ? 1.6 : 2,
          textTransform: 'uppercase',
        }}
      >
        {info.label}
        {cycleDay != null ? ` · Day ${cycleDay}` : ''}
      </Text>
    </View>
  );
}
