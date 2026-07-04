import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { resolveImage } from '../constants/images';
import { INFO_CONTENT } from './MoreScreen';
import { MOTTO } from '../constants/branding';

export default function InfoContentScreen({ navigation, route }: any) {
  const key = route.params?.key || 'About ManavSaathi';
  const info = INFO_CONTENT[key] || INFO_CONTENT['About ManavSaathi'];

  return (
    <View style={styles.container}>
      <ScreenHeader title={info.title} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {info.heroImage && (
          <View style={styles.heroWrap}>
            <Image source={resolveImage(info.heroImage)} style={styles.heroImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.heroGradient} />
            {key === 'About ManavSaathi' && (
              <Text style={styles.heroMotto}>{MOTTO}</Text>
            )}
          </View>
        )}

        <Text style={styles.body}>{info.body}</Text>

        {info.sections?.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              {section.icon && (
                <View style={styles.sectionIcon}>
                  <Ionicons name={section.icon} size={20} color={COLORS.primary} />
                </View>
              )}
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { paddingBottom: SPACING.xxxl },
  heroWrap: { height: 200, marginBottom: SPACING.lg },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroGradient: { ...StyleSheet.absoluteFill },
  heroMotto: {
    position: 'absolute', bottom: SPACING.lg, left: SPACING.lg, right: SPACING.lg,
    fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.white, fontStyle: 'italic',
  },
  body: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 26, paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionCard: {
    marginHorizontal: SPACING.lg, marginBottom: SPACING.md, backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  sectionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLighter, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, flex: 1 },
  sectionBody: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 24 },
});
