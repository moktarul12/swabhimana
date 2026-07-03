import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { db, Story } from '../services/database';
import { resolveImage } from '../constants/images';

const FILTERS = ['All', 'Clothes', 'Food', 'Books', 'More'];

export default function StoriesScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    db.getStories(activeFilter).then(setStories);
  }, [activeFilter]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Stories of Change" onBack={() => navigation.goBack()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => setActiveFilter(f)}>
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.content}>
        {stories.map((story) => (
          <View key={story.id} style={styles.storyCard}>
            <Image source={resolveImage(story.image_key)} style={styles.storyImage} />
            <View style={styles.storyContent}>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <Text style={styles.storyExcerpt} numberOfLines={3}>{story.excerpt}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('StoryDetail', { id: story.id })}>
                <Text style={styles.viewMore}>View More</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  filters: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.sm },
  filterChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round, backgroundColor: COLORS.backgroundGray },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.textMedium },
  filterTextActive: { color: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  storyCard: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.lg, backgroundColor: COLORS.white, ...SHADOWS.medium },
  storyImage: { width: '100%', height: 200, resizeMode: 'cover' },
  storyContent: { padding: SPACING.lg },
  storyTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, marginBottom: SPACING.sm },
  storyExcerpt: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 22 },
  viewMore: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: '600', marginTop: SPACING.md },
});
