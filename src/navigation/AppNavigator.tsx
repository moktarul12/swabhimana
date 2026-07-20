import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, getStateFromPath as defaultGetStateFromPath } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { DonateProvider } from '../context/DonateContext';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import DonateStack from './DonateStack';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import ImpactScreen from '../screens/ImpactScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DonationTrackingScreen from '../screens/DonationTrackingScreen';
import DonationDetailScreen from '../screens/DonationDetailScreen';
import DonationPhotosScreen from '../screens/DonationPhotosScreen';
import StoriesScreen from '../screens/StoriesScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MoreScreen from '../screens/MoreScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import MyAddressesScreen from '../screens/MyAddressesScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import InfoContentScreen from '../screens/InfoContentScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import VolunteerLoginScreen from '../screens/VolunteerLoginScreen';
import VolunteerDashboardScreen from '../screens/VolunteerDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const linking = {
  prefixes: [
    'manavsathi://',
    'http://localhost:8081',
    'https://manavsathi.com',
    'https://www.manavsathi.com',
    'https://manavsathis.com',
    'https://manavsathi-render.onrender.com',
  ],
  config: {
    screens: {
      Welcome: '',
      Splash: 'splash',
      Login: 'login',
      SignUp: 'signup',
      Main: {
        path: 'app',
        screens: {
          HomeTab: 'home',
          DonateTab: 'donate',
          HistoryTab: 'history',
          ImpactTab: 'impact',
          ProfileTab: 'profile',
        },
      },
      AdminLogin: 'admin',
      AdminDashboard: 'admin/dashboard',
      VolunteerLogin: 'volunteer',
      VolunteerDashboard: 'volunteer/dashboard',
      AboutUs: 'about',
      Stories: 'stories',
      TrackDonation: 'track',
      HelpSupport: 'help',
      More: 'more',
    },
  },
  getStateFromPath(path: string, options: any) {
    const clean = path.replace(/^\//, '').replace(/\/$/, '');
    // `/` and `/welcome` → Welcome concept page
    if (clean === '' || clean === 'welcome') {
      return { routes: [{ name: 'Welcome' }] };
    }
    return defaultGetStateFromPath(path, options);
  },
};

function getWebPath(): string {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return '';
  return window.location.pathname || '/';
}

function resolveInitialRoute(user: unknown, isGuest: boolean): string {
  if (Platform.OS === 'web') {
    const path = getWebPath();
    if (path.startsWith('/app')) return user || isGuest ? 'Main' : 'Welcome';
    if (path.startsWith('/admin/dashboard')) return 'AdminDashboard';
    if (path.startsWith('/admin')) return 'AdminLogin';
    if (path.startsWith('/volunteer/dashboard')) return 'VolunteerDashboard';
    if (path.startsWith('/volunteer')) return 'VolunteerLogin';
    if (path.startsWith('/login')) return 'Login';
    if (path.startsWith('/signup')) return 'SignUp';
    if (path.startsWith('/about')) return 'AboutUs';
    if (path.startsWith('/stories')) return 'Stories';
    // `/`, `/welcome`, and other marketing paths → Welcome concept page
    return 'Welcome';
  }
  return user || isGuest ? 'Main' : 'Splash';
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'DonateTab') iconName = focused ? 'hand-left' : 'hand-left-outline';
          else if (route.name === 'HistoryTab') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'ImpactTab') iconName = focused ? 'globe' : 'globe-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: { height: 60, paddingBottom: 6, paddingTop: 6, borderTopColor: COLORS.borderLight, backgroundColor: COLORS.white },
        tabBarLabelStyle: { fontSize: FONT_SIZE.xs, fontWeight: '500' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="DonateTab" component={DonateStack} options={{ title: 'Donate' }} />
      <Tab.Screen name="HistoryTab" component={MyDonationsScreen} options={{ title: 'History' }} />
      <Tab.Screen name="ImpactTab" component={ImpactScreen} options={{ title: 'Impact' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isGuest, isLoading } = useAuth();
  if (isLoading) return null;
  const initialRoute = resolveInitialRoute(user, isGuest);

  return (
    <DonateProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="TrackDonation" component={DonationTrackingScreen} />
          <Stack.Screen name="DonationDetail" component={DonationDetailScreen} />
          <Stack.Screen name="DonationPhotos" component={DonationPhotosScreen} />
          <Stack.Screen name="Stories" component={StoriesScreen} />
          <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="More" component={MoreScreen} />
          <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
          <Stack.Screen name="MyAddresses" component={MyAddressesScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="InfoContent" component={InfoContentScreen} />
          <Stack.Screen name="AboutUs" component={AboutUsScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="VolunteerLogin" component={VolunteerLoginScreen} />
          <Stack.Screen name="VolunteerDashboard" component={VolunteerDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DonateProvider>
  );
}
