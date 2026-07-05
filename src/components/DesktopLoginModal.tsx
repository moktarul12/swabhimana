import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { DEMO_USER, ADMIN_USER, VOLUNTEER_USER } from '../constants/branding';
import { useAuth } from '../context/AuthContext';
import { db, saveVolunteerSession, saveAdminSession } from '../services/database';

type LoginTab = 'donor' | 'volunteer' | 'admin';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialTab?: LoginTab;
};

function go(path: string) {
  if (typeof window !== 'undefined') window.location.href = path;
}

export function DesktopLoginModal({ visible, onClose, initialTab = 'donor' }: Props) {
  const { login } = useAuth();
  const [tab, setTab] = useState<LoginTab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = (nextTab: LoginTab) => {
    setTab(nextTab);
    setError('');
    setPassword('');
    if (nextTab === 'donor') setEmail(DEMO_USER.email);
    else if (nextTab === 'volunteer') setEmail(VOLUNTEER_USER.email);
    else setEmail(ADMIN_USER.email);
  };

  React.useEffect(() => {
    if (visible) resetForm(initialTab);
  }, [visible, initialTab]);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (tab === 'donor') {
        await login(email, password);
        onClose();
        go('/app');
      } else if (tab === 'volunteer') {
        const vol = await db.volunteerLogin(email, password);
        await saveVolunteerSession(vol.id);
        onClose();
        go('/volunteer/dashboard');
      } else {
        const admin = await db.adminLogin(email, password);
        await saveAdminSession(admin.id);
        onClose();
        go('/admin/dashboard');
      }
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hint = tab === 'donor'
    ? `Demo: ${DEMO_USER.email} / ${DEMO_USER.password}`
    : tab === 'volunteer'
      ? `Demo: ${VOLUNTEER_USER.email} / ${VOLUNTEER_USER.password}`
      : `Demo: ${ADMIN_USER.email} / ${ADMIN_USER.password}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={COLORS.textMedium} />
          </TouchableOpacity>

          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Choose your role to continue</Text>

          <View style={styles.tabs}>
            {([
              { key: 'donor' as const, label: 'Donor', icon: 'heart-outline' as const },
              { key: 'volunteer' as const, label: 'Volunteer', icon: 'people-outline' as const },
              { key: 'admin' as const, label: 'Admin', icon: 'shield-outline' as const },
            ]).map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, tab === t.key && styles.tabActive]}
                onPress={() => resetForm(t.key)}
              >
                <Ionicons name={t.icon} size={16} color={tab === t.key ? COLORS.white : COLORS.textMedium} />
                <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

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
            placeholder="Enter password"
            placeholderTextColor={COLORS.textLight}
            onSubmitEditing={handleSubmit}
          />

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading || !password}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={18} color={COLORS.white} />
                <Text style={styles.submitText}>
                  {tab === 'donor' ? 'Login to App' : tab === 'volunteer' ? 'Volunteer Portal' : 'Admin Portal'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>{hint}</Text>
          {tab === 'volunteer' && (
            <Text style={styles.note}>New volunteers are added by admin from the Admin dashboard.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
    padding: SPACING.xl,
  },
  card: {
    width: '100%', maxWidth: 440, backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xxl, padding: SPACING.xxl, ...SHADOWS.large,
  },
  closeBtn: { position: 'absolute', top: SPACING.lg, right: SPACING.lg, zIndex: 1 },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.textDark, textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', marginTop: 4, marginBottom: SPACING.lg },
  tabs: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primaryPale, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textMedium },
  tabTextActive: { color: COLORS.white },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textDark, marginBottom: SPACING.xs },
  input: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.textDark, marginBottom: SPACING.md,
  },
  error: { color: COLORS.error, fontSize: FONT_SIZE.sm, marginBottom: SPACING.md, textAlign: 'center' },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.round,
    marginTop: SPACING.sm,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.white },
  hint: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, textAlign: 'center', marginTop: SPACING.lg },
  note: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium, textAlign: 'center', marginTop: SPACING.sm, fontStyle: 'italic' },
});
