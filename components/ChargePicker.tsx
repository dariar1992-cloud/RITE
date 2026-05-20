import { Pressable, Text, View } from 'react-native';

import { COLORS, TYPOGRAPHY } from '@/constants/design';

interface Props {
  value: number | null;
  onChange: (n: number) => void;
  label?: string;
}

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function ChargePicker({ value, onChange, label }: Props) {
  return (
    <View>
      {label ? (
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 10,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          {label}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>
        {STEPS.map((n) => {
          const filled = value != null && n <= value;
          const exact = value === n;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: exact
                  ? COLORS.gold
                  : filled
                    ? COLORS.goldDim
                    : 'rgba(122,104,40,0.35)',
                backgroundColor: filled ? COLORS.goldDim : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.family.sans,
                  color: exact ? COLORS.obsidian : filled ? COLORS.cream : COLORS.goldDim,
                  fontSize: 11,
                }}
              >
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
          paddingHorizontal: 2,
        }}
      >
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 9,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          Empty
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 9,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          Charged
        </Text>
      </View>
    </View>
  );
}
