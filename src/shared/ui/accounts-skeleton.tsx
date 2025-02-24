import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/theme-context';
import Animated, { FadeIn } from 'react-native-reanimated';

export function AccountsSkeleton() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      height: 80,
      backgroundColor: colors.surface,
      marginBottom: 16,
    },
    card: {
      height: 80,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
    },
  });

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={styles.container}
    >
      <View style={styles.header} />
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.card} />
      ))}
    </Animated.View>
  );
}

export function AccountDetailsSkeleton() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    accountName: {
      height: 32,
      width: '60%',
      backgroundColor: colors.surface,
      marginBottom: 8,
      borderRadius: 4,
    },
    balance: {
      height: 40,
      width: '40%',
      backgroundColor: colors.surface,
      borderRadius: 4,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      height: 24,
      width: '40%',
      backgroundColor: colors.surface,
      marginBottom: 16,
      borderRadius: 4,
    },
    transactionItem: {
      height: 64,
      backgroundColor: colors.surface,
      marginBottom: 12,
      borderRadius: 8,
    },
  });

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.accountName} />
        <View style={styles.balance} />
      </View>
      <View style={styles.section}>
        <View style={styles.sectionTitle} />
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.transactionItem} />
        ))}
      </View>
    </Animated.View>
  );
} 