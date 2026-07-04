import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { db, UserAddress } from '../services/database';
import { useAuth } from '../context/AuthContext';

export default function MyAddressesScreen({ navigation }: any) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setAddresses(await db.getUserAddresses(user.id));
    if (user.phone) setContact(user.phone);
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const useCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow location access to use your current location.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLatitude(loc.coords.latitude);
      setLongitude(loc.coords.longitude);
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo) {
        const parts = [geo.name, geo.street, geo.district, geo.city, geo.region, geo.postalCode].filter(Boolean);
        setAddress(parts.join(', '));
        if (!label) setLabel('Current Location');
      }
    } catch {
      Alert.alert('Error', 'Could not get your location. Please enter address manually.');
    } finally {
      setLocating(false);
    }
  };

  const openMap = (lat: number, lng: number) => {
    Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`);
  };

  const resetForm = () => {
    setLabel(''); setAddress(''); setContact(user?.phone || '');
    setLatitude(null); setLongitude(null); setShowAdd(false);
  };

  const handleAdd = async () => {
    if (!user || !label || !address) {
      Alert.alert('Missing info', 'Please fill in label and address.');
      return;
    }
    await db.addAddress(user.id, label, address, addresses.length === 0, contact || undefined, latitude, longitude);
    resetForm();
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
            <View style={styles.cardTop}>
              <View style={styles.labelRow}>
                <Ionicons name="location" size={18} color={COLORS.primary} />
                <Text style={styles.label}>{item.label}</Text>
                {item.is_default ? <Text style={styles.defaultBadge}>Default</Text> : null}
              </View>
              {item.latitude && item.longitude && (
                <TouchableOpacity style={styles.mapBtn} onPress={() => openMap(item.latitude!, item.longitude!)}>
                  <Ionicons name="map-outline" size={16} color={COLORS.info} />
                  <Text style={styles.mapBtnText}>View on map</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.address}>{item.address}</Text>
            {item.contact_number && (
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={14} color={COLORS.textLight} />
                <Text style={styles.contact}>{item.contact_number}</Text>
              </View>
            )}
            {item.latitude && item.longitude && (
              <Text style={styles.coords}>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</Text>
            )}
          </View>
        )}
        ListFooterComponent={
          <Button title="Add New Address" onPress={() => setShowAdd(true)} fullWidth size="lg" />
        }
      />

      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Address</Text>

            <TouchableOpacity style={styles.locationBtn} onPress={useCurrentLocation} disabled={locating}>
              {locating ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <>
                  <Ionicons name="navigate" size={20} color={COLORS.primary} />
                  <Text style={styles.locationBtnText}>Use Current Location</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Label</Text>
            <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="e.g. Home, Office" placeholderTextColor={COLORS.textLight} />

            <Text style={styles.fieldLabel}>Full Address</Text>
            <TextInput style={[styles.input, styles.textArea]} value={address} onChangeText={setAddress} placeholder="Street, area, city, pincode" placeholderTextColor={COLORS.textLight} multiline />

            <Text style={styles.fieldLabel}>Contact Number</Text>
            <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="+91 XXXXX XXXXX" placeholderTextColor={COLORS.textLight} keyboardType="phone-pad" />

            {latitude && longitude && (
              <View style={styles.coordsPreview}>
                <Ionicons name="pin" size={16} color={COLORS.success} />
                <Text style={styles.coordsText}>Location pinned: {latitude.toFixed(4)}, {longitude.toFixed(4)}</Text>
              </View>
            )}

            <Button title="Save Address" onPress={handleAdd} fullWidth size="lg" />
            <Button title="Cancel" onPress={resetForm} variant="outline" fullWidth size="lg" style={{ marginTop: SPACING.sm }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  list: { padding: SPACING.lg },
  card: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  label: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  defaultBadge: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '600', backgroundColor: COLORS.primaryLighter, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4 },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mapBtnText: { fontSize: FONT_SIZE.xs, color: COLORS.info, fontWeight: '600' },
  address: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 22 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm },
  contact: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium },
  coords: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xxl, borderTopRightRadius: BORDER_RADIUS.xxl, padding: SPACING.xl, maxHeight: '90%' },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', marginBottom: SPACING.lg },
  locationBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primaryLighter, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.lg,
  },
  locationBtnText: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.primary },
  fieldLabel: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textDark, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, fontSize: FONT_SIZE.md, marginBottom: SPACING.md, color: COLORS.textDark },
  textArea: { height: 80, textAlignVertical: 'top' },
  coordsPreview: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md, backgroundColor: COLORS.primaryPale, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  coordsText: { fontSize: FONT_SIZE.xs, color: COLORS.primary },
});
