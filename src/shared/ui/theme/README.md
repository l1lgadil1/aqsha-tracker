# AqshaTracker Theme System

This directory contains the theme system for the AqshaTracker application. The theme system provides a consistent way to apply styling across the application based on the user's preferred theme (light, dark, or system).

## Components

- `ThemeProvider`: Provides theme context to the application
- `ThemeToggle`: A component that allows users to toggle between light, dark, and system themes

## Hooks

- `useTheme`: A hook that provides access to the current theme, including colors and theme mode

## Usage

### Wrapping your application with ThemeProvider

```tsx
import { ThemeProvider } from './src/shared/ui/theme';

export default function App() {
  return <ThemeProvider>{/* Your app components */}</ThemeProvider>;
}
```

### Using the theme in components

```tsx
import { useTheme } from './src/shared/ui/theme';

function MyComponent() {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.textPrimary }}>Hello, world!</Text>
    </View>
  );
}
```

### Adding the theme toggle to your UI

```tsx
import { ThemeToggle } from './src/shared/ui/theme';

function SettingsScreen() {
  return (
    <View>
      <Text>Theme Settings</Text>
      <ThemeToggle />
    </View>
  );
}
```

## Theme Colors

The theme system provides a set of colors for both light and dark themes. These colors are organized into categories:

- Primary colors
- Background colors
- Text colors
- UI element colors
- Status colors
- Income/Expense specific colors
- Chart colors
- Miscellaneous colors

See `src/shared/config/theme/colors.ts` for the complete list of colors.

## Utilities

The theme system also provides utilities for working with colors:

- `createThemedStyle`: Creates a themed style object
- `isLightColor`: Determines if a color is light or dark
- `getContrastTextColor`: Gets a contrasting text color based on the background color
- `applyAlpha`: Applies alpha transparency to a hex color

See `src/shared/lib/theme-utils.ts` for more details.
