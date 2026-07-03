import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, Story } from '../services/database';
import { resolveImage } from '../constants/images';

export default function StoryDetailScreen({ navigation, route }: any) {
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    if (route.params?.id) db.getStoryById(route.params.id).then(setStory);
  }, [route.params?.id]);

  if (!story) return <View style={styles.container}><ScreenHeader title="Story" onBack={() => navigation.goBack()} /></View>;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Stories of Change" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={resolveImage(story.image_key)} style={styles.image} />
        <Text style={styles.category}>{story.category}</Text>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.body}>{story.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { paddingBottom: SPACING.xxxl },
  image: { width: '100%', height: 240, resizeMode: 'cover' },
  category: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '600', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  title: { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.textDark, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  body: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 24, paddingHorizontal: SPACING.lg },
});
