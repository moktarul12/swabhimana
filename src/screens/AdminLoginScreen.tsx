import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { ADMIN_USER, APP_NAME } from '../constants/branding';
import { db } from '../services/database';
import { useIsDesktop } from '../hooks/useIsDesktop';

export default function AdminLoginScreen({ navigation }: any) {
  const isDesktop = useIsDesktop();
  const [email, setEmail] = useState(ADMIN_USER.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const admin = await db.adminLogin(email, password);
      navigation.replace('AdminDashboard', { admin });
    } catch {
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  if (!isDesktop) {
    return (
      <View style={styles.blocked}>
        <Ionicons name="laptop-outline" size={64} color={COLORS.primary} />
        <Text style={styles.blockedTitle}>Desktop Only</Text>
        <Text style={styles.blockedText}>
          The admin panel is only available on laptop or desktop browsers. Please open this URL on a computer.
        </Text>
        <Text style={styles.blockedUrl}>/admin</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0D3B12', '#1B5E20', '#2E7D32']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <Ionicons name="shield-checkmark" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>{APP_NAME} Admin</Text>
          <Text style={styles.subtitle}>Manage donation requests & volunteers</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={COLORS.textLight}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter admin password"
            placeholderTextColor={COLORS.textLight}
          />

          <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} fullWidth size="lg" disabled={loading || !password} />

          <Text style={styles.hint}>Demo: {ADMIN_USER.email} / {ADMIN_USER.password}</Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  card: {
    width: '100%', maxWidth: 420, backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl, padding: SPACING.xxl, ...SHADOWS.large,
  },
  logoWrap: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryLighter,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: SPACING.lg,
  },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.textDark, textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', marginTop: SPACING.xs, marginBottom: SPACING.xl },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textDark, marginBottom: SPACING.xs },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.textDark, marginBottom: SPACING.md,
  },
  error: { color: COLORS.error, fontSize: FONT_SIZE.sm, marginBottom: SPACING.md, textAlign: 'center' },
  hint: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, textAlign: 'center', marginTop: SPACING.lg },
  blocked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl, backgroundColor: COLORS.white },
  blockedTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.textDark, marginTop: SPACING.lg },
  blockedText: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', marginTop: SPACING.md, lineHeight: 22 },
  blockedUrl: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.lg },
});
