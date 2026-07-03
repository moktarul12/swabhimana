import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { db, DonationTrackingStep } from '../services/database';

export default function DonationTrackingScreen({ navigation, route }: any) {
  const donationId = route.params?.id || 'DON-2026-000123';
  const [steps, setSteps] = useState<DonationTrackingStep[]>([]);

  useEffect(() => {
    db.getDonationTracking(donationId).then(setSteps);
  }, [donationId]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Track Your Donation" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.donationId}>{donationId}</Text>
        <View style={styles.timeline}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, step.is_completed ? styles.dotDone : null]}>
                  {step.is_completed ? <Ionicons name="checkmark" size={14} color={COLORS.white} /> : null}
                </View>
                {index < steps.length - 1 && <View style={[styles.line, step.is_completed ? styles.lineDone : null]} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.stepTitle, step.is_completed ? styles.stepTitleDone : null]}>{step.step_title}</Text>
                <Text style={styles.stepDesc}>{step.step_description}</Text>
                {step.step_date && <Text style={styles.stepTime}>{step.step_date} · {step.step_time}</Text>}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  donationId: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginBottom: SPACING.xl },
  timeline: { paddingLeft: SPACING.sm },
  timelineItem: { flexDirection: 'row', minHeight: 80 },
  timelineLeft: { alignItems: 'center', width: 32 },
  dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  dotDone: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  line: { width: 2, flex: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  lineDone: { backgroundColor: COLORS.primary },
  timelineContent: { flex: 1, paddingLeft: SPACING.md, paddingBottom: SPACING.lg },
  stepTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textLight },
  stepTitleDone: { color: COLORS.textDark },
  stepDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2, lineHeight: 18 },
  stepTime: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, marginTop: SPACING.xs },
});
