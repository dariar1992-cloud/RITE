import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { COLORS, TYPOGRAPHY } from '@/constants/design';

interface Props {
  symbol: string;
  layerLabel: string;
  durationMs?: number;
  onDone: () => void;
}

export function SettlingBeat({ symbol, layerLabel, durationMs = 2000, onDone }: Props) {
  const symbolOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    symbolOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    labelOpacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    ringOpacity.value = withTiming(0.45, { duration: 600 });
    ringScale.value = withRepeat(
      withTiming(1.18, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    const id = setTimeout(() => {
      symbolOpacity.value = withTiming(0, { duration: 400 });
      labelOpacity.value = withTiming(0, { duration: 400 });
      ringOpacity.value = withTiming(0, { duration: 400 });
    }, durationMs - 400);

    const finish = setTimeout(onDone, durationMs);
    return () => {
      clearTimeout(id);
      clearTimeout(finish);
    };
  }, [symbolOpacity, labelOpacity, ringScale, ringOpacity, durationMs, onDone]);

  const symbolStyle = useAnimatedStyle(() => ({ opacity: symbolOpacity.value }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: labelOpacity.value }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <Animated.View
      exiting={FadeOut.duration(400)}
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
      <View style={{ alignItems: 'center', gap: 28 }}>
        <View style={{ width: 140, height: 140, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 1,
                borderColor: COLORS.gold,
              },
              ringStyle,
            ]}
          />
          <Animated.Text
            style={[
              {
                fontFamily: TYPOGRAPHY.family.serif,
                color: COLORS.gold,
                fontSize: 52,
                lineHeight: 60,
              },
              symbolStyle,
            ]}
          >
            {symbol}
          </Animated.Text>
        </View>
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
