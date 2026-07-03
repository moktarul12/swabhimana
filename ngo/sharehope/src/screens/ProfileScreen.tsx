import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { resolveImage } from '../constants/images';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { icon: 'person-outline' as const, label: 'Personal Information', screen: 'PersonalInfo' },
  { icon: 'location-outline' as const, label: 'My Addresses', screen: 'MyAddresses' },
  { icon: 'time-outline' as const, label: 'My Donations', screen: 'HistoryTab', tab: true },
  { icon: 'notifications-outline' as const, label: 'Notification Settings', screen: 'NotificationSettings' },
  { icon: 'help-circle-outline' as const, label: 'Help & Support', screen: 'HelpSupport' },
  { icon: 'menu-outline' as const, label: 'More', screen: 'More' },
  { icon: 'log-out-outline' as const, label: 'Logout', action: 'logout' },
];

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleMenuPress = (item: typeof MENU_ITEMS[0]) => {
    if (item.action === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]);
    } else if (item.tab) {
      navigation.navigate(item.screen);
    } else {
      navigation.getParent()?.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <View style={styles.userSection}>
          <Image source={resolveImage(user?.avatar || 'avatar-ankit')} style={styles.avatar} />
          <Text style={styles.userName}>{user?.name || 'Ankit Mehta'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'ankit.mehta@email.com'}</Text>
        </View>
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={item.label} style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuItemBorder]} onPress={() => handleMenuPress(item)}>
              <Ionicons name={item.icon} size={22} color={COLORS.primary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark },
  userSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: SPACING.md },
  userName: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark },
  userEmail: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginTop: SPACING.xs },
  menuList: { marginHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderLight, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.lg, paddingHorizontal: SPACING.lg, gap: SPACING.md, backgroundColor: COLORS.white },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '500', color: COLORS.textDark },
});
