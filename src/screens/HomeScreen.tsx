import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LOCAL_IMAGES, resolveImage } from '../constants/images';
import { DonationCard } from '../components/DonationCard';
import { db, ImpactStats, ItemCategory, ItemDonation } from '../services/database';
import { APP_NAME, ABOUT_INTRO } from '../constants/branding';
import { useAuth } from '../context/AuthContext';
import { useDonate } from '../context/DonateContext';

const STAT_META = [
  { key: 'total_volunteers' as const, icon: 'people' as const, label: 'Volunteers', color: '#1B5E20' },
  { key: 'families_helped' as const, icon: 'home' as const, label: 'Families', color: '#E65100' },
  { key: 'items_donated' as const, icon: 'cube' as const, label: 'Items Donated', color: '#7B1FA2' },
  { key: 'lives_impacted' as const, icon: 'heart' as const, label: 'Lives Touched', color: '#00897B' },
];

type QuickAction = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
  color: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'heart', label: 'Donate', screen: 'DonateTab', color: '#1B5E20' },
  { icon: 'navigate', label: 'Track', screen: 'TrackDonation', color: '#2196F3' },
  { icon: 'time', label: 'History', screen: 'HistoryTab', color: '#7B1FA2' },
  { icon: 'chatbubble-ellipses', label: 'Stories', screen: 'Stories', color: '#E65100' },
];

type Program = {
  image: ImageSourcePropType;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  tag: string;
};

