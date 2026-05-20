import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { COLORS, TYPOGRAPHY } from '@/constants/design';

interface Props {
  score: number;
  label: string;
  size?: number;
  accentColor?: string;
}

export function ReadinessRing({
  score,
  label,
  size = 180,
  accentColor = COLORS.gold,
}: Props) {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const c = 2 * Math.PI * radius;
  const dashOffset = c * (1 - score / 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={COLORS.goldGlow} stopOpacity={1} />
            <Stop offset="1" stopColor={accentColor} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.goldDim}
          strokeOpacity={0.25}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>

      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sans,
          color: COLORS.goldDim,
          fontSize: 9,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        Readiness
      </Text>
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serif,
          color: COLORS.cream,
          fontSize: size * 0.32,
          lineHeight: size * 0.34,
        }}
      >
        {score}
      </Text>
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serifItalic,
          color: accentColor,
          fontSize: 13,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
