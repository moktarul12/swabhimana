import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { resolveImage } from '../constants/images';
import { INFO_CONTENT, InfoPage } from './MoreScreen';

function GenericInfoContent({ info }: { info: InfoPage }) {
  return (
    <>
      {info.heroImage && (
        <View style={styles.heroWrap}>
          <Image source={resolveImage(info.heroImage)} style={styles.heroImage} />
          <LinearGradient colors={['transparent', 'rgba(13,59,18,0.85)']} style={styles.heroGradient} />
          <Text style={styles.heroTitle}>{info.title}</Text>
        </View>
      )}
      <Text style={styles.body}>{info.body}</Text>
      {info.sections?.map((section, index) => (
        <View key={section.title} style={styles.sectionCard}>
          <LinearGradient
            colors={index % 2 === 0 ? ['#1B5E20', '#2E7D32'] : ['#E8F5E9', '#F1F8F1']}
            style={styles.sectionGradient}
          >
            {section.icon && (
              <View style={[styles.sectionIcon, index % 2 !== 0 && styles.sectionIconLight]}>
                <Ionicons name={section.icon} size={22} color={COLORS.primary} />
              </View>
            )}
            <Text style={[styles.sectionTitle, index % 2 !== 0 && styles.sectionTitleDark]}>{section.title}</Text>
            <Text style={[styles.sectionBody, index % 2 !== 0 && styles.sectionBodyDark]}>{section.body}</Text>
          </LinearGradient>
        </View>
      ))}
    </>
  );
}

export default function InfoContentScreen({ navigation, route }: any) {
  const key = route.params?.key || 'How It Works';
  const info = INFO_CONTENT[key] || INFO_CONTENT['How It Works'];

  return (
    <View style={styles.container}>
      <ScreenHeader title={info.title} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GenericInfoContent info={info} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { paddingBottom: SPACING.xxxl },
  heroWrap: { height: 200, position: 'relative', justifyContent: 'flex-end', padding: SPACING.lg },
  heroImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%', resizeMode: 'cover' },
  heroGradient: { ...StyleSheet.absoluteFill },
  heroTitle: { fontSize: FONT_SIZE.xxxl, fontWeight: '800', color: COLORS.white, zIndex: 1 },
  body: {
    fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 26,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, marginBottom: SPACING.md,
  },
  sectionCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', ...SHADOWS.medium },
  sectionGradient: { padding: SPACING.lg },
  sectionIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
  },
  sectionIconLight: { backgroundColor: COLORS.white },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.white, marginBottom: SPACING.sm },
  sectionTitleDark: { color: COLORS.textDark },
  sectionBody: { fontSize: FONT_SIZE.md, color: 'rgba(255,255,255,0.92)', lineHeight: 24 },
  sectionBodyDark: { color: COLORS.textMedium },
});
