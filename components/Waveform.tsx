import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ANIMATION, COLORS } from '@/constants/design';

interface Props {
  active: boolean;
}

const BAR_COUNT = 7;
const MIN_H = 4;
const MAX_H = 26;

function randomBars(): number[] {
  return Array.from(
    { length: BAR_COUNT },
    () => MIN_H + Math.random() * (MAX_H - MIN_H)
  );
}

export function Waveform({ active }: Props) {
  const [bars, setBars] = useState<number[]>(() =>
    Array(BAR_COUNT).fill(MIN_H)
  );

  useEffect(() => {
    if (!active) {
      setBars(Array(BAR_COUNT).fill(MIN_H));
      return;
    }
    setBars(randomBars());
    const id = setInterval(() => setBars(randomBars()), ANIMATION.waveformIntervalMs);
    return () => clearInterval(id);
  }, [active]);

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
      {bars.map((h, i) => (
        <View
          key={i}
          style={{
            width: 2,
            height: h,
            backgroundColor: active ? COLORS.gold : COLORS.goldDim,
            borderRadius: 1,
          }}
        />
      ))}
    </View>
  );
}
