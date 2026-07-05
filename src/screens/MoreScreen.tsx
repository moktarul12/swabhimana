import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { APP_NAME, APP_URL, ABOUT_INTRO, MOTTO } from '../constants/branding';

export type InfoSection = { title: string; body: string; icon?: keyof typeof Ionicons.glyphMap };

export type InfoPage = {
  title: string;
  body: string;
  heroImage?: string;
  sections?: InfoSection[];
};

export const INFO_CONTENT: Record<string, InfoPage> = {
  'How It Works': {
    title: 'How It Works',
    body: 'Making a difference is simple with ManavSathi.',
    heroImage: 'onboarding-donation',
    sections: [
      { title: '1. Choose What to Give', body: 'Select a category — clothes, food, books, toys, furniture and more.', icon: 'gift-outline' },
      { title: '2. Share Details', body: 'Describe your items, add photos, and schedule a convenient pickup time.', icon: 'create-outline' },
      { title: '3. We Collect', body: 'A ManavSathi volunteer picks up from your address at the scheduled time.', icon: 'car-outline' },
      { title: '4. Track Impact', body: 'Follow your donation journey with real-time updates, photos, and notifications.', icon: 'map-outline' },
      { title: '5. Change Lives', body: 'Your items reach families and communities who genuinely need support.', icon: 'heart-outline' },
    ],
  },
  'FAQs': {
    title: 'FAQs',
    body: 'Common questions about ManavSathi.',
    sections: [
      { title: 'What can I donate?', body: 'Clothes, food, books, toys, furniture, electronics, blankets and more — anything in good, usable condition.', icon: 'cube-outline' },
      { title: 'Is pickup free?', body: 'Yes! Pickup is completely free. ManavSathi volunteers come to your address.', icon: 'checkmark-circle-outline' },
      { title: 'How do I track my donation?', body: 'Use Track Donation from Home or view My Donations. You get updates at every step.', icon: 'navigate-outline' },
      { title: 'How long does pickup take?', body: 'Usually within 2-3 business days after ManavSathi accepts your request.', icon: 'time-outline' },
    ],
  },
  'Terms & Conditions': {
    title: 'Terms & Conditions',
    body: 'By using ManavSathi, you agree to donate items in good condition as described. ManavSathi reserves the right to refuse items that are unsafe or unusable. All donations are final once collected. We are committed to ensuring every contribution creates meaningful impact.',
  },
  'Privacy Policy': {
    title: 'Privacy Policy',
    body: 'We collect your name, email, phone and address only to facilitate donations and volunteering. Your data is never sold to third parties. Photos shared during the donation journey are used only for transparency purposes. Contact us at support@manavsathis.com for any privacy concerns.',
  },
};

const MENU_ITEMS: { label: string; icon: keyof typeof Ionicons.glyphMap; route?: string; key?: string }[] = [
  { label: 'About Us', icon: 'heart-outline', route: 'AboutUs' },
  { label: 'How It Works', icon: 'git-network-outline', key: 'How It Works' },
  { label: 'FAQs', icon: 'help-circle-outline', key: 'FAQs' },
  { label: 'Terms & Conditions', icon: 'document-text-outline', key: 'Terms & Conditions' },
  { label: 'Privacy Policy', icon: 'shield-outline', key: 'Privacy Policy' },
  { label: 'Rate Us', icon: 'star-outline' },
  { label: 'Share the App', icon: 'share-social-outline' },
];

export default function MoreScreen({ navigation }: any) {
  const handlePress = async (item: typeof MENU_ITEMS[0]) => {
    if (item.label === 'Rate Us') {
      Alert.alert('Rate Us', `Thank you for using ${APP_NAME}! Rating will be available on the App Store soon.`);
    } else if (item.label === 'Share the App') {
      await Share.share({ message: `Join me on ${APP_NAME} — ${MOTTO} ${APP_URL}` });
    } else if (item.route) {
      navigation.navigate(item.route);
    } else if (item.key && INFO_CONTENT[item.key]) {
      navigation.navigate('InfoContent', { key: item.key });
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="More" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.aboutBanner} onPress={() => navigation.navigate('AboutUs')} activeOpacity={0.9}>
          <View style={styles.aboutBannerIcon}>
            <Ionicons name="heart" size={28} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aboutBannerTitle}>About {APP_NAME}</Text>
            <Text style={styles.aboutBannerSub} numberOfLines={2}>{ABOUT_INTRO}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
            onPress={() => handlePress(item)}
          >
            <Ionicons name={item.icon} size={22} color={COLORS.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.websiteCard} onPress={() => Linking.openURL(APP_URL)}>
          <Ionicons name="globe-outline" size={22} color={COLORS.primary} />
          <Text style={styles.websiteText}>{APP_URL.replace('https://', '')}</Text>
        </TouchableOpacity>
        <Text style={styles.version}>{APP_NAME} v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  aboutBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.primaryPale, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.primaryLighter,
  },
  aboutBannerIcon: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center',
  },
  aboutBannerTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark },
  aboutBannerSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 4, lineHeight: 18 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.lg },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textDark, fontWeight: '500' },
  websiteCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.primaryLighter, borderRadius: 12 },
  websiteText: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.primary },
  version: { textAlign: 'center', fontSize: FONT_SIZE.sm, color: COLORS.textLight, marginTop: SPACING.xxl },
});
