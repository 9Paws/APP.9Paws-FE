import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLoadingStore } from '@/stores/loading.store';

export const GlobalLoading: React.FC = () => {
  const { visible, message } = useLoadingStore();
  const { t } = useTranslation();

  const opacity = useMemo(() => new Animated.Value(0), []);
  const scale = useMemo(() => new Animated.Value(0.85), []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 60,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.85,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [opacity, scale, visible]);

  return (
    <View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFill, styles.root]}
    >
      <Animated.View
        style={[
          styles.backdrop,
          { opacity },
        ]}
      >
        <Animated.View
          style={[
            styles.card,
            { opacity, transform: [{ scale }] },
          ]}
        >
          <ActivityIndicator size="large" color="#F15C22" />
          <Text className="mt-3 text-sm font-semibold text-text-main">
            {message || t('common.loading')}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    // Thấp hơn Toast (z-50) để thông báo lỗi vẫn hiện được khi overlay đang tắt
    zIndex: 40,
    elevation: 40,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
});
