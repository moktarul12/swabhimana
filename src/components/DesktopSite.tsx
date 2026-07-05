import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LOCAL_IMAGES } from '../constants/images';
import {
  APP_NAME,
  APP_TAGLINE,
  APP_URL,
  MOTTO,
  VISION,
  MISSION,
  ABOUT_INTRO,
  ABOUT_PARAGRAPHS,
  ABOUT_PILLARS,
  ABOUT_VALUES,
  CONTACT,
} from '../constants/branding';
import { DesktopLoginModal } from './DesktopLoginModal';

const IMPACT_STATS = [
  { value: '850+', label: 'Volunteers', icon: 'people' as const, color: '#1B5E20' },
  { value: '8,320+', label: 'Families Helped', icon: 'home' as const, color: '#E65100' },
  { value: '18,750+', label: 'Items Donated', icon: 'cube' as const, color: '#7B1FA2' },
  { value: '6,980+', label: 'Lives Touched', icon: 'heart' as const, color: '#00897B' },
];

const PROGRAMS = [
  { image: LOCAL_IMAGES.programFood, title: 'Food Distribution', stat: '8,300+ meals served', icon: 'restaurant' as const },
  { image: LOCAL_IMAGES.programClothing, title: 'Clothing Drive', stat: '12,000+ items given', icon: 'shirt' as const },
  { image: LOCAL_IMAGES.programEducation, title: 'Education Support', stat: '5,600+ children helped', icon: 'school' as const },
];

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'programs', label: 'Programs' },
  { id: 'vision', label: 'Vision' },
  { id: 'contact', label: 'Contact' },
];

function scrollTo(id: string) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function goVolunteer() {
  if (typeof window !== 'undefined') window.location.href = '/volunteer';
}

