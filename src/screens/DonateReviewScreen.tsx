import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { DonationStepper } from '../components/DonationStepper';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useDonate } from '../context/DonateContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/database';

export default function DonateReviewScreen({ navigation }: any) {
  const { user } = useAuth();
  const { form, resetForm } = useDonate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const donationId = await db.submitItemDonation({
        user_id: user.id,
        category_id: form.categoryId,
        quantity: parseInt(form.quantity, 10) || 1,
        condition: form.condition,
        description: form.description,
        pickup_address: form.address,
        pickup_date: form.pickupDate,
        pickup_time: form.pickupTime,
        contact_number: form.contactNumber,
        photo_uris: form.photos,
      });
      Alert.alert('Success', 'Your donation has been submitted successfully!', [
        { text: 'Track Donation', onPress: () => { resetForm(); navigation.getParent()?.getParent()?.navigate('TrackDonation', { id: donationId }); } },
        { text: 'OK', onPress: () => { resetForm(); navigation.getParent()?.getParent()?.navigate('Main', { screen: 'HistoryTab' }); } },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to submit donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Donate an Item" onBack={() => navigation.goBack()} />
      <DonationStepper currentStep={4} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Item Details</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: form.categoryColor + '18' }]}>
              <Ionicons name={form.categoryIcon as any} size={24} color={form.categoryColor} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Category</Text>
              <Text style={styles.rowValue}>{form.category}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Condition</Text><Text style={styles.detailValue}>{form.condition}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Quantity</Text><Text style={styles.detailValue}>{form.quantity} Items</Text></View>
          {form.description ? <View style={styles.detailRow}><Text style={styles.detailLabel}>Description</Text><Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>{form.description}</Text></View> : null}
        </View>

        <Text style={styles.sectionTitle}>Pickup Details</Text>
        <View style={styles.section}>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Address</Text><Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>{form.address}</Text></View>
          <View style={styles.divider} />
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Date</Text><Text style={styles.detailValue}>{form.pickupDate}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Time</Text><Text style={styles.detailValue}>{form.pickupTime}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Contact</Text><Text style={styles.detailValue}>{form.contactNumber}</Text></View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Submit Donation" onPress={handleSubmit} loading={submitting} fullWidth size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, marginBottom: SPACING.md, marginTop: SPACING.sm },
  section: { backgroundColor: COLORS.backgroundGray, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconBox: { width: 48, height: 48, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textLight },
  rowValue: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  detailLabel: { fontSize: FONT_SIZE.md, color: COLORS.textMedium },
  detailValue: { fontSize: FONT_SIZE.md, fontWeight: '500', color: COLORS.textDark },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
});
