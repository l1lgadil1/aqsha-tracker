/**
 * Toast component
 * Provides a consistent toast notification system
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top' | 'bottom';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Toast component with consistent styling based on the application theme
 */
export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  position = 'bottom',
  duration = 3000,
  onClose,
  style,
  textStyle,
}) => {
  const { colors, spacing, shadows } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -20 : 20)).current;

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide toast after duration
      if (duration > 0) {
        hideTimeout = setTimeout(() => {
          hideToast();
        }, duration);
      }
    } else {
      // Hide toast
      hideToast();
    }

    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -20 : 20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  // Get background color based on toast type
  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
      default:
        return colors.info;
    }
  };

  const toastStyle: StyleProp<ViewStyle> = [
    styles.toast,
    {
      backgroundColor: getBackgroundColor(),
      ...shadows.md,
    },
    position === 'top' ? styles.topPosition : styles.bottomPosition,
    style,
  ];

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        toastStyle,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.message, { color: colors.textInverted }, textStyle]}>{message}</Text>
      <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
        <Text style={[styles.closeButtonText, { color: colors.textInverted }]}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  topPosition: {
    top: 60,
  },
  bottomPosition: {
    bottom: 60,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Toast;
