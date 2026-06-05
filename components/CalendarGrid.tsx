import { Pressable, Text, View } from 'react-native';

import { COLORS, TYPOGRAPHY } from '@/constants/design';
import {
  PHASES,
  formatLocalDate,
  isFertileDay,
  phaseForCycleDay,
  projectCycleDay,
  type CyclePhase,
} from '@/data/cycle';

interface Props {
  monthAnchor: Date; // any date in the month to render
  lastPeriodStart: string; // YYYY-MM-DD
  cycleLengthDays: number;
  periodLengthDays: number;
  periodLog: readonly string[];
  today?: Date;
  onSelectDate?: (yyyyMmDd: string) => void;
  selected?: string | null;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function diffDaysFromAnchor(anchor: Date, target: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const a = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate()).getTime();
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.round((b - a) / ms);
}

interface CellInfo {
  date: Date;
  yyyyMmDd: string;
  cycleDay: number | null;
  phase: CyclePhase | null;
  isToday: boolean;
  isLoggedPeriodStart: boolean;
  isPredictedPeriod: boolean;
  isFertile: boolean;
  inThisMonth: boolean;
}

export function CalendarGrid({
  monthAnchor,
  lastPeriodStart,
  cycleLengthDays,
  periodLengthDays,
  periodLog,
  today,
  onSelectDate,
  selected,
}: Props) {
  const now = today ?? new Date();
  const monthStart = startOfMonth(monthAnchor);

  // Compute the anchor period (latest period start on/before the first visible day)
  const [py, pm, pd] = lastPeriodStart.split('-').map(Number);
  const lastPeriodDate = new Date(py, pm - 1, pd);

  // Sunday-aligned grid start
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  const cells: CellInfo[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const yyyyMmDd = formatLocalDate(date);

    // Project forward AND backward from lastPeriodDate
    const daysFromLast = diffDaysFromAnchor(lastPeriodDate, date);
    const cycleDay = projectCycleDay(daysFromLast, cycleLengthDays);
    const phase =
      cycleDay != null ? phaseForCycleDay(cycleDay, cycleLengthDays, periodLengthDays) : null;

    cells.push({
      date,
      yyyyMmDd,
      cycleDay,
      phase,
      isToday: formatLocalDate(date) === formatLocalDate(now),
      isLoggedPeriodStart: periodLog.includes(yyyyMmDd),
      isPredictedPeriod:
        phase === 'menstrual' && !periodLog.includes(yyyyMmDd) && daysFromLast > 0,
      isFertile:
        cycleDay != null && isFertileDay(cycleDay, cycleLengthDays) && !periodLog.includes(yyyyMmDd),
      inThisMonth: date.getMonth() === monthStart.getMonth(),
    });
  }

  const monthName = monthStart.toLocaleDateString([], {
    month: 'long',
    year: 'numeric',
  });

  const dow = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View>
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serif,
          color: COLORS.cream,
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 14,
        }}
      >
        {monthName}
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        {dow.map((d, i) => (
          <Text
            key={`${d}-${i}`}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: TYPOGRAPHY.family.sans,
              color: COLORS.goldDim,
              fontSize: 9,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {d}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((c) => {
          const accent =
            c.phase && c.inThisMonth ? PHASES[c.phase].accent : COLORS.goldDim;
          const isSelected = selected === c.yyyyMmDd;
          const dim = !c.inThisMonth;
          return (
            <Pressable
              key={c.yyyyMmDd}
              onPress={() => onSelectDate?.(c.yyyyMmDd)}
              style={{
                width: `${100 / 7}%`,
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
              }}
            >
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                  borderWidth: isSelected || c.isToday ? 1 : 0,
                  borderColor: isSelected ? COLORS.gold : c.isToday ? COLORS.cream : 'transparent',
                  backgroundColor: c.isLoggedPeriodStart
                    ? PHASES.menstrual.accent
                    : c.isPredictedPeriod
                      ? 'rgba(184,92,92,0.2)'
                      : c.isFertile
                        ? 'rgba(201,165,60,0.12)'
                        : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: dim ? 0.25 : 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.family.sans,
                    color: c.isLoggedPeriodStart
                      ? COLORS.obsidian
                      : c.isToday
                        ? COLORS.cream
                        : COLORS.creamDim,
                    fontSize: 12,
                  }}
                >
                  {c.date.getDate()}
                </Text>
                {c.phase && !c.isLoggedPeriodStart ? (
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: accent,
                      marginTop: 2,
                      opacity: c.isPredictedPeriod ? 0.4 : 0.7,
                    }}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
