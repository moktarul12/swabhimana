import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { resolveImage } from '../constants/images';
import { useAuth } from '../context/AuthContext';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen?: string;
  tab?: boolean;
  action?: string;
};

const GUEST_MENU: MenuItem[] = [
  { icon: 'heart-outline', label: 'About Us', screen: 'AboutUs' },
  { icon: 'chatbubble-ellipses-outline', label: 'Impact Stories', screen: 'Stories' },
  { icon: 'help-circle-outline', label: 'Help & Support', screen: 'HelpSupport' },
  { icon: 'menu-outline', label: 'More', screen: 'More' },
];

const USER_MENU: MenuItem[] = [
  { icon: 'heart-outline', label: 'About Us', screen: 'AboutUs' },
  { icon: 'person-outline', label: 'Personal Information', screen: 'PersonalInfo' },
  { icon: 'location-outline', label: 'My Addresses', screen: 'MyAddresses' },
  { icon: 'time-outline', label: 'My Donations', screen: 'HistoryTab', tab: true },
  { icon: 'notifications-outline', label: 'Notification Settings', screen: 'NotificationSettings' },
  { icon: 'help-circle-outline', label: 'Help & Support', screen: 'HelpSupport' },
  { icon: 'menu-outline', label: 'More', screen: 'More' },
  { icon: 'log-out-outline', label: 'Logout', action: 'logout' },
];

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, isSignedIn, logout } = useAuth();
  const menu = isSignedIn ? USER_MENU : GUEST_MENU;

  const handleMenuPress = (item: MenuItem) => {
    if (item.action === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]);
    } else if (item.tab && item.screen) {
      navigation.navigate(item.screen);
    } else if (item.screen) {
      navigation.getParent()?.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <Text style={styles.headerTitle}>{isSignedIn ? 'My Profile' : 'Guest Profile'}</Text>
        </View>

        {isSignedIn ? (
          <View style={styles.userSection}>
            <Image source={resolveImage(user?.avatar || 'avatar-sulaiman')} style={styles.avatar} />
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <View style={styles.guestIcon}>
              <Ionicons name="person-outline" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.userName}>Browsing as Guest</Text>
            <Text style={styles.userEmail}>Login to donate, track pickups, and save your addresses.</Text>
            <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.getParent()?.navigate('Login')}>
              <Ionicons name="log-in-outline" size={18} color={COLORS.white} />
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.getParent()?.navigate('SignUp')}>
              <Text style={styles.signupBtnText}>Create free account</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.menuList}>
          {menu.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index < menu.length - 1 && styles.menuItemBorder]}
              onPress={() => handleMenuPress(item)}
            >
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
  userName: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark, textAlign: 'center' },
  userEmail: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginTop: SPACING.xs, textAlign: 'center', lineHeight: 22, paddingHorizontal: SPACING.xl },
  guestCard: {
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primaryPale,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  guestIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    marginTop: SPACING.lg,
  },
  loginBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZE.md },
  signupBtn: { marginTop: SPACING.md, paddingVertical: SPACING.sm },
  signupBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
  menuList: { marginHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderLight, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.lg, paddingHorizontal: SPACING.lg, gap: SPACING.md, backgroundColor: COLORS.white },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '500', color: COLORS.textDark },
});
