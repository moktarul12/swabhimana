import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LOCAL_IMAGES } from '../constants/images';
import { AppLogo } from '../components/AppLogo';
import { db, ImpactStats, ItemCategory } from '../services/database';
import { useAuth } from '../context/AuthContext';
import { useDonate } from '../context/DonateContext';

const STAT_META = [
  { key: 'total_donations' as const, icon: 'heart' as const, label: 'Total Donations', color: '#1B5E20' },
  { key: 'families_helped' as const, icon: 'people' as const, label: 'Families Helped', color: '#E65100' },
  { key: 'items_donated' as const, icon: 'cube' as const, label: 'Items Donated', color: '#7B1FA2' },
  { key: 'lives_impacted' as const, icon: 'medkit' as const, label: 'Lives Impacted', color: '#00897B' },
];

type QuickAction = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
  primary?: boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'add', label: 'Donate Now', screen: 'DonateTab', primary: true },
  { icon: 'time-outline', label: 'Track Donation', screen: 'TrackDonation' },
  { icon: 'document-text-outline', label: 'Donation History', screen: 'HistoryTab' },
  { icon: 'shield-checkmark-outline', label: 'Impact Stories', screen: 'Stories' },
];

type Program = {
  image: ImageSourcePropType;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  tag: string;
};

