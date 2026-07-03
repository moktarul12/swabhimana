import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { AppLogo } from '../components/AppLogo';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, DonationPhoto } from '../services/database';
import { resolveImage } from '../constants/images';

export default function DonationPhotosScreen({ navigation, route }: any) {
  const id = route.params?.id || 'DON-2026-000123';
  const [photos, setPhotos] = useState<DonationPhoto[]>([]);

  useEffect(() => {
    db.getDonationPhotos(id).then(setPhotos);
  }, [id]);

  const collected = photos.find(p => p.photo_type === 'collected');
  const delivery = photos.find(p => p.photo_type === 'delivery');
  const uploads = photos.filter(p => p.photo_type === 'upload');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Donation Journey" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.donationId}>{id}</Text>

        {collected && (
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Collected Photo</Text>
            <Image source={resolveImage(collected.image_key)} style={styles.photo} />
            <Text style={styles.photoCaption}>Volunteer collecting items from donor</Text>
          </View>
        )}

        {delivery && (
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Delivery Photo</Text>
            <Image source={resolveImage(delivery.image_key)} style={styles.photo} />
            <Text style={styles.photoCaption}>Items delivered to beneficiary family</Text>
          </View>
        )}

        {uploads.length > 0 && (
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Your Uploaded Photos</Text>
            <View style={styles.uploadRow}>
              {uploads.map(p => (
                <Image key={p.id} source={resolveImage(p.image_key)} style={styles.uploadThumb} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.thankYou}>
          <AppLogo size="sm" />
          <Text style={styles.thankYouText}>Thank you!{'\n'}Your kindness is changing lives.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  donationId: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginBottom: SPACING.xl },
  photoSection: { marginBottom: SPACING.xl },
  photoLabel: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, marginBottom: SPACING.md },
  photo: { width: '100%', height: 200, borderRadius: BORDER_RADIUS.md, resizeMode: 'cover' },
  photoCaption: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: SPACING.sm },
  uploadRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  uploadThumb: { width: 100, height: 100, borderRadius: BORDER_RADIUS.md },
  thankYou: { alignItems: 'center', paddingVertical: SPACING.xxl, marginTop: SPACING.lg },
  thankYouText: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.primary, textAlign: 'center', marginTop: SPACING.lg, lineHeight: 26 },
});
