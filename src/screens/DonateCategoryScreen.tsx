import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { DonationStepper } from '../components/DonationStepper';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, ItemCategory } from '../services/database';
import { useDonate } from '../context/DonateContext';

export default function DonateCategoryScreen({ navigation }: any) {
  const { updateForm } = useDonate();
  const [categories, setCategories] = useState<ItemCategory[]>([]);

  useEffect(() => {
    db.getItemCategories().then(setCategories);
  }, []);

  const selectCategory = (cat: ItemCategory) => {
    updateForm({ categoryId: cat.id, category: cat.name, categoryIcon: cat.icon, categoryColor: cat.color });
    navigation.navigate('DonateDetails');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Donate an Item" onBack={() => navigation.goBack()} />
      <DonationStepper currentStep={1} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>What do you want to donate?</Text>
        <Text style={styles.subheading}>Choose a category</Text>
        <View style={styles.grid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} onPress={() => selectCategory(cat)}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '18' }]}>
                <Ionicons name={cat.icon as any} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.footerNote}>All items will be collected and distributed by ManavSathi.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  heading: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark },
  subheading: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginTop: SPACING.xs, marginBottom: SPACING.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  categoryCard: { width: '31%', aspectRatio: 1, backgroundColor: COLORS.backgroundGray, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.borderLight },
  categoryIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  categoryName: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.textDark },
  footerNote: { fontSize: FONT_SIZE.sm, color: COLORS.textLight, textAlign: 'center', marginTop: SPACING.xxl, lineHeight: 20 },
});