const PROGRAMS: Program[] = [
  { image: LOCAL_IMAGES.programFood, icon: 'fast-food', title: 'Food Distribution', desc: 'Nutritious meals & rations for families facing hunger.', tag: '8,300+ meals served' },
  { image: LOCAL_IMAGES.programClothing, icon: 'shirt', title: 'Clothing Drive', desc: 'Warm clothes & blankets for those who need them most.', tag: '12,000+ items given' },
  { image: LOCAL_IMAGES.programEducation, icon: 'school', title: 'Education Support', desc: 'Books, supplies & learning for underprivileged children.', tag: '3,200+ children' },
  { image: LOCAL_IMAGES.programHealth, icon: 'medkit', title: 'Healthcare Camps', desc: 'Free medical check-ups & essential care in villages.', tag: '120+ camps held' },
];

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { updateForm } = useDonate();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [unread, setUnread] = useState(0);
  const firstName = user?.name?.split(' ')[0] || 'Ankit';

  useEffect(() => {
    db.getImpactStats().then(setStats);
    db.getItemCategories().then(setCategories);
    if (user) db.getUnreadCount(user.id).then(setUnread);
  }, [user]);

  // HomeTab is a direct child of the tab navigator, so a single getParent()
  // reaches the root stack that owns TrackDonation / Stories / Notifications.
  const rootNav = () => navigation.getParent();

  const navigate = (screen: string) => {
    if (screen === 'DonateTab' || screen === 'HistoryTab') navigation.navigate(screen);
    else if (screen === 'TrackDonation') rootNav()?.navigate('TrackDonation', { id: 'DON-2026-000123' });
    else rootNav()?.navigate(screen);
  };

  const startDonation = (cat: ItemCategory) => {
    updateForm({ categoryId: cat.id, category: cat.name, categoryIcon: cat.icon, categoryColor: cat.color });
    navigation.navigate('DonateTab', { screen: 'DonateDetails' });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <AppLogo size="sm" direction="row" />
          <TouchableOpacity style={styles.bellBtn} onPress={() => rootNav()?.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.textDark} />
            {unread > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
          <Text style={styles.greetingSub}>Good to see you back!</Text>
        </View>

        <View style={styles.bannerCard}>
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerText}>
              Together with <Text style={styles.bannerBold}>Swabhiman</Text> we create better tomorrows.
            </Text>
          </View>
          <Image source={LOCAL_IMAGES.homeFamily} style={styles.bannerImage} />
        </View>

        <View style={styles.statsGrid}>
          {STAT_META.map((meta) => (
            <View key={meta.key} style={styles.statCard}>
              <Ionicons name={meta.icon} size={22} color={meta.color} />
              <Text style={[styles.statValue, { color: meta.color }]}>
                {stats ? stats[meta.key] : '—'}
              </Text>
              <Text style={styles.statLabel}>{meta.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionItem} onPress={() => navigate(action.screen)} activeOpacity={0.8}>
              <View style={[styles.actionCard, action.primary ? styles.actionCardPrimary : styles.actionCardOutline]}>
                <Ionicons name={action.icon} size={26} color={action.primary ? COLORS.white : COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.donateHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitleTight}>What We Do</Text>
            <Text style={styles.donateSub}>Your donations power these programs.</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.programRow}
          snapToInterval={252}
          decelerationRate="fast"
        >
          {PROGRAMS.map((p) => (
            <TouchableOpacity key={p.title} style={styles.programCard} onPress={() => navigate('DonateTab')} activeOpacity={0.9}>
              <View style={styles.programImageWrap}>
                <Image source={p.image} style={styles.programImage} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={styles.programGradient} />
                <View style={styles.programIconBadge}>
                  <Ionicons name={p.icon} size={16} color={COLORS.white} />
                </View>
                <Text style={styles.programImageTitle}>{p.title}</Text>
              </View>
              <View style={styles.programBody}>
                <Text style={styles.programDesc} numberOfLines={2}>{p.desc}</Text>
                <View style={styles.programTagRow}>
                  <Ionicons name="trending-up" size={14} color={COLORS.primary} />
                  <Text style={styles.programTag}>{p.tag}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.donateHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitleTight}>What would you like to donate?</Text>
            <Text style={styles.donateSub}>Every item you give finds a new home.</Text>
          </View>
          <TouchableOpacity onPress={() => navigate('DonateTab')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catCard} onPress={() => startDonation(cat)} activeOpacity={0.85}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + '18' }]}>
                <Ionicons name={cat.icon as any} size={26} color={cat.color} />
              </View>
              <Text style={styles.catName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.ctaBanner} onPress={() => navigate('DonateTab')} activeOpacity={0.9}>
          <View style={styles.ctaIconWrap}>
            <Ionicons name="gift" size={24} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Ready to make a difference?</Text>
            <Text style={styles.ctaSub}>Donate clothes, food, furniture & more in minutes.</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  bellBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  greetingSection: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  greeting: { fontSize: FONT_SIZE.xxxl, fontWeight: '700', color: COLORS.textDark },
  greetingSub: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginTop: 4 },
  bannerCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.lg, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, minHeight: 120, ...SHADOWS.medium },
  bannerTextWrap: { flex: 1, paddingRight: SPACING.md },
  bannerText: { fontSize: FONT_SIZE.lg, fontWeight: '500', color: COLORS.white, lineHeight: 26 },
  bannerBold: { fontWeight: '700' },
  bannerImage: { width: 88, height: 88, borderRadius: BORDER_RADIUS.md, resizeMode: 'cover' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  statCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small },
  statValue: { fontSize: FONT_SIZE.xl, fontWeight: '700', marginTop: SPACING.sm },
  statLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 4 },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  actionsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, justifyContent: 'space-between' },
  actionItem: { alignItems: 'center', width: '23%' },
  actionCard: { width: '100%', aspectRatio: 1, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  actionCardPrimary: { backgroundColor: COLORS.primary, ...SHADOWS.small },
  actionCardOutline: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  actionLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium, textAlign: 'center', lineHeight: 14 },
  donateHeader: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  sectionTitleTight: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark },
  donateSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },
  seeAll: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },
  programRow: { paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xs },
  programCard: { width: 236, backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderLight, overflow: 'hidden', ...SHADOWS.medium },
  programImageWrap: { height: 130, justifyContent: 'flex-end' },
  programImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  programGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  programIconBadge: { position: 'absolute', top: SPACING.sm, left: SPACING.sm, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(27,94,32,0.9)', alignItems: 'center', justifyContent: 'center' },
  programImageTitle: { color: COLORS.white, fontSize: FONT_SIZE.lg, fontWeight: '700', padding: SPACING.md },
  programBody: { padding: SPACING.md },
  programDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, lineHeight: 18, minHeight: 36 },
  programTagRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  programTag: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.primary },
  catRow: { paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xs },
  catCard: { width: 84, alignItems: 'center', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small },
  catIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  catName: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.textDark },
  ctaBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.lg, marginTop: SPACING.xl, backgroundColor: COLORS.primaryLighter, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, gap: SPACING.md },
  ctaIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  ctaTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.textDark },
  ctaSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },
});
