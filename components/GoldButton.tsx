import { Pressable, Text, View, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';

interface Props extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
}

export function GoldButton({
  label,
  variant = 'primary',
  fullWidth = true,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isGhost = variant === 'ghost';

  return (
    <Animated.View
      style={[animatedStyle, fullWidth ? { width: '100%' } : null]}
    >
      <Pressable
        {...rest}
        disabled={disabled}
        onPressIn={(e) => {
          scale.value = withTiming(ANIMATION.pressScale, { duration: 80 });
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withTiming(1, { duration: 120 });
          onPressOut?.(e);
        }}
      >
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: isGhost ? COLORS.goldDim : COLORS.gold,
            backgroundColor: isGhost ? 'transparent' : COLORS.gold,
            alignItems: 'center',
            opacity: disabled ? 0.4 : 1,
          }}
        >
          <Text
            style={{
              color: isGhost ? COLORS.gold : COLORS.obsidian,
              fontFamily: TYPOGRAPHY.family.sansMedium,
              fontSize: 13,
              letterSpacing: TYPOGRAPHY.letterSpacing.caps * 13,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
