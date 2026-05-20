import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { COLORS, TYPOGRAPHY } from '@/constants/design';

interface Props {
  quote: string;
  onDone: () => void;
  durationMs?: number;
}

export function WisdomTransition({ quote, onDone, durationMs = 1500 }: Props) {
  useEffect(() => {
    const id = setTimeout(onDone, durationMs);
    return () => clearTimeout(id);
  }, [onDone, durationMs]);

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.obsidian,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        zIndex: 10,
      }}
    >
      <View style={{ alignItems: 'center', gap: 18 }}>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 9,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          —
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serifItalic,
            color: COLORS.cream,
            fontSize: 22,
            lineHeight: 30,
            textAlign: 'center',
          }}
        >
          {quote}
        </Text>
      </View>
    </Animated.View>
  );
}