export function DesktopSite() {
  const [navHover, setNavHover] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState<'donor' | 'volunteer' | 'admin'>('donor');

  const openLogin = (tab: 'donor' | 'volunteer' | 'admin' = 'donor') => {
    setLoginTab(tab);
    setShowLogin(true);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.rootContent} showsVerticalScrollIndicator={false}>
      {/* NAV */}
      <View style={styles.nav}>
        <View style={styles.navInner}>
          <View style={styles.navBrand}>
            <Image source={LOCAL_IMAGES.logoMark} style={styles.navLogo} resizeMode="contain" />
            <View>
              <Text style={styles.navBrandName}>{APP_NAME}</Text>
              <Text style={styles.navBrandTag}>{APP_TAGLINE}</Text>
            </View>
          </View>
          <View style={styles.navLinks}>
            {NAV_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.navLink, navHover === item.id && styles.navLinkHover]}
                onPress={() => scrollTo(item.id)}
                {...(Platform.OS === 'web' ? {
                  onMouseEnter: () => setNavHover(item.id),
                  onMouseLeave: () => setNavHover(null),
                } as any : {})}
              >
                <Text style={styles.navLinkText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.navLoginBtn} onPress={() => openLogin('donor')}>
              <Ionicons name="log-in-outline" size={16} color={COLORS.primary} />
              <Text style={styles.navLoginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navAdminBtn} onPress={() => openLogin('admin')}>
              <Ionicons name="shield-outline" size={16} color={COLORS.white} />
              <Text style={styles.navAdminText}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* HERO */}
      <LinearGradient colors={['#F1F8F1', '#FFFFFF', '#E8F5E9']} style={styles.hero}>
        <View style={styles.heroInner}>
          <View style={styles.heroCopy}>
            <View style={styles.heroBadge}>
              <Ionicons name="leaf" size={14} color={COLORS.primary} />
              <Text style={styles.heroBadgeText}>Social Impact Platform</Text>
            </View>
            <Text style={styles.heroTitle}>
              Small acts,{'\n'}
              <Text style={styles.heroTitleAccent}>big change.</Text>
            </Text>
            <Text style={styles.heroSub}>{ABOUT_INTRO}</Text>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.heroPrimaryBtn} onPress={() => openLogin('donor')}>
                <Ionicons name="log-in-outline" size={18} color={COLORS.white} />
                <Text style={styles.heroPrimaryText}>Login to Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroGhostBtn} onPress={() => scrollTo('about')}>
                <Text style={styles.heroGhostText}>Learn More</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.heroVisual}>
            <View style={styles.heroImageWrap}>
              <Image source={LOCAL_IMAGES.homeHero} style={styles.heroImage} resizeMode="cover" />
            </View>
            <View style={styles.heroFloatCard}>
              <Ionicons name="heart" size={22} color={COLORS.primary} />
              <Text style={styles.heroFloatValue}>6,980+</Text>
              <Text style={styles.heroFloatLabel}>Lives touched</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* STATS */}
      <View style={styles.statsSection}>
        <View style={styles.statsInner}>
          {IMPACT_STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ABOUT */}
      <View nativeID="about" style={styles.section}>
        <View style={styles.sectionInner}>
          <View style={styles.aboutGrid}>
            <View style={styles.aboutImageCol}>
              <Image source={LOCAL_IMAGES.splashChildren} style={styles.aboutImage} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={styles.aboutImageOverlay} />
              <View style={styles.aboutImageCaption}>
                <Text style={styles.aboutImageCaptionTitle}>Building hope together</Text>
                <Text style={styles.aboutImageCaptionSub}>Every contribution creates a ripple</Text>
              </View>
            </View>
            <View style={styles.aboutTextCol}>
              <Text style={styles.sectionEyebrow}>About Us</Text>
              <Text style={styles.sectionTitle}>Kindness that reaches the right people</Text>
              {ABOUT_PARAGRAPHS.slice(0, 3).map((para, i) => (
                <Text key={i} style={styles.bodyText}>{para}</Text>
              ))}
              <View style={styles.valuesRow}>
                {ABOUT_VALUES.map((v) => (
                  <View key={v.label} style={styles.valueChip}>
                    <Ionicons name={v.icon} size={16} color={COLORS.primary} />
                    <Text style={styles.valueChipText}>{v.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* PROGRAMS */}
      <View nativeID="programs" style={styles.sectionAlt}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>What We Do</Text>
            <Text style={styles.sectionTitle}>Programs that create lasting impact</Text>
            <Text style={styles.sectionSub}>
              From food and clothing to education and emergency aid — we connect compassion with action.
            </Text>
          </View>
          <View style={styles.programCards}>
            {PROGRAMS.map((p) => (
              <View key={p.title} style={styles.programCard}>
                <Image source={p.image} style={styles.programImage} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={styles.programOverlay} />
                <View style={styles.programContent}>
                  <View style={styles.programIcon}>
                    <Ionicons name={p.icon} size={20} color={COLORS.white} />
                  </View>
                  <Text style={styles.programTitle}>{p.title}</Text>
                  <Text style={styles.programStat}>{p.stat}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.pillarGrid}>
            {ABOUT_PILLARS.map((p) => (
              <View key={p.title} style={styles.pillarCard}>
                <View style={styles.pillarIcon}>
                  <Ionicons name={p.icon} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.pillarTitle}>{p.title}</Text>
                <Text style={styles.pillarDesc}>{p.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* VISION / MISSION */}
      <View nativeID="vision" style={styles.section}>
        <View style={styles.sectionInner}>
          <View style={styles.vmGrid}>
            <LinearGradient colors={['#1B5E20', '#2E7D32']} style={styles.vmCardDark}>
              <Ionicons name="eye-outline" size={32} color={COLORS.white} />
              <Text style={styles.vmTitleLight}>Our Vision</Text>
              <Text style={styles.vmBodyLight}>{VISION}</Text>
            </LinearGradient>
            <View style={styles.vmCardLight}>
              <Ionicons name="rocket-outline" size={32} color={COLORS.primary} />
              <Text style={styles.vmTitleDark}>Our Mission</Text>
              <Text style={styles.vmBodyDark}>{MISSION}</Text>
            </View>
          </View>
          <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.mottoBanner}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color={COLORS.primary} />
            <Text style={styles.mottoText}>{MOTTO}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* CONTACT */}
      <View nativeID="contact" style={styles.sectionAlt}>
        <View style={styles.sectionInner}>
          <View style={styles.contactGrid}>
            <View style={styles.contactIntro}>
              <Text style={styles.sectionEyebrow}>Contact</Text>
              <Text style={styles.sectionTitle}>Let's make a difference together</Text>
              <Text style={styles.bodyText}>
                Reach out to volunteer, partner, or learn how you can support communities through ManavSathi.
              </Text>
              <TouchableOpacity style={styles.websiteBtn} onPress={() => Linking.openURL(APP_URL)}>
                <Ionicons name="globe-outline" size={18} color={COLORS.white} />
                <Text style={styles.websiteBtnText}>ManavSathis.com</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contactCards}>
              <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL(`tel:+91${CONTACT.phoneRaw}`)}>
                <View style={styles.contactCardIcon}><Ionicons name="call" size={22} color={COLORS.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactCardLabel}>Phone</Text>
                  <Text style={styles.contactCardValue}>{CONTACT.phone}</Text>
                  <Text style={styles.contactCardHint}>{CONTACT.name}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL(`mailto:${CONTACT.email}`)}>
                <View style={styles.contactCardIcon}><Ionicons name="mail" size={22} color={COLORS.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactCardLabel}>Email</Text>
                  <Text style={styles.contactCardValue}>{CONTACT.email}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactCard}
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}`)}
              >
                <View style={styles.contactCardIcon}><Ionicons name="location" size={22} color={COLORS.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactCardLabel}>Visit Us</Text>
                  <Text style={styles.contactCardValue}>{CONTACT.address}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View style={styles.footerBrand}>
            <Image source={LOCAL_IMAGES.logoMark} style={styles.footerLogo} resizeMode="contain" />
            <View>
              <Text style={styles.footerBrandName}>{APP_NAME}</Text>
              <Text style={styles.footerTag}>{APP_TAGLINE}</Text>
            </View>
          </View>
          <View style={styles.footerLinks}>
            {NAV_ITEMS.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => scrollTo(item.id)}>
                <Text style={styles.footerLink}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={goVolunteer}>
              <Text style={styles.footerLink}>Volunteer Portal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLogin('admin')}>
              <Text style={styles.footerLink}>Admin</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerCopy}>
            © {new Date().getFullYear()} {APP_NAME}. {MOTTO}
          </Text>
        </View>
      </View>

      <DesktopLoginModal visible={showLogin} onClose={() => setShowLogin(false)} initialTab={loginTab} />
    </ScrollView>
  );
}

const MAX_W = 1200;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.white },
  rootContent: { minHeight: '100vh' as any },

  nav: {
    position: 'sticky' as any,
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' as any } : {}),
  },
  navInner: {
    maxWidth: MAX_W,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.lg,
  },
  navBrand: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  navLogo: { width: 44, height: 44 },
  navBrandName: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.textDark },
  navBrandTag: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  navLink: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round },
  navLinkHover: { backgroundColor: COLORS.primaryPale },
  navLinkText: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  navLoginBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.round, borderWidth: 1.5, borderColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  navLoginText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  navAdminBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.round, marginLeft: SPACING.sm,
  },
  navAdminText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.white },

  hero: { paddingTop: SPACING.xxxl, paddingBottom: SPACING.xxxl * 2 },
  heroInner: {
    maxWidth: MAX_W, width: '100%', alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xxxl, gap: SPACING.xxxl,
  },
  heroCopy: { flex: 1, maxWidth: 540 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderRadius: BORDER_RADIUS.round, marginBottom: SPACING.lg, ...SHADOWS.small,
  },
  heroBadgeText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },
  heroTitle: { fontSize: 56, lineHeight: 62, fontWeight: '800', color: COLORS.textDark },
  heroTitleAccent: { color: COLORS.primary },
  heroSub: { fontSize: FONT_SIZE.xl, color: COLORS.textMedium, lineHeight: 30, marginTop: SPACING.lg },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.xxxl },
  heroPrimaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.round, ...SHADOWS.medium,
  },
  heroPrimaryText: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.white },
  heroGhostBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.round, borderWidth: 1.5, borderColor: COLORS.primary,
  },
  heroGhostText: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.primary },
  heroVisual: { flex: 1, alignItems: 'center', position: 'relative', minHeight: 380 },
  heroImageWrap: {
    width: '100%', maxWidth: 480, height: 360,
    borderTopLeftRadius: 180, borderBottomLeftRadius: 180,
    borderTopRightRadius: 40, borderBottomRightRadius: 40,
    overflow: 'hidden', backgroundColor: '#E8F3E8', ...SHADOWS.large,
  },
  heroImage: { width: '100%', height: '100%' },
  heroFloatCard: {
    position: 'absolute', bottom: 24, left: -20,
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, alignItems: 'center', minWidth: 120, ...SHADOWS.large,
  },
  heroFloatValue: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.textDark, marginTop: 4 },
  heroFloatLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium, marginTop: 2 },

  statsSection: { marginTop: -48, paddingHorizontal: SPACING.xxxl, zIndex: 2 },
  statsInner: {
    maxWidth: MAX_W, width: '100%', alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl, paddingVertical: SPACING.xxl, paddingHorizontal: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.large,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 6 },
  statIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.textDark },
  statLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, textAlign: 'center' },
  statDivider: { width: 1, height: 56, backgroundColor: COLORS.borderLight },

  section: { paddingVertical: SPACING.xxxl * 2, paddingHorizontal: SPACING.xxxl },
  sectionAlt: { paddingVertical: SPACING.xxxl * 2, paddingHorizontal: SPACING.xxxl, backgroundColor: '#F8FAF8' },
  sectionInner: { maxWidth: MAX_W, width: '100%', alignSelf: 'center' },
  sectionHeader: { marginBottom: SPACING.xxxl, maxWidth: 640 },
  sectionEyebrow: {
    fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: FONT_SIZE.mega, fontWeight: '800', color: COLORS.textDark, lineHeight: 48, marginBottom: SPACING.md },
  sectionSub: { fontSize: FONT_SIZE.lg, color: COLORS.textMedium, lineHeight: 28 },
  bodyText: { fontSize: FONT_SIZE.lg, color: COLORS.textMedium, lineHeight: 28, marginBottom: SPACING.lg },

  aboutGrid: { flexDirection: 'row', gap: SPACING.xxxl, alignItems: 'center' },
  aboutImageCol: { flex: 1, height: 420, borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', position: 'relative' },
  aboutImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  aboutImageOverlay: { ...StyleSheet.absoluteFill },
  aboutImageCaption: { position: 'absolute', bottom: SPACING.xl, left: SPACING.xl, right: SPACING.xl },
  aboutImageCaptionTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.white },
  aboutImageCaptionSub: { fontSize: FONT_SIZE.md, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  aboutTextCol: { flex: 1 },
  valuesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  valueChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  valueChipText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },

  programCards: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.xxxl },
  programCard: { flex: 1, height: 280, borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', position: 'relative' },
  programImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  programOverlay: { ...StyleSheet.absoluteFill },
  programContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg },
  programIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
  },
  programTitle: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.white },
  programStat: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.9)', marginTop: 4 },

  pillarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  pillarCard: {
    width: '31%', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  pillarIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLighter,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  pillarTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark },
  pillarDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 6, lineHeight: 20 },

  vmGrid: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.xxxl },
  vmCardDark: { flex: 1, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xxxl, ...SHADOWS.medium },
  vmCardLight: {
    flex: 1, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xxxl,
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.medium,
  },
  vmTitleLight: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.white, marginTop: SPACING.lg, marginBottom: SPACING.md },
  vmBodyLight: { fontSize: FONT_SIZE.lg, color: 'rgba(255,255,255,0.92)', lineHeight: 28 },
  vmTitleDark: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.textDark, marginTop: SPACING.lg, marginBottom: SPACING.md },
  vmBodyDark: { fontSize: FONT_SIZE.lg, color: COLORS.textMedium, lineHeight: 28 },
  mottoBanner: {
    borderRadius: BORDER_RADIUS.xl, padding: SPACING.xxl,
    flexDirection: 'row', alignItems: 'center', gap: SPACING.lg,
  },
  mottoText: { flex: 1, fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.primary, fontStyle: 'italic', lineHeight: 30 },

  contactGrid: { flexDirection: 'row', gap: SPACING.xxxl },
  contactIntro: { flex: 1, maxWidth: 420 },
  websiteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, alignSelf: 'flex-start',
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round, marginTop: SPACING.lg,
  },
  websiteBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZE.md },
  contactCards: { flex: 1, gap: SPACING.md },
  contactCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.lg,
    backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  contactCardIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLighter,
    alignItems: 'center', justifyContent: 'center',
  },
  contactCardLabel: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.8 },
  contactCardValue: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.textDark, marginTop: 4, lineHeight: 24 },
  contactCardHint: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },

  footer: { backgroundColor: '#0D3B12', paddingVertical: SPACING.xxxl * 2, paddingHorizontal: SPACING.xxxl },
  footerInner: { maxWidth: MAX_W, width: '100%', alignSelf: 'center' },
  footerBrand: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xxl },
  footerLogo: { width: 48, height: 48 },
  footerBrandName: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.white },
  footerTag: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  footerLinks: { flexDirection: 'row', gap: SPACING.xxl, marginBottom: SPACING.xxl },
  footerLink: { fontSize: FONT_SIZE.md, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  footerCopy: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.5)', lineHeight: 22 },
});
