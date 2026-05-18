import { Text } from 'react-native';

import { COLORS, TYPOGRAPHY } from '@/constants/design';

export function Brand() {
  return (
    <Text
      style={{
        fontFamily: TYPOGRAPHY.family.serif,
        color: COLORS.gold,
        fontSize: TYPOGRAPHY.size.brand,
        letterSpacing: TYPOGRAPHY.letterSpacing.capsLg * TYPOGRAPHY.size.brand,
        textTransform: 'uppercase',
      }}
    >
      R I T E
    </Text>
  );
}
