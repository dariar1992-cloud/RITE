import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { GoldButton } from '@/components/GoldButton';
import { PhasePill } from '@/components/PhasePill';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import { computeCycleState, PHASES } from '@/data/cycle';
import { useRiteStore } from '@/store/useRiteStore';

function Row({
  label,
  value,
  onPress,
  disabled,
  destructive,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  const labelColor = destructive ? '#c97a7a' : COLORS.cream;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(122,104,40,0.2)',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sans,
          color: labelColor,
          fontSize: 14,
        }}
      >
        {label}
      </Text>
      {value ? (
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          {value}
        </Text>
      ) : null}
    </Pressable>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontFamily: TYPOGRAPHY.family.sans,
        color: COLORS.gold,
        fontSize: 9,
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginTop: 24,
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const guideName = useRiteStore((s) => s.selectedGuideName);
  const streak = useRiteStore((s) => s.streakCount);
  const totalSessions = useRiteStore((s) => s.totalSessions);
  const cycle = useRiteStore((s) => s.cycle);
  const disableCycleTracking = useRiteStore((s) => s.disableCycleTracking);

  const cs =
    cycle.enabled && cycle.lastPeriodStart
      ? computeCycleState({
          lastPeriodStart: cycle.lastPeriodStart,
          cycleLengthDays: cycle.cycleLengthDays,
          periodLengthDays: cycle.periodLengthDays,
        })
      : null;

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <AmbientOrb color={COLORS.gold} size={360} position={{ top: -180 }} opacity={0.22} />

      <ScrollView
        contentContainerStyle={{ padding: 28, paddingTop: 60, paddingBottom: 40 }}
      >
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
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
            Settings
          </Text>
        </View>

        <SectionHeader label="Guide" />
        <Row
          label="Voice guide"
          value={guideName ?? '—'}
          onPress={() => router.push('/onboarding')}
        />

        <SectionHeader label="Cycle Protocol" />
        {cs ? (
          <View style={{ paddingVertical: 10 }}>
            <PhasePill phase={cs.phase} cycleDay={cs.cycleDay} />
            <Text
              style={{
                fontFamily: TYPOGRAPHY.family.serifItalic,
                color: COLORS.creamDim,
                fontSize: 13,
                marginTop: 10,
                lineHeight: 19,
              }}
            >
              {PHASES[cs.phase].description}
            </Text>
          </View>
        ) : null}
        <Row
          label={cycle.enabled ? 'Open calendar' : 'Set up cycle protocol'}
          value={cycle.enabled ? `Day ${cs?.cycleDay ?? '—'}` : 'Off'}
          onPress={() => router.push(cycle.enabled ? '/cycle' : '/cycle-setup')}
        />
        <Row
          label="Cycle length"
          value={`${cycle.cycleLengthDays} days`}
          onPress={() => router.push('/cycle-setup')}
          disabled={!cycle.enabled}
        />
        <Row
          label="Period length"
          value={`${cycle.periodLengthDays} days`}
          onPress={() => router.push('/cycle-setup')}
          disabled={!cycle.enabled}
        />
        {cycle.enabled ? (
          <Row
            label="Disable cycle protocol"
            destructive
            onPress={disableCycleTracking}
          />
        ) : null}

        <SectionHeader label="Stats" />
        <Row label="Streak" value={`${streak} day${streak === 1 ? '' : 's'}`} />
        <Row label="Lifetime rites" value={String(totalSessions)} />
        <Row label="History" value="View" onPress={() => router.push('/history')} />

        <SectionHeader label="The Science" />
        <Row
          label="Methodology"
          value="Read"
          onPress={() => router.push('/methodology')}
        />
        <Row
          label="Evidence library"
          value="Browse"
          onPress={() => router.push('/science')}
        />

        <SectionHeader label="Sync" />
        <Row label="Sync across devices" value="Coming soon" disabled />
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sansLight,
            color: COLORS.goldDim,
            fontSize: 11,
            lineHeight: 17,
            marginTop: 10,
            opacity: 0.8,
          }}
        >
          Your data lives on this device only. Cloud sync is a planned future
          feature.
        </Text>
      </ScrollView>

      <View style={{ paddingHorizontal: 28, paddingBottom: 32 }}>
        <GoldButton
          label="Return"
          variant="ghost"
          onPress={() => router.replace('/')}
        />
      </View>
    </Animated.View>
  );
}
