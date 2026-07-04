import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const linking = {
  prefixes: ['manavsathi://', 'http://localhost:8081', 'https://manavsathis.com'],
  config: {
    screens: {
      AdminLogin: 'admin',
      AdminDashboard: 'admin/dashboard',
    },
  },
};

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
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  const initialRoute = user ? 'Main' : 'Splash';

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
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DonateProvider>
  );
}
