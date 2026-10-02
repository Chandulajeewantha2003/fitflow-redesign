import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './mainScreenStyles';

export default function NutritionScreen() {
  return (
    <>
      <Text style={styles.pageTitle}>Nutrition</Text>
      <View style={styles.empty}>
        <Ionicons name="restaurant-outline" size={40} color="#079455" />
        <Text style={styles.emptyTitle}>Nutrition support</Text>
        <Text style={styles.mutedCenter}>Meal planning and nutrition tracking will be available in a future update.</Text>
        <Text style={[styles.greenText, { marginTop: 16 }]}>Coming soon</Text>
      </View>
    </>
  );
}
