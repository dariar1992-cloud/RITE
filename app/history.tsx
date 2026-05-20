import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { GoldButton } from '@/components/GoldButton';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';
import { MODE_LABELS } from '@/data/sessions';
import { useRiteStore, type SessionRecord } from '@/store/useRiteStore';

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dStart = new Date(d);
  dStart.setHours(0, 0, 0, 0);

  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (dStart.getTime() === today.getTime()) return `Today · ${time}`;
  if (dStart.getTime() === yesterday.getTime()) return `Yesterday · ${time}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${time}`;
}

function Row({ record }: { record: SessionRecord }) {
  const deltaText =
    record.delta == null
      ? null
      : record.delta > 0
        ? `+${record.delta}`
        : `${record.delta}`;
  const deltaColor =
    record.delta == null
      ? COLORS.goldDim
      : record.delta > 0
        ? '#7AD27A'
        : record.delta < 0
          ? '#c97a7a'
          : COLORS.creamDim;
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(122,104,40,0.25)',
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View
        style={{
          width: 4,
          height: 36,
          borderRadius: 2,
          backgroundColor:
            record.mode === 'stolen' ? COLORS.gold : COLORS.indigoAccent.replace(/0\.08/, '0.7'),
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.cream,
            fontSize: 15,
          }}
        >
          {MODE_LABELS[record.mode].title}
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginTop: 2,
          }}
        >
          {formatWhen(record.completedAt)} · {record.durationMinutes}m · {record.state}
        </Text>
      </View>

      {deltaText ? (
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: deltaColor,
            fontSize: 18,
            minWidth: 44,
            textAlign: 'right',
          }}
        >
          {deltaText}
        </Text>
      ) : (
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            minWidth: 44,
            textAlign: 'right',
          }}
        >
          No Δ
        </Text>
      )}
    </View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const history = useRiteStore((s) => s.history);
  const totalSessions = useRiteStore((s) => s.totalSessions);

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <AmbientOrb color={COLORS.gold} size={400} position={{ top: -200 }} opacity={0.25} />

      <ScrollView contentContainerStyle={{ padding: 28, paddingTop: 60, paddingBottom: 40 }}>
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
            History
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.creamDim,
              fontSize: 13,
              marginTop: 6,
            }}
          >
            Last 30 rites · {totalSessions} lifetime
          </Text>
        </View>

        {history.length === 0 ? (
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.creamDim,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            No rites yet. Begin one.
          </Text>
        ) : (
          <View>
            {history.map((r) => (
              <Row key={r.id} record={r} />
            ))}
          </View>
        )}
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
