import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/theme-context';
import { Text } from '../text';
import { formatAmount } from '../../utils/format';
import { Account } from '../../types/account';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const QUICK_ACTIONS_WIDTH = 120;

interface AccountCardProps {
  account: Account;
  onPress?: (account: Account) => void;
  onTransfer?: (account: Account) => void;
  onEdit?: (account: Account) => void;
  index?: number;
}

export const AccountCard: React.FC<AccountCardProps> = ({ 
  account, 
  onPress,
  onTransfer,
  onEdit,
  index = 0 
}) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const context = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = translateX.value;
    })
    .onUpdate((event) => {
      const newValue = context.value + event.translationX;
      translateX.value = Math.min(0, Math.max(-QUICK_ACTIONS_WIDTH, newValue));
    })
    .onEnd((event) => {
      if (event.velocityX < -500 || translateX.value < -QUICK_ACTIONS_WIDTH / 2) {
        translateX.value = withSpring(-QUICK_ACTIONS_WIDTH);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getAccountIcon = () => {
    switch (account.type) {
      case 'cash':
        return 'cash-outline';
      case 'card':
        return 'card-outline';
      default:
        return 'wallet-outline';
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
      height: 100,
    },
    cardContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    nameContainer: {
      flex: 1,
    },
    balanceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    quickActions: {
      position: 'absolute',
      right: 0,
      height: '100%',
      width: QUICK_ACTIONS_WIDTH,
      flexDirection: 'row',
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      overflow: 'hidden',
    },
    actionButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    transferButton: {
      backgroundColor: colors.primary,
    },
    editButton: {
      backgroundColor: colors.secondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.quickActions}>
        <Pressable 
          style={[styles.actionButton, styles.transferButton]}
          onPress={() => onTransfer?.(account)}
        >
          <Ionicons name="swap-horizontal" size={24} color={colors.white} />
          <Text variant="caption" color={colors.white}>Перевод</Text>
        </Pressable>
        <Pressable 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit?.(account)}
        >
          <Ionicons name="pencil" size={24} color={colors.white} />
          <Text variant="caption" color={colors.white}>Изменить</Text>
        </Pressable>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View 
          entering={FadeInRight.delay(index * 100).duration(300)}
          style={[styles.cardContainer, animatedStyle]}
        >
          <Pressable onPress={() => onPress?.(account)}>
            <View style={styles.header}>
              <View style={styles.icon}>
                <Ionicons 
                  name={getAccountIcon()} 
                  size={24} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.nameContainer}>
                <Text variant="h3">{account.name}</Text>
                <Text variant="body2">{account.type}</Text>
              </View>
            </View>
            <View style={styles.balanceRow}>
              <Text variant="h2">
                {formatAmount(account.balance)}
              </Text>
              <Text variant="body2" style={{ marginLeft: 8 }}>
                {account.currency || '₸'}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}; 