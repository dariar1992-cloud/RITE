import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';

interface Props {
  size?: number;
  symbol?: string;
}

export function BreathingRing({ size = 240, symbol = '◯' }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      50,
      withRepeat(
        withTiming(1.07, {
          duration: ANIMATION.breathRingDurationMs,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, [scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 1,
            borderColor: COLORS.gold,
            opacity: 0.85,
          },
          ringStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: (size * 0.78) / 2,
            borderWidth: 1,
            borderColor: COLORS.goldDim,
            opacity: 0.55,
          },
          ringStyle,
        ]}
      />
      <Text
        style={{
          color: COLORS.gold,
          fontFamily: TYPOGRAPHY.family.serif,
          fontSize: size * 0.22,
        }}
      >
        {symbol}
      </Text>
    </View>
  );
}
