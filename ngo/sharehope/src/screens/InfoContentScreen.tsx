import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';
import { INFO_CONTENT } from './MoreScreen';

export default function InfoContentScreen({ navigation, route }: any) {
  const key = route.params?.key || 'About Swabhiman';
  const info = INFO_CONTENT[key] || INFO_CONTENT['About Swabhiman'];

  return (
    <View style={styles.container}>
      <ScreenHeader title={info.title} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.body}>{info.body}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  body: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 24 },
});
