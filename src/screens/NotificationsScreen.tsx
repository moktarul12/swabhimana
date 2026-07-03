import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, Notification, formatNotifTime } from '../services/database';
import { useAuth } from '../context/AuthContext';

function getNotifIcon(type: string): { icon: keyof typeof Ionicons.glyphMap; color: string } {
  switch (type) {
    case 'completed': return { icon: 'checkmark-circle', color: COLORS.primary };
    case 'pickup': return { icon: 'car', color: COLORS.collected };
    case 'accepted': return { icon: 'checkmark', color: COLORS.primary };
    default: return { icon: 'cube', color: COLORS.textMedium };
  }
}

export default function NotificationsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await db.getNotifications(user.id);
    setNotifications(data);
    setRefreshing(false);
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleMarkAllRead = async () => {
    if (!user) return;
    await db.markAllNotificationsRead(user.id);
    load();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" onBack={() => navigation.goBack()} />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        renderItem={({ item }) => {
          const { icon, color } = getNotifIcon(item.type);
          return (
            <View style={[styles.notifCard, !item.read && styles.notifUnread]}>
              <View style={[styles.notifIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>{formatNotifTime(item.created_at)}</Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  list: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  notifCard: { flexDirection: 'row', padding: SPACING.lg, marginBottom: SPACING.sm, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.backgroundGray, gap: SPACING.md },
  notifUnread: { backgroundColor: COLORS.primaryPale },
  notifIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  notifBody: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2, lineHeight: 18 },
  notifTime: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, marginTop: SPACING.xs },
  markAllBtn: { alignItems: 'center', paddingVertical: SPACING.lg },
  markAllText: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: '600' },
});
