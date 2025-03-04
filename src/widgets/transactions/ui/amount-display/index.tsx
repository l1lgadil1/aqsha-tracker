import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransactionAmount } from '../../../../shared/types/transaction';
import { useTheme } from '../../../../shared/contexts/theme-context';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AmountDisplayProps {
  amount: TransactionAmount;
}

const DIGIT_HEIGHT = 56;

const AnimatedDigit: React.FC<{ digit: string; style: any }> = ({ digit, style }) => {
  const translateY = useSharedValue(DIGIT_HEIGHT);

  useEffect(() => {
    // Reset position to bottom
    translateY.value = DIGIT_HEIGHT;
    // Animate to center
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.digitWrapper}>
      <Animated.Text style={[style, animatedStyle, styles.digit]}>{digit}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  digitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  digitWrapper: {
    height: DIGIT_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    height: DIGIT_HEIGHT,
    lineHeight: DIGIT_HEIGHT,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  staticDigits: {
    height: DIGIT_HEIGHT,
    lineHeight: DIGIT_HEIGHT,
    includeFontPadding: false,
  },
});

export const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount }) => {
  const { colors } = useTheme();

  const formattedAmount = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount.value || '0'));

  const dynamicStyles = StyleSheet.create({
    currency: {
      fontSize: 28,
      color: amount.value.length === 0 ? colors.textSecondary : colors.textPrimary,
      fontWeight: '500',
      height: DIGIT_HEIGHT,
      lineHeight: DIGIT_HEIGHT,
      includeFontPadding: false,
    },
    amount: {
      fontSize: 56,
      fontWeight: '700',
      color: amount.value.length === 0 ? colors.textSecondary : colors.textPrimary,
      letterSpacing: -1,
      height: DIGIT_HEIGHT,
      lineHeight: DIGIT_HEIGHT,
      includeFontPadding: false,
    },
    decimal: {
      fontSize: 32,
      fontWeight: '600',
      color: colors.textSecondary,
      height: DIGIT_HEIGHT,
      lineHeight: DIGIT_HEIGHT,
      includeFontPadding: false,
    },
    separator: {
      fontSize: 56,
      fontWeight: '700',
      color: colors.textSecondary,
      height: DIGIT_HEIGHT,
      lineHeight: DIGIT_HEIGHT,
      includeFontPadding: false,
      marginHorizontal: -2,
    },
  });

  const [wholePart, decimalPart] = formattedAmount.split(',');
  const wholeDigits = wholePart.split('');
  const lastWholeDigit = wholeDigits[wholeDigits.length - 1];
  const otherWholeDigits = wholeDigits.slice(0, -1);

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <View style={styles.amountContainer}>
        <Text style={dynamicStyles.currency}>{amount.currency}</Text>
        <View style={styles.digitContainer}>
          <Text style={[dynamicStyles.amount, styles.staticDigits]}>{wholeDigits.join('')}</Text>
          {/* <AnimatedDigit 
            digit={lastWholeDigit} 
            style={dynamicStyles.amount}
          /> */}
        </View>
        {/* <Text style={dynamicStyles.separator}>,</Text> */}
        {/* <Text style={dynamicStyles.decimal}>{decimalPart || '00'}</Text> */}
      </View>
    </Animated.View>
  );
};
