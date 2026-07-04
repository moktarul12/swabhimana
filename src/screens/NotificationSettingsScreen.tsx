import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, NotificationSettings } from '../services/database';
import { useAuth } from '../context/AuthContext';

export default function NotificationSettingsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  useEffect(() => {
    if (user) db.getNotificationSettings(user.id).then(setSettings);
  }, [user]);

  const toggle = async (key: keyof Omit<NotificationSettings, 'user_id'>) => {
    if (!user || !settings) return;
    const updated = { ...settings, [key]: settings[key] ? 0 : 1 };
    setSettings(updated);
    await db.updateNotificationSettings(user.id, { [key]: updated[key] });
  };

  if (!settings) return <View style={styles.container}><ScreenHeader title="Notification Settings" onBack={() => navigation.goBack()} /></View>;

  const items = [
    { key: 'donation_updates' as const, label: 'Donation Updates', desc: 'Get notified about your donation status' },
    { key: 'pickup_alerts' as const, label: 'Pickup Alerts', desc: 'Reminders for scheduled pickups' },
    { key: 'impact_stories' as const, label: 'Impact Stories', desc: 'New stories from the community' },
    { key: 'promotional' as const, label: 'Promotional', desc: 'News and updates from ManavSaathi' },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notification Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {items.map((item) => (
          <View key={item.key} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
            <Switch
              value={!!settings[item.key]}
              onValueChange={() => toggle(item.key)}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={settings[item.key] ? COLORS.primary : COLORS.white}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  rowText: { flex: 1, paddingRight: SPACING.md },
  label: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  desc: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },
});
