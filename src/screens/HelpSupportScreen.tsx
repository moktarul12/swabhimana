import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { CONTACT, APP_NAME } from '../constants/branding';

const FAQS = [
  { q: 'How do I donate items?', a: 'Go to Donate tab, choose category, fill details, schedule pickup and submit.' },
  { q: 'How long does pickup take?', a: `Usually within 2-3 business days after acceptance by ${APP_NAME}.` },
  { q: 'Can I track my donation?', a: 'Yes! Use Track Donation from Home or view in My Donations history.' },
];

export default function HelpSupportScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL(`mailto:${CONTACT.email}`)}>
          <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
          <View>
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactDesc}>{CONTACT.email}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL(`tel:+91${CONTACT.phoneRaw}`)}>
          <Ionicons name="call-outline" size={24} color={COLORS.primary} />
          <View>
            <Text style={styles.contactTitle}>Call Us</Text>
            <Text style={styles.contactDesc}>{CONTACT.phone}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}`)}>
          <Ionicons name="location-outline" size={24} color={COLORS.primary} />
          <View>
            <Text style={styles.contactTitle}>Visit Us</Text>
            <Text style={styles.contactDesc}>{CONTACT.address}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.faqTitle}>FAQs</Text>
        {FAQS.map((faq, i) => (
          <View key={i} style={styles.faqItem}>
            <Text style={styles.faqQ}>{faq.q}</Text>
            <Text style={styles.faqA}>{faq.a}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  contactCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.backgroundGray, borderRadius: 12, marginBottom: SPACING.md },
  contactTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  contactDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },
  faqTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, marginTop: SPACING.lg, marginBottom: SPACING.md },
  faqItem: { marginBottom: SPACING.lg },
  faqQ: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  faqA: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: SPACING.xs, lineHeight: 20 },
});
