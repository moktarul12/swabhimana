import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Input, Button } from '../components/Button';
import { COLORS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/database';

export default function PersonalInfoScreen({ navigation }: any) {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await db.updateUser(user.id, { name, phone, bio });
      await refreshUser();
      Alert.alert('Saved', 'Personal information updated.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Personal Information" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Full Name" value={name} onChangeText={setName} placeholder="Your name" icon="person-outline" />
        <Input label="Email" value={user?.email || ''} onChangeText={() => {}} placeholder="Email" icon="mail-outline" />
        <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+91 XXXXX XXXXX" icon="call-outline" keyboardType="phone-pad" />
        <Input label="Bio" value={bio || ''} onChangeText={setBio} placeholder="About you" multiline numberOfLines={3} />
        <Button title="Save Changes" onPress={handleSave} loading={saving} fullWidth size="lg" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg },
});
