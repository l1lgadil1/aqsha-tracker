import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/shared/contexts/theme-context';
import { Fragment } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAppData } from '@/src/shared/hooks/use-app-data';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <View style={styles.container}>
          <BottomSheetModalProvider>
            <RootLayoutContent />
          </BottomSheetModalProvider>
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutContent() {
  const { colors, isDarkMode } = useTheme();
  useAppData();
  return (
    <Fragment>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});