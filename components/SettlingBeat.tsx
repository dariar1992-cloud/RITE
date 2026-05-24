import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { COLORS, TYPOGRAPHY } from '@/constants/design';

interface Props {
  symbol: string;
  layerLabel: string;
  durationMs?: number;
  onDone: () => void;
}

export function SettlingBeat({ symbol, layerLabel, durationMs = 3000, onDone }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1.04, { duration: durationMs, easing: Easing.inOut(Easing.cubic) });
    const id = setTimeout(onDone, durationMs);
    return () => clearTimeout(id);
  }, [opacity, scale, durationMs, onDone]);

  const symbolStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
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
        zIndex: 50,
      }}
    >
      <View style={{ alignItems: 'center', gap: 24 }}>
        <Animated.Text
          style={[
            {
              fontFamily: TYPOGRAPHY.family.serif,
              color: COLORS.gold,
              fontSize: 64,
            },
            symbolStyle,
          ]}
        >
          {symbol}
        </Animated.Text>
        <Animated.Text
          style={[
            {
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
            },
            labelStyle,
          ]}
        >
          Settling · {layerLabel}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}
