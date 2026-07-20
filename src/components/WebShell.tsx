import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

function getPath(): string {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return '';
  return window.location.pathname || '/';
}

/** Admin / volunteer / in-app routes use the app shell. Marketing & welcome use the same app navigator. */
function isPortalRoute(): boolean {
  const path = getPath();
  return path.includes('/admin') || path.includes('/volunteer') || path.includes('/app');
}

export function WebShell({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={isPortalRoute() ? styles.portalRoot : styles.siteRoot}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  portalRoot: { flex: 1, minHeight: '100vh' as any, backgroundColor: '#FFFFFF' },
  siteRoot: { flex: 1, minHeight: '100vh' as any, backgroundColor: '#FFFFFF', width: '100%' },
});
