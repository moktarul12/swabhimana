import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ScreenHeader } from '../components/ScreenHeader';
import { DonationStepper } from '../components/DonationStepper';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useDonate } from '../context/DonateContext';

const CONDITIONS = ['New', 'Good', 'Fair', 'Used'];

export default function DonateDetailsScreen({ navigation }: any) {
  const { form, updateForm } = useDonate();
  const [showConditions, setShowConditions] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      updateForm({ photos: [...form.photos, result.assets[0].uri] });
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Donate an Item" onBack={() => navigation.goBack()} />
      <DonationStepper currentStep={2} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.selectedCard}>
          <View style={[styles.selectedIcon, { backgroundColor: form.categoryColor + '18' }]}>
            <Ionicons name={form.categoryIcon as any} size={24} color={form.categoryColor} />
          </View>
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedLabel}>Category</Text>
            <Text style={styles.selectedValue}>{form.category}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>Item Condition</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowConditions(!showConditions)}>
          <Text style={styles.dropdownText}>{form.condition}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
        {showConditions && CONDITIONS.map((c) => (
          <TouchableOpacity key={c} style={styles.dropdownItem} onPress={() => { updateForm({ condition: c }); setShowConditions(false); }}>
            <Text style={[styles.dropdownItemText, form.condition === c && styles.dropdownItemActive]}>{c}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.fieldLabel}>Quantity</Text>
        <View style={styles.inputWrap}>
          <TextInput style={styles.input} value={form.quantity} onChangeText={(t) => updateForm({ quantity: t })} keyboardType="numeric" placeholder="15" placeholderTextColor={COLORS.textLight} />
          <Text style={styles.inputSuffix}>Items</Text>
        </View>

        <Text style={styles.fieldLabel}>Description (Optional)</Text>
        <TextInput style={styles.textArea} value={form.description} onChangeText={(t) => updateForm({ description: t })} placeholder="Describe the items you are donating..." placeholderTextColor={COLORS.textLight} multiline numberOfLines={4} />

        <Text style={styles.fieldLabel}>Upload Photos</Text>
        <View style={styles.photoRow}>
          <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
            <Ionicons name="add" size={32} color={COLORS.primary} />
          </TouchableOpacity>
          {form.photos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.photoThumb} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Next" onPress={() => navigation.navigate('DonatePickup')} fullWidth size="lg" disabled={!form.quantity} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  selectedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.backgroundGray, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, gap: SPACING.md },
  selectedIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  selectedInfo: { flex: 1 },
  selectedLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textLight },
  selectedValue: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  changeLink: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '600' },
  fieldLabel: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark, marginBottom: SPACING.sm, marginTop: SPACING.md },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  dropdownText: { fontSize: FONT_SIZE.md, color: COLORS.textDark },
  dropdownItem: { padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  dropdownItemText: { fontSize: FONT_SIZE.md, color: COLORS.textDark },
  dropdownItemActive: { color: COLORS.primary, fontWeight: '600' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md },
  input: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textDark, paddingVertical: SPACING.md },
  inputSuffix: { fontSize: FONT_SIZE.md, color: COLORS.textLight },
  textArea: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.textDark, height: 100, textAlignVertical: 'top' },
  photoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  addPhoto: { width: 72, height: 72, borderRadius: BORDER_RADIUS.md, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  photoThumb: { width: 72, height: 72, borderRadius: BORDER_RADIUS.md },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
});
