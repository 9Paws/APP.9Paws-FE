import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react-native';
import { useToastStore } from '@/stores/toast.store';

export const Toast: React.FC = () => {
  const { visible, type, title, message, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();

  const translateY = useMemo(() => new Animated.Value(-120), []);
  const opacity = useMemo(() => new Animated.Value(0), []);

  const handleDismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      hideToast();
    });
  }, [hideToast, opacity, translateY]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: insets.top + 8,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [visible, handleDismiss, insets.top, opacity, translateY]);

  if (!visible) return null;

  const config = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: <CheckCircle2 size={20} color="#059669" />,
      titleColor: 'text-emerald-900',
      textColor: 'text-emerald-800',
      defaultTitle: 'Thành công',
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      icon: <AlertCircle size={20} color="#E11D48" />,
      titleColor: 'text-rose-900',
      textColor: 'text-rose-800',
      defaultTitle: 'Lỗi',
    },
    info: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: <Info size={20} color="#D97706" />,
      titleColor: 'text-amber-900',
      textColor: 'text-amber-800',
      defaultTitle: 'Thông báo',
    },
  }[type];

  return (
    <View
      pointerEvents="box-none"
      className="absolute top-0 left-0 right-0 z-50 items-center px-4"
    >
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          maxWidth: 420,
        }}
        className={`w-full flex-row items-center rounded-2xl border ${config.border} ${config.bg} p-3.5 shadow-lg shadow-black/10`}
      >
        <View className="mr-3">{config.icon}</View>

        <View className="flex-1 mr-2">
          <Text className={`text-xs font-bold ${config.titleColor}`}>
            {title || config.defaultTitle}
          </Text>
          <Text className={`mt-0.5 text-xs ${config.textColor} leading-4 font-sans`}>
            {message}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleDismiss}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="p-1"
        >
          <X size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
