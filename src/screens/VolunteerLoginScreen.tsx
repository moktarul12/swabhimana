import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { APP_NAME, VOLUNTEER_USER } from '../constants/branding';
import { db, saveVolunteerSession, getVolunteerSession } from '../services/database';
import { useIsDesktop } from '../hooks/useIsDesktop';

export default function VolunteerLoginScreen({ navigation }: any) {
  const isDesktop = useIsDesktop();
  const [email, setEmail] = useState(VOLUNTEER_USER.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const id = await getVolunteerSession();
      if (id) {
        const vol = (await db.getVolunteers()).find(v => v.id === id);
        if (vol) navigation.replace('VolunteerDashboard', { volunteer: vol });
      }
    })();
  }, [navigation]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const volunteer = await db.volunteerLogin(email, password);
      await saveVolunteerSession(volunteer.id);
      navigation.replace('VolunteerDashboard', { volunteer });
    } catch {
      setError('Invalid volunteer credentials');
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
          Volunteer portal is available on laptop or desktop browsers at /volunteer
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0D3B12', '#1B5E20', '#2E7D32']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <Ionicons name="people" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>{APP_NAME} Volunteer</Text>
          <Text style={styles.subtitle}>View assigned pickups & update status</Text>

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
            placeholder="Enter volunteer password"
            placeholderTextColor={COLORS.textLight}
          />

          <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} fullWidth size="lg" disabled={loading || !password} />

          <Text style={styles.hint}>Demo: {VOLUNTEER_USER.email} / {VOLUNTEER_USER.password}</Text>
          <Text style={styles.note}>Ask admin to add you as a volunteer assignee</Text>
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
  note: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium, textAlign: 'center', marginTop: SPACING.sm, fontStyle: 'italic' },
  blocked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl, backgroundColor: COLORS.white },
  blockedTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.textDark, marginTop: SPACING.lg },
  blockedText: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', marginTop: SPACING.md, lineHeight: 22 },
});
