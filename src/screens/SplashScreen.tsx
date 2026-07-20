import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from '../components/AppLogo';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { APP_NAME, APP_TAGLINE } from '../constants/branding';
import { LOCAL_IMAGES } from '../constants/images';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, isGuest, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    const delay = Platform.OS === 'web' ? 400 : 2500;
    const timer = setTimeout(() => {
      // Web landing is always Welcome; native app can open Main when signed in / guest
      if (Platform.OS === 'web') navigation.replace('Welcome');
      else if (user || isGuest) navigation.replace('Main');
      else navigation.replace('Welcome');
    }, delay);
    return () => clearTimeout(timer);
  }, [isLoading, user, isGuest, navigation]);

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, { paddingTop: insets.top + SPACING.xxxl }]}>
        <AppLogo size="lg" />
        <Text style={styles.tagline}>
          {APP_TAGLINE}.{'\n'}Every act of kindness changes a life.
        </Text>
        <View style={styles.poweredBy}>
          <Text style={styles.poweredText}>Powered by</Text>
          <Text style={styles.brandText}>{APP_NAME}</Text>
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
  brandText: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.xs },
  bottomImage: { width: '100%', height: 220, resizeMode: 'cover' },
});
