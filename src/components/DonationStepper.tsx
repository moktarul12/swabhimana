import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

const STEPS = ['Category', 'Details', 'Pickup', 'Review'];

interface DonationStepperProps {
  currentStep: number;
}

export function DonationStepper({ currentStep }: DonationStepperProps) {
  return (
    <View style={styles.container}>
      {STEPS.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <View key={label} style={styles.stepWrap}>
            <View style={styles.stepRow}>
              <View style={[styles.circle, isActive && styles.circleActive, isDone && styles.circleDone]}>
                <Text style={[styles.circleText, (isActive || isDone) && styles.circleTextActive]}>
                  {stepNum}
                </Text>
              </View>
              {index < STEPS.length - 1 && (
                <View style={[styles.line, isDone && styles.lineDone]} />
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  stepWrap: {
    flex: 1,
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    zIndex: 1,
  },
  circleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  circleDone: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  circleText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  circleTextActive: {
    color: COLORS.white,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: -4,
  },
  lineDone: {
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
