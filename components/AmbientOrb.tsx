import { LinearGradient } from 'expo-linear-gradient';
import { Platform, View, type ViewStyle } from 'react-native';

interface Props {
  size?: number;
  color: string;
  position?: ViewStyle;
  opacity?: number;
}

export function AmbientOrb({
  size = 320,
  color,
  position = { top: -120 },
  opacity = 0.55,
}: Props) {
  const webBlur =
    Platform.OS === 'web'
      ? ({ filter: 'blur(60px)' } as unknown as ViewStyle)
      : null;

  return (
    <View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
        },
        position,
        webBlur,
      ]}
    >
      <LinearGradient
        colors={[color, 'transparent']}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
}
