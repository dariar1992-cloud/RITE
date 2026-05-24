import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { GoldButton } from '@/components/GoldButton';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sans,
          color: COLORS.gold,
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {heading}
      </Text>
      <Text
        style={{
          fontFamily: TYPOGRAPHY.family.sansLight,
          color: COLORS.cream,
          fontSize: 14,
          lineHeight: 22,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

export default function MethodologyScreen() {
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <AmbientOrb color={COLORS.gold} size={360} position={{ top: -180 }} opacity={0.22} />

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 40 }}
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
            Methodology
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.family.serifItalic,
              color: COLORS.creamDim,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 10,
              paddingHorizontal: 12,
              lineHeight: 21,
            }}
          >
            How RITE chooses what to put in front of you, and what it does not claim.
          </Text>
        </View>

        <Section
          heading="The 4-layer protocol"
          body="Every session moves through Body → Energy → Mind → Soul. The structure is derived from Patanjali's 8 Limbs, the Bhagavad Gita, and Tantric philosophy — translated into language that maps onto modern autonomic and cognitive neuroscience. The Body layer engages proprioception. The Energy layer is breathwork. The Mind layer addresses cognitive load. The Soul layer sets a single intention."
        />

        <Section
          heading="Why slow exhalation"
          body="Vagal cardiac efferents are gated by the respiratory cycle — facilitated on exhale, suppressed on inhale (Gerritsen & Band, 2018). RITE's breath instructions emphasise lengthening the exhale relative to the inhale, which reliably increases high-frequency HRV and reduces sympathetic markers across the contemplative practice literature."
        />

        <Section
          heading="Why a single intention"
          body="Implementation intentions — specific if-then plans — produce a medium-to-large effect on goal attainment (d = 0.65) over and above general intention (Gollwitzer & Sheeran, 2006). RITE's Mind and Soul layers reduce intention to one word or one sentence to recruit this effect rather than generic visualisation."
        />

        <Section
          heading="The readiness score"
          body="Readiness combines four signals: time since last completed rite, current streak, time-of-day, and the most recent charge delta you reported. It is a self-report composite — not a clinical measurement. Treat it as a directional cue, not a diagnostic. Future versions will incorporate Apple Watch / Whoop HRV when available."
        />

        <Section
          heading="The charge delta loop"
          body="Before each session you rate your charge 1–10. After, you rate again. The delta feeds back into your readiness over time and gives you a closed loop you can actually test against your own day. This is the same pre/post measurement pattern Whoop uses for recovery, applied to a self-administered protocol."
        />

        <Section
          heading="The cycle protocol — what it does and doesn't claim"
          body="If you opt in, RITE adjusts session emphasis based on your reported cycle phase. The strongest meta-analysis (McNulty et al., 2020) finds group-level differences across phases are trivial but inter-individual variation is large. RITE does not prescribe phase rules — it surfaces a phase-aware recommendation that you can override at any time. Track your own response; the protocol adapts to what you log."
        />

        <Section
          heading="Voice guidance"
          body="Audio is generated on demand by ElevenLabs (eleven_multilingual_v2) and proxied through a server route so the API key never leaves the server. The choice of guide is a one-time pick at onboarding — research on voice familiarity and habit formation suggests fewer guides used repeatedly outperform a rotating library."
        />

        <Section
          heading="Data and privacy"
          body="All of your data — session history, charge ratings, cycle log — lives in encrypted local storage on this device. Nothing is sent to a server except the text-to-speech requests for voice generation, which contain no personal data. Cloud sync across devices is a planned future feature and will be opt-in."
        />

        <Section
          heading="What RITE explicitly does not do"
          body="RITE does not provide medical advice, diagnose conditions, or replace therapy. Some claims in popular wellness writing — particularly the '25% cortisol reduction' figure for body scans — circulate without primary-source support; we cite Pascoe et al. (2017) for the direction without the unsupported magnitude. Where evidence is emerging rather than strong, the science library marks it as such."
        />
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: 32, gap: 10 }}>
        <GoldButton label="Browse the evidence" onPress={() => router.push('/science')} />
        <GoldButton label="Return" variant="ghost" onPress={() => router.replace('/')} />
      </View>
    </Animated.View>
  );
}
