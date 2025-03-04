import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { TransactionType } from '../../../../shared/types/transaction';
import { useTheme } from '../../../../shared/contexts/theme-context';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface NumericKeypadProps {
  amount: {
    value: string;
    hasDecimal: boolean;
  };
  onNumberPress: (num: string) => void;
  onConfirmPress: () => void;
  onDeletePress: () => void;
  onClearAmount: () => void;
  type: TransactionType;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const KEY_SIZE = Math.min((SCREEN_WIDTH - 128) / 3, 80); // 32px padding on each side, 3 columns, max 80px

const AnimatedKey: React.FC<{
  value: string | number;
  onPress: () => void;
  style: any;
  textStyle: any;
}> = ({ value, onPress, style, textStyle }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSequence(
        withTiming(0.9, { duration: 50 }),
        withTiming(1, { duration: 100 }),
      );
      opacity.value = withTiming(0.7, { duration: 50 });
    })
    .onFinalize(() => {
      scale.value = withTiming(1, { duration: 100 });
      opacity.value = withTiming(1, { duration: 100 });
      runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, animatedStyle]}>
        <Text style={textStyle}>{value}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onNumberPress,
  onConfirmPress,
  onDeletePress,
  onClearAmount,
  type,
  amount,
}) => {
  const { colors, isDarkMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingHorizontal: 32,
      paddingBottom: Platform.OS === 'ios' ? 16 : 24,
    },
    grid: {
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    key: {
      width: KEY_SIZE,
      height: KEY_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: KEY_SIZE / 2,
      backgroundColor: isDarkMode ? colors.surface : colors.background,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: isDarkMode ? 4 : 2,
        },
      }),
    },
    keyText: {
      fontSize: 28,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    bottomButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 8,
    },
    confirmButton: {
      backgroundColor: amount.value.length > 0 ? colors.primary : colors.gray300,
      borderRadius: 35,
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    confirmText: {
      color: colors.background,
      fontSize: 32,
    },
    actionButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.surface : colors.background,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: isDarkMode ? 4 : 2,
        },
      }),
    },
    actionButtonText: {
      fontSize: 24,
      color: colors.textSecondary,
    },
  });

  const renderKey = (value: string | number, onPress: () => void) => (
    <AnimatedKey value={value} onPress={onPress} style={styles.key} textStyle={styles.keyText} />
  );

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <View style={styles.grid}>
        <View style={styles.row}>
          {renderKey('1', () => onNumberPress('1'))}
          {renderKey('2', () => onNumberPress('2'))}
          {renderKey('3', () => onNumberPress('3'))}
        </View>
        <View style={styles.row}>
          {renderKey('4', () => onNumberPress('4'))}
          {renderKey('5', () => onNumberPress('5'))}
          {renderKey('6', () => onNumberPress('6'))}
        </View>
        <View style={styles.row}>
          {renderKey('7', () => onNumberPress('7'))}
          {renderKey('8', () => onNumberPress('8'))}
          {renderKey('9', () => onNumberPress('9'))}
        </View>
        <View style={[styles.row, { justifyContent: 'center' }]}>
          {/* {renderKey('.', onDecimalPress)} */}
          {renderKey('0', () => onNumberPress('0'))}
          {/* {renderKey('÷', onDividePress)} */}
        </View>
      </View>

      {amount.value.length > 0 ? (
        <View style={styles.bottomButtons}>
          <View style={{ width: 50 }} />
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirmPress}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onDeletePress}
            onLongPress={onClearAmount}
            delayLongPress={500}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>⌫</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomButtons}>
          <View style={{ width: 50 }} />
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirmPress}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmText}>✓</Text>
          </TouchableOpacity>
          <View style={{ width: 50 }} />
        </View>
      )}
    </Animated.View>
  );
};
