import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/theme-context';
import { Text } from '../text';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AccountsGroupHeaderProps {
  title: string;
}

export const AccountsGroupHeader: React.FC<AccountsGroupHeaderProps> = ({ title }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 12,
      marginTop: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
  });

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
    </Animated.View>
  );
}; 