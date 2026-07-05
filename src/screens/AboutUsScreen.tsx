import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { AboutPanel } from '../components/AboutPanel';
import { COLORS } from '../constants/theme';

export default function AboutUsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="About Us" onBack={() => navigation.goBack()} />
      <AboutPanel
        onDonatePress={() => {
          const parent = navigation.getParent();
          if (parent) parent.navigate('Main', { screen: 'DonateTab' });
          else navigation.navigate('DonateTab');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
});
