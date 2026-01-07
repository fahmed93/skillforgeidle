/**
 * Toast Component
 *
 * Displays an individual toast notification with animations.
 * Supports different toast types with unique styling and auto-dismissal.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import type { ToastNotification } from '../types';
import { ToastType } from '../types';

// Constants for layout
const TOAST_STACK_OFFSET = 68; // Vertical spacing between stacked toasts
const TOAST_BOTTOM_MARGIN = 16; // Margin from bottom of screen
const TOAST_HORIZONTAL_PADDING = 16; // Internal padding for toast content
const TOAST_SIDE_MARGIN = 16; // Minimum margin from screen edges

interface ToastProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
  index: number;
}

export const Toast: React.FC<ToastProps> = ({
  notification,
  onDismiss,
  index,
}) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDismiss = useCallback(() => {
    // Exit animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(notification.id);
    });
  }, [translateY, opacity, onDismiss, notification.id]);

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss timer
    dismissTimerRef.current = setTimeout(() => {
      handleDismiss();
    }, notification.duration || 3500);

    // Cleanup
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [translateY, opacity, handleDismiss, notification.duration]);

  const getToastStyle = () => {
    switch (notification.type) {
      case ToastType.LEVEL_UP:
        return styles.levelUpToast;
      case ToastType.XP_GAIN:
        return styles.xpGainToast;
      case ToastType.ITEM_GAIN:
        return styles.itemGainToast;
      case ToastType.ACTIVITY_UNLOCK:
        return styles.activityUnlockToast;
      default:
        return styles.defaultToast;
    }
  };

  const getTextStyle = () => {
    switch (notification.type) {
      case ToastType.LEVEL_UP:
        return styles.levelUpText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getToastStyle(),
        {
          opacity,
          transform: [
            { translateY },
            { translateY: -index * TOAST_STACK_OFFSET }, // Negative to stack upward
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleDismiss}
        style={styles.touchable}
      >
        <View style={styles.content}>
          {notification.icon && (
            <Text style={styles.icon}>{notification.icon}</Text>
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.message, getTextStyle()]}>
              {notification.message}
            </Text>
            {notification.details && notification.details.length > 0 && (
              <View style={styles.detailsContainer}>
                {notification.details.map((detail, idx) => (
                  <Text key={idx} style={[styles.detail, getTextStyle()]}>
                    {detail}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: TOAST_BOTTOM_MARGIN,
    alignSelf: 'center',
    maxWidth: width - (TOAST_SIDE_MARGIN * 2),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  touchable: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: TOAST_HORIZONTAL_PADDING,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsContainer: {
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  defaultToast: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  xpGainToast: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  levelUpToast: {
    backgroundColor: '#FFD700',
    borderWidth: 3,
    borderColor: '#FFA500',
  },
  itemGainToast: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  activityUnlockToast: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#9C27B0',
  },
  defaultText: {
    color: '#333',
  },
  levelUpText: {
    color: '#654321',
  },
});