const PROGRAMS: Program[] = [
  { image: LOCAL_IMAGES.programFood, icon: 'fast-food', title: 'Food Distribution', desc: 'Nutritious meals for families facing hunger.', tag: '8,300+ meals served' },
  { image: LOCAL_IMAGES.programClothing, icon: 'shirt', title: 'Clothing Drive', desc: 'Warm clothes for those who need them most.', tag: '12,000+ items given' },
  { image: LOCAL_IMAGES.programEducation, icon: 'school', title: 'Education Support', desc: 'Books & learning for a brighter tomorrow.', tag: '5,600+ children helped' },
  { image: LOCAL_IMAGES.programHealth, icon: 'medkit', title: 'Healthcare Camps', desc: 'Free medical check-ups in villages.', tag: '120+ camps held' },
];

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { updateForm } = useDonate();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [recentDonations, setRecentDonations] = useState<ItemDonation[]>([]);
  const [unread, setUnread] = useState(0);
  const firstName = user?.name?.split(' ')[0] || 'Sulaiman';

  const loadData = useCallback(async () => {
    db.getImpactStats().then(setStats);
    db.getItemCategories().then(setCategories);
    if (user) {
      db.getUnreadCount(user.id).then(setUnread);
      db.getItemDonations(user.id, 'all').then((d) => setRecentDonations(d.slice(0, 3)));
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);
  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const rootNav = () => navigation.getParent();

  const navigate = (screen: string) => {
    if (screen === 'DonateTab' || screen === 'HistoryTab') navigation.navigate(screen);
    else if (screen === 'TrackDonation') rootNav()?.navigate('TrackDonation', { id: recentDonations[0]?.id || 'DON-2026-000123' });
    else rootNav()?.navigate(screen);
  };

  const startDonation = (cat: ItemCategory) => {
    updateForm({ categoryId: cat.id, category: cat.name, categoryIcon: cat.icon, categoryColor: cat.color });
    navigation.navigate('DonateTab', { screen: 'DonateDetails' });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <View style={styles.brandRow}>
            <Image source={LOCAL_IMAGES.logoMark} style={styles.logoMark} resizeMode="contain" />
            <View>
              <Text style={styles.brandName}>{APP_NAME}</Text>
              <Text style={styles.brandTagline}>Together, we change lives</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => rootNav()?.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textDark} />
            {unread > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroImageWrap}>
            <Image source={LOCAL_IMAGES.homeHero} style={styles.heroImageInner} />
          </View>
          <View style={styles.heroHeartBubble}>
            <Ionicons name="heart" size={18} color={COLORS.primary} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.welcomeLabel}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{firstName} 👋</Text>
            <Text style={styles.heroHeadline}>
              Small acts,{'\n'}<Text style={styles.heroHeadlineAccent}>big change.</Text>
            </Text>
            <Text style={styles.heroSub}>Give what you can,{'\n'}change a life today.</Text>
          </View>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroPrimaryBtn} onPress={() => navigate('DonateTab')} activeOpacity={0.9}>
              <Ionicons name="heart" size={16} color={COLORS.white} />
              <Text style={styles.heroPrimaryText}>Donate Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroSecondaryBtn} onPress={() => navigate('TrackDonation')} activeOpacity={0.9}>
              <Ionicons name="stats-chart" size={15} color={COLORS.primary} />
              <Text style={styles.heroSecondaryText}>Track Impact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* IMPACT STATS */}
        <View style={styles.statsCard}>
          {STAT_META.map((meta, i) => (
            <React.Fragment key={meta.key}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Ionicons name={meta.icon} size={20} color={meta.color} />
                <Text style={styles.statValue}>{stats ? stats[meta.key] : '—'}</Text>
                <Text style={styles.statLabel}>{meta.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionItem} onPress={() => navigate(action.screen)} activeOpacity={0.8}>
              <View style={[styles.actionCircle, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MY DONATIONS */}
        {recentDonations.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Donations</Text>
              <TouchableOpacity onPress={() => navigate('HistoryTab')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.donationRow}
              snapToInterval={296}
              decelerationRate="fast"
            >
              {recentDonations.map((d) => (
                <View key={d.id} style={styles.donationCardWrap}>
                  <DonationCard
                    donation={d}
                    compact
                    onPress={() => rootNav()?.navigate('DonationDetail', { id: d.id })}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* CATEGORIES */}
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Donate an item</Text>
            <Text style={styles.sectionSub}>Every item you give finds a new home.</Text>
          </View>
          <TouchableOpacity onPress={() => navigate('DonateTab')}>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catCard} onPress={() => startDonation(cat)} activeOpacity={0.8}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + '18' }]}>
                <Ionicons name={cat.icon as any} size={26} color={cat.color} />
              </View>
              <Text style={styles.catName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.catCard} onPress={() => navigate('DonateTab')} activeOpacity={0.8}>
            <View style={[styles.catIcon, { backgroundColor: COLORS.borderLight }]}>
              <Ionicons name="grid" size={24} color={COLORS.textMedium} />
            </View>
            <Text style={styles.catName}>More</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* PROGRAMS */}
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>What we do</Text>
            <Text style={styles.sectionSub}>Your donations power these programs.</Text>
          </View>
          <TouchableOpacity onPress={() => navigate('DonateTab')}>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.programRow} snapToInterval={276} decelerationRate="fast">
          {PROGRAMS.map((p) => (
            <TouchableOpacity key={p.title} style={styles.programCard} onPress={() => navigate('DonateTab')} activeOpacity={0.9}>
              <Image source={p.image} style={styles.programImage} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.programGradient} />
              <View style={styles.programIconBadge}>
                <Ionicons name={p.icon} size={15} color={COLORS.white} />
              </View>
              <View style={styles.programContent}>
                <Text style={styles.programTitle}>{p.title}</Text>
                <Text style={styles.programDesc} numberOfLines={2}>{p.desc}</Text>
                <Text style={styles.programTag}>{p.tag}</Text>
              </View>
              <View style={styles.programArrow}>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* OUR STORY */}
        <TouchableOpacity style={styles.storyCard} onPress={() => rootNav()?.navigate('AboutUs')} activeOpacity={0.9}>
          <View style={styles.storyTextWrap}>
            <Text style={styles.storyLabel}>Our Story 🌱</Text>
            <Text style={styles.storyBody} numberOfLines={3}>{ABOUT_INTRO}</Text>
            <View style={styles.storyLink}>
              <Text style={styles.storyLinkText}>Learn more about {APP_NAME}</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </View>
          </View>
          <Image source={LOCAL_IMAGES.splashChildren} style={styles.storyImage} />
        </TouchableOpacity>

        {/* GET STARTED CTA */}
        <TouchableOpacity style={styles.ctaBanner} onPress={() => navigate('DonateTab')} activeOpacity={0.9}>
          <View style={styles.ctaIconWrap}>
            <Ionicons name="heart" size={22} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Ready to make a difference?</Text>
            <Text style={styles.ctaSub}>Donate clothes, food, books & more in minutes.</Text>
          </View>
          <View style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  logoMark: { width: 40, height: 40 },
  brandName: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.textDark, letterSpacing: 0.2 },
  brandTagline: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium, marginTop: 1 },
  bellBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium },
  badge: { position: 'absolute', top: 11, right: 12, width: 9, height: 9, borderRadius: 5, backgroundColor: COLORS.error, borderWidth: 1.5, borderColor: COLORS.white },

  hero: { position: 'relative', paddingLeft: SPACING.lg, paddingTop: SPACING.md, minHeight: 328 },
  heroImageWrap: {
    position: 'absolute', top: 4, right: -20,
    width: '54%', height: 248,
    borderTopLeftRadius: 130, borderBottomLeftRadius: 130,
    borderTopRightRadius: 32, borderBottomRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#E8F3E8',
    ...SHADOWS.medium,
    zIndex: 0,
  },
  heroImageInner: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroHeartBubble: {
    position: 'absolute', top: 126, right: '50%',
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white,
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium, zIndex: 3,
  },
  heroText: { width: '48%', zIndex: 2 },
  welcomeLabel: { fontSize: FONT_SIZE.md, color: COLORS.textMedium },
  welcomeName: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark, marginBottom: SPACING.md },
  heroHeadline: { fontSize: 30, lineHeight: 34, fontWeight: '800', color: COLORS.textDark },
  heroHeadlineAccent: { color: COLORS.primary },
  heroSub: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginTop: SPACING.md, lineHeight: 20 },
  heroActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xl, paddingRight: SPACING.lg },
  heroPrimaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primary, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.round, ...SHADOWS.medium,
  },
  heroPrimaryText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.white },
  heroSecondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.round, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white,
  },
  heroSecondaryText: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },

  statsCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.lg,
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.large,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.borderLight },
  statValue: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.textDark },
  statLabel: { fontSize: 9, color: COLORS.textLight, textAlign: 'center' },

  actionsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, justifyContent: 'space-between', marginTop: SPACING.xl },
  actionItem: { alignItems: 'center', width: '23%' },
  actionCircle: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xs },
  actionLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textDark, fontWeight: '500' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark },
  sectionSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },
  seeAll: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },

  donationRow: { paddingHorizontal: SPACING.lg, gap: SPACING.md },
  donationCardWrap: { width: 284 },

  catRow: { paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xs },
  catCard: { width: 78, alignItems: 'center' },
  catIcon: { width: 58, height: 58, borderRadius: BORDER_RADIUS.lg, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xs },
  catName: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.textDark },

  programRow: { paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xs },
  programCard: { width: 260, height: 160, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', ...SHADOWS.medium },
  programImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  programGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  programIconBadge: { position: 'absolute', top: SPACING.md, left: SPACING.md, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(27,94,32,0.9)', alignItems: 'center', justifyContent: 'center' },
  programContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.md, paddingRight: 52 },
  programTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.white },
  programDesc: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.85)', marginTop: 2, lineHeight: 15 },
  programTag: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: '#A5D6A7', marginTop: SPACING.xs },
  programArrow: { position: 'absolute', bottom: SPACING.md, right: SPACING.md, width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },

  storyCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.xxl,
    backgroundColor: COLORS.primaryPale, borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.primaryLighter, overflow: 'hidden',
  },
  storyTextWrap: { flex: 1, padding: SPACING.lg },
  storyLabel: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.textDark },
  storyBody: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium, marginTop: SPACING.xs, lineHeight: 17 },
  storyLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  storyLinkText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  storyImage: { width: 110, height: 130, resizeMode: 'cover' },

  ctaBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    marginHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.sm,
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, ...SHADOWS.medium,
  },
  ctaIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  ctaTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.white },
  ctaSub: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round },
  ctaBtnText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
});
