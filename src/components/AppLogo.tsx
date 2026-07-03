import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { LOCAL_IMAGES } from '../constants/images';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  color?: string;
  direction?: 'column' | 'row';
}

export function AppLogo({ size = 'md', showText = true, color = COLORS.primary, direction = 'column' }: AppLogoProps) {
  const markSize = size === 'sm' ? 32 : size === 'lg' ? 88 : 56;
  const fontSize = size === 'sm' ? FONT_SIZE.lg : size === 'lg' ? FONT_SIZE.xxxl : FONT_SIZE.xxl;
  const isRow = direction === 'row';

  return (
    <View style={[styles.wrap, isRow && styles.wrapRow]}>
      <Image source={LOCAL_IMAGES.logoMark} style={{ width: markSize, height: markSize }} resizeMode="contain" />
      {showText && (
        <Text style={[styles.text, { fontSize, color }, isRow ? styles.textRow : styles.textColumn]}>ShareHope</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  wrapRow: {
    flexDirection: 'row',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textColumn: {
    marginTop: SPACING.sm,
  },
  textRow: {
    marginLeft: SPACING.sm,
  },
});
