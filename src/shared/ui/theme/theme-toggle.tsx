import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeContext } from './theme-context';
import { spacing, typography } from '../../config/theme';

interface ThemeToggleProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * A component that allows users to toggle between light, dark, and system themes
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { mode, setMode, colors } = useThemeContext();

  const toggleTheme = () => {
    // Cycle through the themes: system -> light -> dark -> system
    if (mode === 'system') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('system');
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.container, { borderColor: colors.border } as ViewStyle, style]}
    >
      <View style={styles.content}>
        <Text style={[styles.text, { color: colors.textPrimary } as TextStyle]}>
          {mode === 'system' ? 'System Theme' : mode === 'light' ? 'Light Theme' : 'Dark Theme'}
        </Text>
        <View
          style={[
            styles.indicator,
            {
              backgroundColor:
                mode === 'system'
                  ? colors.info
                  : mode === 'light'
                    ? colors.textPrimary
                    : colors.textPrimary,
            } as ViewStyle,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium as TextStyle['fontWeight'],
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

export default ThemeToggle;
