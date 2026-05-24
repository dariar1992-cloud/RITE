import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

function safe(fn: () => Promise<unknown>) {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
}

export const haptics = {
  select: () => safe(() => Haptics.selectionAsync()),
  light: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  medium: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
