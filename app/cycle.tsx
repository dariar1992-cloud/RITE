import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { CalendarGrid } from '@/components/CalendarGrid';
import { GoldButton } from '@/components/GoldButton';
import { PhasePill } from '@/components/PhasePill';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import {
  PHASES,
  computeCycleState,
  formatLocalDate,
} from '@/data/cycle';
import { useRiteStore } from '@/store/useRiteStore';

export default function CycleScreen() {
  const router = useRouter();
  const cycle = useRiteStore((s) => s.cycle);
  const logPeriodStart = useRiteStore((s) => s.logPeriodStart);

  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const monthAnchor = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const state = useMemo(() => {
    if (!cycle.enabled || !cycle.lastPeriodStart) return null;
    return computeCycleState({
      lastPeriodStart: cycle.lastPeriodStart,
      cycleLengthDays: cycle.cycleLengthDays,
      periodLengthDays: cycle.periodLengthDays,
    });
  }, [cycle]);

  if (!cycle.enabled || !cycle.lastPeriodStart || !state) {
    return (
      <Animated.View
        entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
        style={{
          flex: 1,
          backgroundColor: COLORS.obsidian,
          padding: 28,
          paddingTop: 72,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
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
        </View>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serifItalic,
            color: COLORS.creamDim,
            fontSize: 14,
            textAlign: 'center',
            marginVertical: 28,
            lineHeight: 21,
          }}
        >
          The cycle protocol is not active. Set it up to see your monthly
          rhythm reflected here.
        </Text>
        <GoldButton label="Set up cycle protocol" onPress={() => router.push('/cycle-setup')} />
        <View style={{ height: 12 }} />
        <GoldButton label="Return" variant="ghost" onPress={() => router.replace('/')} />
      </Animated.View>
    );
  }

  const phaseInfo = PHASES[state.phase];
  const todayStr = formatLocalDate(new Date());
  const selectedToShow = selected ?? todayStr;

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <AmbientOrb color={phaseInfo.accent} size={420} position={{ top: -200 }} opacity={0.3} />

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
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
        </View>

        <View style={{ alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <PhasePill phase={state.phase} cycleDay={state.cycleDay} />
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.creamDim,
              fontSize: 14,
              textAlign: 'center',
              paddingHorizontal: 12,
              lineHeight: 21,
            }}
          >
            {phaseInfo.description}
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Next period in {state.daysUntilNextPeriod} days · {state.nextPeriodDate}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          <Pressable onPress={() => setMonthOffset(monthOffset - 1)}>
            <Text
              style={{
                fontFamily: TYPOGRAPHY.family.serif,
                color: COLORS.gold,
                fontSize: 22,
              }}
            >
              ‹
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setMonthOffset(0);
              setSelected(null);
            }}
          >
            <Text
              style={{
                fontFamily: TYPOGRAPHY.family.sans,
                color: COLORS.goldDim,
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Today
            </Text>
          </Pressable>
          <Pressable onPress={() => setMonthOffset(monthOffset + 1)}>
            <Text
              style={{
                fontFamily: TYPOGRAPHY.family.serif,
                color: COLORS.gold,
                fontSize: 22,
              }}
            >
              ›
            </Text>
          </Pressable>
        </View>

        <CalendarGrid
          monthAnchor={monthAnchor}
          lastPeriodStart={cycle.lastPeriodStart}
          cycleLengthDays={cycle.cycleLengthDays}
          periodLengthDays={cycle.periodLengthDays}
          periodLog={cycle.periodLog}
          selected={selectedToShow}
          onSelectDate={setSelected}
        />

        <View
          style={{
            marginTop: 18,
            borderTopWidth: 1,
            borderTopColor: 'rgba(122,104,40,0.25)',
            paddingTop: 16,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {(['menstrual', 'follicular', 'ovulatory', 'luteal'] as const).map((p) => (
              <View
                key={p}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: PHASES[p].accent,
                  }}
                />
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sans,
                    color: COLORS.goldDim,
                    fontSize: 9,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {PHASES[p].label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 24, gap: 10 }}>
          <GoldButton
            label="Log period today"
            onPress={() => logPeriodStart(formatLocalDate(new Date()))}
          />
          <GoldButton
            label="Edit setup"
            variant="ghost"
            onPress={() => router.push('/cycle-setup')}
          />
          <GoldButton
            label="Return"
            variant="ghost"
            onPress={() => router.replace('/')}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
}
