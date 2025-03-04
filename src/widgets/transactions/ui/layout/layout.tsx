import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useTheme } from '../../../../shared/contexts/theme-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface IProps {
  modals: ReactNode;
  segmentedControl: ReactNode;
  amountDisplay: ReactNode;
  accountSelector: ReactNode;
  numericKeypad: ReactNode;
}

export const Layout = ({
  modals,
  segmentedControl,
  amountDisplay,
  accountSelector,
  numericKeypad,
}: IProps) => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    topSection: {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      backgroundColor: colors.background,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      paddingBottom: 24,
      marginBottom: 16,
    },
    segmentedControlContainer: {
      alignItems: 'center',
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    amountContainer: {
      paddingHorizontal: 16,
    },
    accountSelectorContainer: {
      marginTop: 16,
      marginBottom: 32,
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    keypadSection: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: Platform.OS === 'ios' ? 16 : 24,
      backgroundColor: 'transparent',
    },
  });

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Animated.View entering={FadeInDown.duration(300)} style={styles.topSection}>
              <View style={styles.segmentedControlContainer}>{segmentedControl}</View>
              <View style={styles.amountContainer}>{amountDisplay}</View>
              <View style={styles.accountSelectorContainer}>{accountSelector}</View>
            </Animated.View>
            <Animated.View entering={FadeInUp.duration(300)} style={styles.keypadSection}>
              {numericKeypad}
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
      {modals}
    </>
  );
};
