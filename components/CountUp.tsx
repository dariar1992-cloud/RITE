import { useEffect, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

interface Props {
  target: number;
  durationMs?: number;
  style?: StyleProp<TextStyle>;
  format?: (n: number) => string;
}

// cubic-out easing
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUp({
  target,
  durationMs = 900,
  style,
  format = (n) => String(Math.round(n)),
}: Props) {
  const [display, setDisplay] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    fromRef.current = display;
    startedAtRef.current = null;

    const tick = (ts: number) => {
      if (startedAtRef.current == null) startedAtRef.current = ts;
      const elapsed = ts - startedAtRef.current;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      const value = fromRef.current + (target - fromRef.current) * eased;
      setDisplay(value);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return <Text style={style}>{format(display)}</Text>;
}
