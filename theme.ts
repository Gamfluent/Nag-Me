import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

// Our custom theme colors
const colors = {
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
  error: '#B3261E',
  success: '#4CAF50',
  warning: '#FFA000',
  background: '#FFFFFF',
  surface: '#FFFBFE',
  surfaceVariant: '#E7E0EC',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#FFFFFF',
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  // You can add custom fonts here if needed
  fonts: MD3LightTheme.fonts,
};

// For navigation theme consistency
export const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.onSurface,
    border: colors.surfaceVariant,
  },
};
