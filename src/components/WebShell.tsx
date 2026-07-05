import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { DesktopSite } from './DesktopSite';

const LAPTOP_MIN = 1024;

function getPath(): string {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return '';
  return window.location.pathname;
}

function isPortalRoute(): boolean {
  const path = getPath();
  return path.includes('/admin') || path.includes('/volunteer') || path.includes('/app');
}

export function WebShell({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') return <>{children}</>;

  if (isPortalRoute()) {
    return <View style={styles.portalRoot}>{children}</View>;
  }

  const isLaptop = width >= LAPTOP_MIN;

  if (isLaptop) {
    return <DesktopSite />;
  }

  return <View style={styles.mobileWebRoot}>{children}</View>;
}

const styles = StyleSheet.create({
  portalRoot: { flex: 1, minHeight: '100vh' as any, backgroundColor: '#FFFFFF' },
  mobileWebRoot: { flex: 1, minHeight: '100vh' as any, backgroundColor: '#FFFFFF', width: '100%' },
});
