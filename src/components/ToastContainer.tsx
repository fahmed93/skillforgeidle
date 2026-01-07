/**
 * ToastContainer Component
 *
 * Manages and displays toast notifications from the game store.
 * Limits visible toasts to 3 and positions them absolutely at the top of the screen.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const toasts = useGameStore(state => state.toasts);
  const removeToast = useGameStore(state => state.removeToast);

  // Show only the first 3 toasts
  const visibleToasts = toasts.slice(0, 3);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {visibleToasts.map((toast, index) => (
        <Toast
          key={toast.id}
          notification={toast}
          onDismiss={removeToast}
          index={index}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
