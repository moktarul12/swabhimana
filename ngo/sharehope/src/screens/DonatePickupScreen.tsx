import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { DonationStepper } from '../components/DonationStepper';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, UserAddress } from '../services/database';
import { useDonate } from '../context/DonateContext';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = ['10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

export default function DonatePickupScreen({ navigation }: any) {
  const { user } = useAuth();
  const { form, updateForm } = useDonate();
  const [showTimes, setShowTimes] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);

  useEffect(() => {
    if (user) db.getUserAddresses(user.id).then(setAddresses);
  }, [user]);

  const selectAddress = (addr: UserAddress) => {
    updateForm({ addressId: addr.id, address: addr.address });
    setShowAddresses(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Donate an Item" onBack={() => navigation.goBack()} />
      <DonationStepper currentStep={3} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.fieldLabel}>Pickup Address</Text>
        <View style={styles.addressCard}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.addressText}>{form.address || 'No address selected'}</Text>
          <TouchableOpacity onPress={() => setShowAddresses(true)}>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>Preferred Date</Text>
        <TouchableOpacity style={styles.inputField}>
          <Text style={styles.inputText}>{form.pickupDate}</Text>
          <Ionicons name="calendar-outline" size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>Preferred Time</Text>
        <TouchableOpacity style={styles.inputField} onPress={() => setShowTimes(!showTimes)}>
          <Text style={styles.inputText}>{form.pickupTime}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
        {showTimes && TIME_SLOTS.map((t) => (
          <TouchableOpacity key={t} style={styles.dropdownItem} onPress={() => { updateForm({ pickupTime: t }); setShowTimes(false); }}>
            <Text style={[styles.dropdownItemText, form.pickupTime === t && styles.dropdownItemActive]}>{t}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.fieldLabel}>Contact Number</Text>
        <TextInput style={styles.textInput} value={form.contactNumber} onChangeText={(t) => updateForm({ contactNumber: t })} keyboardType="phone-pad" placeholder="+91 XXXXX XXXXX" placeholderTextColor={COLORS.textLight} />
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Next" onPress={() => navigation.navigate('DonateReview')} fullWidth size="lg" disabled={!form.address || !form.contactNumber} />
      </View>

      <Modal visible={showAddresses} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Address</Text>
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.addrItem} onPress={() => selectAddress(item)}>
                  <Text style={styles.addrLabel}>{item.label}</Text>
                  <Text style={styles.addrText}>{item.address}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setShowAddresses(false)} variant="outline" fullWidth />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  fieldLabel: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark, marginBottom: SPACING.sm, marginTop: SPACING.md },
  addressCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.backgroundGray, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
  addressText: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textDark, lineHeight: 20 },
  changeLink: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '600' },
  inputField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  inputText: { fontSize: FONT_SIZE.md, color: COLORS.textDark },
  textInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.textDark },
  dropdownItem: { padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  dropdownItemText: { fontSize: FONT_SIZE.md, color: COLORS.textDark },
  dropdownItemActive: { color: COLORS.primary, fontWeight: '600' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xxl, borderTopRightRadius: BORDER_RADIUS.xxl, padding: SPACING.xl, maxHeight: '60%' },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark, marginBottom: SPACING.lg },
  addrItem: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  addrLabel: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  addrText: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },
});
