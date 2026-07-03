import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, UserAddress } from '../services/database';
import { useAuth } from '../context/AuthContext';

export default function MyAddressesScreen({ navigation }: any) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    setAddresses(await db.getUserAddresses(user.id));
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleAdd = async () => {
    if (!user || !label || !address) return;
    await db.addAddress(user.id, label, address, addresses.length === 0);
    setLabel(''); setAddress(''); setShowAdd(false);
    load();
    Alert.alert('Added', 'Address saved successfully.');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Addresses" onBack={() => navigation.goBack()} />
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>{item.label}</Text>
              {item.is_default ? <Text style={styles.defaultBadge}>Default</Text> : null}
            </View>
            <Text style={styles.address}>{item.address}</Text>
          </View>
        )}
        ListFooterComponent={<Button title="Add New Address" onPress={() => setShowAdd(true)} fullWidth size="lg" />}
      />
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Address</Text>
            <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="Label (e.g. Home)" placeholderTextColor={COLORS.textLight} />
            <TextInput style={[styles.input, styles.textArea]} value={address} onChangeText={setAddress} placeholder="Full address" placeholderTextColor={COLORS.textLight} multiline />
            <Button title="Save Address" onPress={handleAdd} fullWidth size="lg" />
            <Button title="Cancel" onPress={() => setShowAdd(false)} variant="outline" fullWidth size="lg" style={{ marginTop: SPACING.sm }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  list: { padding: SPACING.lg },
  card: { backgroundColor: COLORS.backgroundGray, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  label: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  defaultBadge: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '600', backgroundColor: COLORS.primaryLighter, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4 },
  address: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xxl, borderTopRightRadius: BORDER_RADIUS.xxl, padding: SPACING.xl },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', marginBottom: SPACING.lg },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONT_SIZE.md, marginBottom: SPACING.md, color: COLORS.textDark },
  textArea: { height: 80, textAlignVertical: 'top' },
});
