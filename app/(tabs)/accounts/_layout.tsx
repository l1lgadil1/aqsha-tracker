import { Stack } from 'expo-router';
import { useTheme } from '../../../src/shared/contexts/theme-context';

export default function AccountsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Счета',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Детали счета',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Редактировать счет',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
} 