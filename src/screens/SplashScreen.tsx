import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from '../components/AppLogo';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { LOCAL_IMAGES } from '../constants/images';

export default function SplashScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Welcome'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, { paddingTop: insets.top + SPACING.xxxl }]}>
        <AppLogo size="lg" />
        <Text style={styles.tagline}>
          Donate with Trust.{'\n'}Every Donation Reaches Someone in Need.
        </Text>
        <View style={styles.poweredBy}>
          <Text style={styles.poweredText}>Powered by</Text>
          <Text style={styles.swabhimanText}>Swabhiman</Text>
        </View>
      </View>
      <Image source={LOCAL_IMAGES.splashChildren} style={styles.bottomImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  topSection: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxl },
  tagline: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', lineHeight: 22, marginTop: SPACING.xl },
  poweredBy: { alignItems: 'center', marginTop: SPACING.xxl },
  poweredText: { fontSize: FONT_SIZE.sm, color: COLORS.textLight },
  swabhimanText: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.xs },
  bottomImage: { width: '100%', height: 220, resizeMode: 'cover' },
});
