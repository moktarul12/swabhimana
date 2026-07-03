import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DonateCategoryScreen from '../screens/DonateCategoryScreen';
import DonateDetailsScreen from '../screens/DonateDetailsScreen';
import DonatePickupScreen from '../screens/DonatePickupScreen';
import DonateReviewScreen from '../screens/DonateReviewScreen';

const Stack = createNativeStackNavigator();

export default function DonateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DonateCategory" component={DonateCategoryScreen} />
      <Stack.Screen name="DonateDetails" component={DonateDetailsScreen} />
      <Stack.Screen name="DonatePickup" component={DonatePickupScreen} />
      <Stack.Screen name="DonateReview" component={DonateReviewScreen} />
    </Stack.Navigator>
  );
}
