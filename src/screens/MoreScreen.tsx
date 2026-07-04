import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { APP_NAME, APP_URL, ABOUT_MANAVSAATHI, VISION, MISSION, MOTTO, CONTACT } from '../constants/branding';

export type InfoSection = { title: string; body: string; icon?: keyof typeof Ionicons.glyphMap };

export type InfoPage = {
  title: string;
  body: string;
  heroImage?: string;
  sections?: InfoSection[];
};

export const INFO_CONTENT: Record<string, InfoPage> = {
  'About ManavSaathi': {
    title: 'About ManavSaathi',
    body: ABOUT_MANAVSAATHI,
    heroImage: 'home-family',
    sections: [
      { title: 'Our Vision', body: VISION, icon: 'eye-outline' },
      { title: 'Our Mission', body: MISSION, icon: 'rocket-outline' },
      { title: 'Our Motto', body: MOTTO, icon: 'heart-outline' },
      {
        title: 'Contact Us',
        body: `${CONTACT.name}\n${CONTACT.phone}\n${CONTACT.email}\n${CONTACT.address}`,
        icon: 'call-outline',
      },
    ],
  },
  'How It Works': {
    title: 'How It Works',
    body: 'Making a difference is simple with ManavSaathi.',
    heroImage: 'onboarding-donation',
    sections: [
      { title: '1. Choose What to Give', body: 'Select a category — clothes, food, books, toys, furniture and more.', icon: 'gift-outline' },
      { title: '2. Share Details', body: 'Describe your items, add photos, and schedule a convenient pickup time.', icon: 'create-outline' },
      { title: '3. We Collect', body: 'A ManavSaathi volunteer picks up from your address at the scheduled time.', icon: 'car-outline' },
      { title: '4. Track Impact', body: 'Follow your donation journey with real-time updates, photos, and notifications.', icon: 'map-outline' },
      { title: '5. Change Lives', body: 'Your items reach families and communities who genuinely need support.', icon: 'heart-outline' },
    ],
  },
  'FAQs': {
    title: 'FAQs',
    body: 'Common questions about ManavSaathi.',
    sections: [
      { title: 'What can I donate?', body: 'Clothes, food, books, toys, furniture, electronics, blankets and more — anything in good, usable condition.', icon: 'cube-outline' },
      { title: 'Is pickup free?', body: 'Yes! Pickup is completely free. ManavSaathi volunteers come to your address.', icon: 'checkmark-circle-outline' },
      { title: 'How do I track my donation?', body: 'Use Track Donation from Home or view My Donations. You get updates at every step.', icon: 'navigate-outline' },
      { title: 'How long does pickup take?', body: 'Usually within 2-3 business days after ManavSaathi accepts your request.', icon: 'time-outline' },
    ],
  },
  'Terms & Conditions': {
    title: 'Terms & Conditions',
    body: 'By using ManavSaathi, you agree to donate items in good condition as described. ManavSaathi reserves the right to refuse items that are unsafe or unusable. All donations are final once collected. We are committed to ensuring every contribution creates meaningful impact.',
  },
  'Privacy Policy': {
    title: 'Privacy Policy',
    body: 'We collect your name, email, phone and address only to facilitate donations and volunteering. Your data is never sold to third parties. Photos shared during the donation journey are used only for transparency purposes. Contact us at support@manavsathis.com for any privacy concerns.',
  },
};

const MENU_ITEMS = [
  'About ManavSaathi', 'How It Works', 'FAQs', 'Terms & Conditions', 'Privacy Policy', 'Rate Us', 'Share the App',
];

export default function MoreScreen({ navigation }: any) {
  const handlePress = async (item: string) => {
    if (item === 'Rate Us') {
      Alert.alert('Rate Us', `Thank you for using ${APP_NAME}! Rating will be available on the App Store soon.`);
    } else if (item === 'Share the App') {
      await Share.share({ message: `Join me on ${APP_NAME} — together for humanity! ${APP_URL}` });
    } else if (INFO_CONTENT[item]) {
      navigation.navigate('InfoContent', { key: item });
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="More" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity key={item} style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuItemBorder]} onPress={() => handlePress(item)}>
            <Text style={styles.menuLabel}>{item}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.websiteCard} onPress={() => Linking.openURL(APP_URL)}>
          <Ionicons name="globe-outline" size={22} color={COLORS.primary} />
          <Text style={styles.websiteText}>{APP_URL.replace('https://', '')}</Text>
        </TouchableOpacity>
        <Text style={styles.version}>ManavSaathi v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.lg },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textDark, fontWeight: '500' },
  websiteCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.primaryLighter, borderRadius: 12 },
  websiteText: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.primary },
  version: { textAlign: 'center', fontSize: FONT_SIZE.sm, color: COLORS.textLight, marginTop: SPACING.xxl },
});
