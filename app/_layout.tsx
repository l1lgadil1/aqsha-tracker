import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider, useTheme } from '../src/shared/ui/theme';
import { LocalizationProvider } from '../src/shared/ui/localization';
import { initializeI18n } from '../src/shared/config/i18n';

export default function RootLayout() {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  // Initialize i18n when the app starts
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeI18n();
        setIsI18nInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // Fallback to initialized state even if there's an error
        setIsI18nInitialized(true);
      }
    };

    initialize();
  }, []);

  // Don't render anything until i18n is initialized
  if (!isI18nInitialized) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <LocalizationProvider>
          <View style={styles.container}>
            <BottomSheetModalProvider>
              <RootLayoutContent />
            </BottomSheetModalProvider>
          </View>
        </LocalizationProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutContent() {
  const { colors, isDarkMode } = useTheme();
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
        }}
      >
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
