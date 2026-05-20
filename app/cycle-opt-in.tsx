import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AmbientOrb } from '@/components/AmbientOrb';
import { Brand } from '@/components/Brand';
import { GoldButton } from '@/components/GoldButton';
import { ANIMATION, COLORS, TYPOGRAPHY } from '@/constants/design';

export default function CycleOptInScreen() {
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATION.fadeDurationMs)}
      style={{ flex: 1, backgroundColor: COLORS.obsidian }}
    >
      <AmbientOrb color={COLORS.gold} size={360} position={{ top: -180 }} opacity={0.25} />
      <AmbientOrb color="#B85C5C" size={300} position={{ bottom: -120, right: -80 }} opacity={0.6} />

      <ScrollView
        contentContainerStyle={{
          padding: 28,
          paddingTop: 72,
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
            One more protocol
          </Text>
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serif,
            color: COLORS.cream,
            fontSize: 28,
            textAlign: 'center',
            marginBottom: 12,
            lineHeight: 34,
          }}
        >
          Cycle Protocol
        </Text>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.serifItalic,
            color: COLORS.creamDim,
            fontSize: 15,
            textAlign: 'center',
            paddingHorizontal: 12,
            marginBottom: 24,
            lineHeight: 23,
          }}
        >
          The body operates on more than one clock. If you menstruate, RITE
          can adapt your recovery to the four hormonal phases of your monthly
          rhythm — same protocol, sharper precision.
        </Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: COLORS.goldDim,
            backgroundColor: COLORS.surface,
            borderRadius: 14,
            padding: 18,
            gap: 10,
            marginBottom: 28,
          }}
        >
          {[
            ['Menstrual', 'Recovery dominant. We slow down.'],
            ['Follicular', 'Estrogen rising. We sharpen focus.'],
            ['Ovulatory', 'Peak energy. We work in bursts.'],
            ['Luteal', 'Energy descending. We honor it.'],
          ].map(([phase, body]) => (
            <View key={phase} style={{ flexDirection: 'row', gap: 12 }}>
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.family.sans,
                  color: COLORS.gold,
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  width: 84,
                }}
              >
                {phase}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontFamily: TYPOGRAPHY.family.sansLight,
                  color: COLORS.creamDim,
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {body}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sans,
            color: COLORS.goldDim,
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: 18,
            lineHeight: 16,
          }}
        >
          Opt-in. Skip if not relevant — the protocol still works.
        </Text>

        <View style={{ gap: 10 }}>
          <GoldButton
            label="Set up cycle protocol"
            onPress={() => router.replace('/cycle-setup')}
          />
          <GoldButton
            label="Skip — enter RITE"
            variant="ghost"
            onPress={() => router.replace('/')}
          />
        </View>

        <Text
          style={{
            fontFamily: TYPOGRAPHY.family.sansLight,
            color: COLORS.goldDim,
            fontSize: 10,
            textAlign: 'center',
            marginTop: 18,
            lineHeight: 16,
            opacity: 0.7,
          }}
        >
          Data stays on this device.{'\n'}You can enable or disable this anytime in settings.
        </Text>
      </ScrollView>
    </Animated.View>
  );
}
