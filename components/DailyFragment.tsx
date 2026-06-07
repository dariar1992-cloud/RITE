import { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { COLORS, TYPOGRAPHY } from '@/constants/design';
import { EVIDENCE } from '@/data/science';

// Deterministic day-of-year hash so the fragment stays stable from
// morning through night, only rotating once per local day.
function dayOfYearSeed(d = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

interface Fragment {
  line: string;
  source: string;
}

// Hand-curated lines drawn from the citation library. Lines are kept short
// (≤16 words) and free of marketing language; they read like maxims, not ads.
const FRAGMENTS: readonly Fragment[] = Object.freeze([
  {
    line: 'A long exhale is the lever that releases the brake.',
    source: 'Gerritsen & Band, 2018',
  },
  {
    line: 'Heart rate variability is the body’s admission of how it is doing.',
    source: 'Shaffer & Ginsberg, 2017',
  },
  {
    line: 'Stress disconnects the executive from the executive’s tools.',
    source: 'Arnsten, 2009',
  },
  {
    line: 'Six breaths per minute synchronises the heart and the breath.',
    source: 'Bernardi et al., 2001',
  },
  {
    line: 'One specific intention outperforms a wish, by a measurable margin.',
    source: 'Gollwitzer & Sheeran, 2006',
  },
  {
    line: 'Expert performers work in concentrated blocks, then deliberately stop.',
    source: 'Ericsson et al., 1993',
  },
  {
    line: 'The double-inhale empties what one breath cannot reach.',
    source: 'Balban et al., 2023',
  },
  {
    line: 'Mindfulness measurably lowers cortisol across forty-five trials.',
    source: 'Pascoe et al., 2017',
  },
  {
    line: 'Worry, postponed, loses much of its grip on the body.',
    source: 'Brosschot et al., 2006',
  },
  {
    line: 'Rest is not absence of action. It is the presence of self.',
    source: 'Tantra Shastra',
  },
] as const);

export function DailyFragment() {
  const fragment = useMemo(() => {
    const seed = dayOfYearSeed();
    return FRAGMENTS[seed % FRAGMENTS.length];
  }, []);

  // Sanity: ensure source exists in evidence library when possible (visual cue only)
  const verified = useMemo(
    () =>
      EVIDENCE.some((e) =>
        fragment.source.toLowerCase().includes(e.citation.authors.split(' ')[0].toLowerCase())
      ),
    [fragment]
  );

  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      style={{
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 4,
      }}
    >
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.serifItalic,
          color: COLORS.creamDim,
          fontSize: 13,
          lineHeight: 19,
          textAlign: 'center',
        }}
      >
        {fragment.line}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {verified ? (
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.gold,
              opacity: 0.7,
            }}
          />
        ) : null}
        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 9,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {fragment.source}
        </Text>
      </View>
    </Animated.View>
  );
}
