import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { GoldButton } from '@/components/GoldButton';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import {
  DEFAULT_CYCLE_LENGTH,
  DEFAULT_PERIOD_LENGTH,
  MAX_CYCLE_LENGTH,
  MAX_PERIOD_LENGTH,
  MIN_CYCLE_LENGTH,
  MIN_PERIOD_LENGTH,
  formatLocalDate,
} from '@/data/cycle';
import { useRiteStore } from '@/store/useRiteStore';

const DAYS_AGO_RECENT = [0, 1, 2, 3, 4, 5, 6, 7];
const DAYS_AGO_WEEKS = [10, 14, 17, 21, 24, 28, 35, 42];

function labelForDaysAgo(n: number): string {
  if (n === 0) return 'Today';
  if (n === 1) return 'Yesterday';
  if (n < 7) return `${n}d ago`;
  if (n === 7) return '1 week';
  if (n % 7 === 0) return `${n / 7} weeks`;
  return `${n}d ago`;
}

function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: COLORS.goldDim,
        borderRadius: 12,
        padding: 16,
        gap: 10,
      }}
    >
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sans,
          color: COLORS.goldDim,
          fontSize: 9,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.goldDim,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: value <= min ? 0.4 : 1,
          }}
        >
          <Text
            style={{
              color: COLORS.gold,
              fontSize: 22,
              fontFamily: TYPOGRAPHY.family.serif,
            }}
          >
            −
          </Text>
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serif,
              color: COLORS.cream,
              fontSize: 36,
              lineHeight: 40,
            }}
          >
            {value}
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            days
          </Text>
        </View>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.goldDim,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: value >= max ? 0.4 : 1,
          }}
        >
          <Text
            style={{
              color: COLORS.gold,
              fontSize: 22,
              fontFamily: TYPOGRAPHY.family.serif,
            }}
          >
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CycleSetupScreen() {
  const router = useRouter();
  const enableCycleTracking = useRiteStore((s) => s.enableCycleTracking);

  const [daysAgo, setDaysAgo] = useState<number | null>(null);
  const [cycleLen, setCycleLen] = useState(DEFAULT_CYCLE_LENGTH);
  const [periodLen, setPeriodLen] = useState(DEFAULT_PERIOD_LENGTH);

  const startDate = useMemo(() => {
    if (daysAgo == null) return null;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return formatLocalDate(d);
  }, [daysAgo]);

  const onSave = () => {
    if (!startDate) return;
    enableCycleTracking({
      lastPeriodStart: startDate,
      cycleLengthDays: cycleLen,
      periodLengthDays: periodLen,
    });
    router.replace('/cycle');
  };

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <AmbientOrb color="#B85C5C" size={360} position={{ top: -180 }} opacity={0.25} />

      <ScrollView
        contentContainerStyle={{
          padding: 28,
          paddingTop: 64,
          paddingBottom: 48,
          minHeight: '100%',
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <Brand />
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.gold,
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginTop: 12,
            }}
          >
            Cycle Protocol
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.creamDim,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 12,
              lineHeight: 21,
              paddingHorizontal: 8,
            }}
          >
            RITE will adapt your protocol to the four phases of your monthly
            rhythm. Your data lives on this device.
          </Text>
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.cream,
            fontSize: 20,
            marginBottom: 10,
            textAlign: 'center',
          }}
        >
          When did your last period start?
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sansLight,
            color: COLORS.creamDim,
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          Approximate is fine. You can refine later.
        </Text>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 9,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Recent
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 18,
          }}
        >
          {DAYS_AGO_RECENT.map((n) => {
            const selected = daysAgo === n;
            return (
              <Pressable
                key={n}
                onPress={() => setDaysAgo(n)}
                style={{
                  paddingVertical: 9,
                  paddingHorizontal: 13,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: selected ? COLORS.gold : COLORS.goldDim,
                  backgroundColor: selected ? COLORS.surface : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sans,
                    color: selected ? COLORS.cream : COLORS.creamDim,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {labelForDaysAgo(n)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 9,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Further back
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {DAYS_AGO_WEEKS.map((n) => {
            const selected = daysAgo === n;
            return (
              <Pressable
                key={n}
                onPress={() => setDaysAgo(n)}
                style={{
                  paddingVertical: 9,
                  paddingHorizontal: 13,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: selected ? COLORS.gold : COLORS.goldDim,
                  backgroundColor: selected ? COLORS.surface : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sans,
                    color: selected ? COLORS.cream : COLORS.creamDim,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {labelForDaysAgo(n)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {startDate ? (
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.gold,
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 28,
            }}
          >
            Started {new Date(startDate).toLocaleDateString([], {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        ) : (
          <View style={{ marginBottom: 28 }} />
        )}

        <View style={{ gap: 14, marginBottom: 28 }}>
          <NumberStepper
            label="Average cycle length"
            value={cycleLen}
            min={MIN_CYCLE_LENGTH}
            max={MAX_CYCLE_LENGTH}
            onChange={setCycleLen}
          />
          <NumberStepper
            label="Average period length"
            value={periodLen}
            min={MIN_PERIOD_LENGTH}
            max={MAX_PERIOD_LENGTH}
            onChange={setPeriodLen}
          />
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sansLight,
            color: COLORS.goldDim,
            fontSize: 11,
            lineHeight: 17,
            textAlign: 'center',
            marginBottom: 18,
            opacity: 0.75,
          }}
        >
          You can refine these as you log more periods.
        </Text>

        <GoldButton label="Lock in cycle protocol" disabled={daysAgo == null} onPress={onSave} />

        <Pressable onPress={() => router.replace('/')} style={{ marginTop: 18, alignSelf: 'center' }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Skip for now
          </Text>
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
}
