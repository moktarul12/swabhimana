import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

const INFO_CONTENT: Record<string, { title: string; body: string }> = {
  'About Swabhiman': {
    title: 'About Swabhiman',
    body: 'Swabhiman is a non-profit organization dedicated to uplifting underprivileged communities across India. Through ShareHope, we connect generous donors with those in need, ensuring every donation reaches the right hands with full transparency.',
  },
  'How It Works': {
    title: 'How It Works',
    body: '1. Choose what to donate\n2. Fill item details and schedule pickup\n3. Swabhiman volunteer collects from your address\n4. Items are verified and distributed to beneficiaries\n5. Track your donation journey with photos and updates',
  },
  'FAQs': {
    title: 'FAQs',
    body: 'Q: What items can I donate?\nA: Clothes, food, books, toys, furniture, electronics, blankets and more.\n\nQ: Is pickup free?\nA: Yes, pickup is completely free.\n\nQ: How do I know my donation reached someone?\nA: You receive photos and tracking updates at every step.',
  },
  'Terms & Conditions': {
    title: 'Terms & Conditions',
    body: 'By using ShareHope, you agree to donate items in good condition as described. Swabhiman reserves the right to refuse items that are unsafe or unusable. All donations are final once collected.',
  },
  'Privacy Policy': {
    title: 'Privacy Policy',
    body: 'We collect your name, email, phone and address only to facilitate donations. Your data is never sold to third parties. Photos shared during donation journey are used only for transparency purposes.',
  },
};

const MENU_ITEMS = [
  'About Swabhiman', 'How It Works', 'FAQs', 'Terms & Conditions', 'Privacy Policy', 'Rate Us', 'Share the App',
];

export default function MoreScreen({ navigation }: any) {
  const handlePress = async (item: string) => {
    if (item === 'Rate Us') {
      Alert.alert('Rate Us', 'Thank you for using ShareHope! Rating will be available on the App Store soon.');
    } else if (item === 'Share the App') {
      await Share.share({ message: 'Join me on ShareHope — donate items with trust! https://sharehope.app' });
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
        <Text style={styles.version}>v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.lg },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  menuLabel: { fontSize: FONT_SIZE.md, color: COLORS.textDark },
  version: { textAlign: 'center', fontSize: FONT_SIZE.sm, color: COLORS.textLight, marginTop: SPACING.xxl },
});

export { INFO_CONTENT };
