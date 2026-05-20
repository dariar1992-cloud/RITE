import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ANIMATION, COLORS } from '@/constants/design';

interface Props {
  active: boolean;
}

const BAR_COUNT = 7;
const MIN_H = 4;
const MAX_H = 26;

function Bar({ active }: { active: boolean }) {
  const h = useSharedValue(MIN_H);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      h.value = withTiming(MIN_H, { duration: 200 });
      return;
    }
    intervalRef.current = setInterval(() => {
      const next = MIN_H + Math.random() * (MAX_H - MIN_H);
      h.value = withTiming(next, { duration: ANIMATION.waveformIntervalMs });
    }, ANIMATION.waveformIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, h]);

  const style = useAnimatedStyle(() => ({ height: h.value }));

  return (
    <Animated.View
      style={[
        {
          width: 2,
          backgroundColor: active ? COLORS.gold : COLORS.goldDim,
          borderRadius: 1,
        },
        style,
      ]}
    />
  );
}

export function Waveform({ active }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        height: MAX_H,
      }}
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <Bar key={i} active={active} />
      ))}
    </View>
  );
}
