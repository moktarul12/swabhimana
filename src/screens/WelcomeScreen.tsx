import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from '../components/AppLogo';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { LOCAL_IMAGES } from '../constants/images';
import { APP_NAME, APP_TAGLINE, MOTTO } from '../constants/branding';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const goToMain = (screen?: string) => {
    if (user) navigation.replace('Main', screen ? { screen } : undefined);
    else navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.lg, paddingBottom: insets.bottom + SPACING.lg }]}>
      <AppLogo size="md" />

      <View style={styles.illustrationWrap}>
        <Image source={LOCAL_IMAGES.onboardingDonation} style={styles.illustration} />
      </View>

      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{APP_TAGLINE}</Text>
        <Text style={styles.subtitle}>{MOTTO}</Text>
      </View>

      <View style={styles.footer}>
        <Button title="Donate Now" onPress={() => goToMain('DonateTab')} fullWidth size="lg" />
        <Button title="Explore" onPress={() => goToMain('HomeTab')} variant="outline" fullWidth size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: SPACING.xxl },
  illustrationWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration: { width: 280, height: 220, borderRadius: 16, resizeMode: 'cover' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.primary, width: 24 },
  content: { paddingBottom: SPACING.xxl },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: '700', color: COLORS.textDark, textAlign: 'center', marginBottom: SPACING.md },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', lineHeight: 22 },
  footer: { gap: SPACING.md },
});
