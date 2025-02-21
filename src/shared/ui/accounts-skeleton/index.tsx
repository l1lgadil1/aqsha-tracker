import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/theme-context';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue, 
  withDelay
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = 100;
const NUMBER_OF_CARDS = 4;

export const AccountsSkeleton: React.FC = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
    header: {
      height: 120,
      marginBottom: 24,
      paddingTop: 16,
    },
    balanceLabel: {
      width: 100,
      height: 14,
      backgroundColor: colors.border,
      borderRadius: 7,
      marginBottom: 8,
    },
    balance: {
      width: 200,
      height: 32,
      backgroundColor: colors.border,
      borderRadius: 16,
    },
    card: {
      height: CARD_HEIGHT - 24,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardIcon: {
      width: 24,
      height: 24,
      backgroundColor: colors.border,
      borderRadius: 12,
      marginRight: 12,
    },
    cardTitle: {
      width: 120,
      height: 16,
      backgroundColor: colors.border,
      borderRadius: 8,
    },
    cardBalance: {
      width: 150,
      height: 20,
      backgroundColor: colors.border,
      borderRadius: 10,
    },
  });

  const createShimmerAnimation = (delay: number = 0) => {
    const opacity = useSharedValue(0.5);

    React.useEffect(() => {
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1000 }),
            withTiming(0.5, { duration: 1000 }),
          ),
          -1,
          true
        )
      );
    }, []);

    return useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));
  };

  const renderSkeletonCard = (index: number) => {
    const animatedStyle = createShimmerAnimation(index * 100);

    return (
      <Animated.View key={index} style={[styles.card, animatedStyle]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon} />
          <View style={styles.cardTitle} />
        </View>
        <View style={styles.cardBalance} />
      </Animated.View>
    );
  };

  const headerAnimation = createShimmerAnimation();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerAnimation]}>
        <View style={styles.balanceLabel} />
        <View style={styles.balance} />
      </Animated.View>
      {Array.from({ length: NUMBER_OF_CARDS }).map((_, index) => renderSkeletonCard(index))}
    </View>
  );
}; 