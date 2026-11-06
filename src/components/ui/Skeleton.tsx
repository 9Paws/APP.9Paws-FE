import React, { useEffect, useMemo } from 'react';
import {
  Animated,
  DimensionValue,
  Easing,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Atomic Skeleton component with smooth native breathing shimmer/pulse animation.
 * Runs completely on the native UI thread for maximum 60/120fps smoothness.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  circle = false,
  style,
  className,
  children,
}) => {
  const pulseAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });

  const computedBorderRadius = circle
    ? typeof width === 'number'
      ? width / 2
      : 9999
    : borderRadius;

  return (
    <Animated.View
      className={className}
      style={[
        styles.skeletonBase,
        {
          width,
          height: circle ? (typeof width === 'number' ? width : height) : height,
          borderRadius: computedBorderRadius,
          opacity,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export interface SkeletonCircleProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = 40,
  style,
  className,
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius={size / 2}
      circle
      style={style}
      className={className}
    />
  );
};

export interface SkeletonTextProps {
  lines?: number;
  height?: number;
  gap?: number;
  lastLineWidth?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 2,
  height = 14,
  gap = 8,
  lastLineWidth = '65%',
  style,
  className,
}) => {
  return (
    <View style={[{ gap }, style]} className={className}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLast = index === lines - 1 && lines > 1;
        return (
          <Skeleton
            key={index}
            height={height}
            width={isLast ? lastLineWidth : '100%'}
            borderRadius={height / 2}
          />
        );
      })}
    </View>
  );
};

export interface SkeletonCardProps {
  style?: StyleProp<ViewStyle>;
  className?: string;
  children: React.ReactNode;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  style,
  className,
  children,
}) => {
  return (
    <View
      className={`bg-white rounded-3xl p-4 border border-gray-100 shadow-sm ${className || ''}`}
      style={style}
    >
      {children}
    </View>
  );
};

/**
 * Screen Skeleton for Profile (Hồ sơ của tôi)
 * Perfectly mirrors ProfileScreen layout during network fetch
 */
export const ProfileSkeleton: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background-warm" style={style}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
      >
        {/* Header: Greeting and avatar circle */}
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Skeleton width={160} height={24} borderRadius={12} />
            <Skeleton width={200} height={14} borderRadius={7} style={{ marginTop: 8 }} />
          </View>
          <View className="flex-row items-center gap-x-2.5">
            <SkeletonCircle size={40} />
            <SkeletonCircle size={40} />
          </View>
        </View>

        {/* Profile Card */}
        <SkeletonCard className="flex-row items-center mb-6">
          <SkeletonCircle size={64} style={{ marginRight: 14 }} />
          <View className="flex-1">
            <Skeleton width="55%" height={18} borderRadius={9} />
            <Skeleton width="75%" height={13} borderRadius={6.5} style={{ marginTop: 8 }} />
          </View>
          <SkeletonCircle size={36} />
        </SkeletonCard>

        {/* Wallets section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <View className="flex-row items-center gap-x-2">
              <Skeleton width={24} height={24} borderRadius={6} />
              <Skeleton width={100} height={16} borderRadius={8} />
            </View>
            <Skeleton width={80} height={28} borderRadius={14} />
          </View>

          <SkeletonCard className="py-5 flex-row items-center">
            <SkeletonCircle size={44} style={{ marginRight: 14 }} />
            <View className="flex-1">
              <Skeleton width="50%" height={16} borderRadius={8} style={{ marginBottom: 6 }} />
              <Skeleton width="35%" height={13} borderRadius={6.5} />
            </View>
            <Skeleton width={90} height={20} borderRadius={10} />
          </SkeletonCard>
        </View>

        {/* Financial Companion section */}
        <View className="mb-6">
          <View className="flex-row items-center gap-x-2 mb-3 px-1">
            <Skeleton width={24} height={24} borderRadius={6} />
            <Skeleton width={150} height={16} borderRadius={8} />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <SkeletonCircle size={36} style={{ marginBottom: 10 }} />
              <Skeleton width="50%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
              <Skeleton width="80%" height={20} borderRadius={10} />
            </View>
            <View className="flex-1 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <SkeletonCircle size={36} style={{ marginBottom: 10 }} />
              <Skeleton width="50%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
              <Skeleton width="80%" height={20} borderRadius={10} />
            </View>
          </View>
        </View>

        {/* Settings & Security Section (Cài đặt & Bảo mật) */}
        <View className="mb-6">
          <View className="flex-row items-center gap-x-2 mb-3 px-1">
            <Skeleton width={20} height={20} borderRadius={5} />
            <Skeleton width={130} height={16} borderRadius={8} />
          </View>

          <SkeletonCard>
            {/* Setting Row 1: Push notifications with switch pill */}
            <View className="flex-row items-center py-3.5 border-b border-gray-50">
              <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 14 }} />
              <View className="flex-1 mr-2">
                <Skeleton width="38%" height={15} borderRadius={7.5} style={{ marginBottom: 6 }} />
                <Skeleton width="65%" height={12} borderRadius={6} />
              </View>
              <Skeleton width={48} height={26} borderRadius={13} />
            </View>

            {/* Setting Row 2: Biometric with switch pill */}
            <View className="flex-row items-center py-3.5 border-b border-gray-50">
              <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 14 }} />
              <View className="flex-1 mr-2">
                <Skeleton width="44%" height={15} borderRadius={7.5} style={{ marginBottom: 6 }} />
                <Skeleton width="55%" height={12} borderRadius={6} />
              </View>
              <Skeleton width={48} height={26} borderRadius={13} />
            </View>

            {/* Setting Row 3: Daily reminder with switch pill */}
            <View className="flex-row items-center py-3.5 border-b border-gray-50">
              <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 14 }} />
              <View className="flex-1 mr-2">
                <Skeleton width="36%" height={15} borderRadius={7.5} style={{ marginBottom: 6 }} />
                <Skeleton width="62%" height={12} borderRadius={6} />
              </View>
              <Skeleton width={48} height={26} borderRadius={13} />
            </View>

            {/* Setting Row 4: Currency with badge */}
            <View className="flex-row items-center py-3.5 border-b border-gray-50">
              <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 14 }} />
              <View className="flex-1 mr-2">
                <Skeleton width="32%" height={15} borderRadius={7.5} style={{ marginBottom: 6 }} />
                <Skeleton width="45%" height={12} borderRadius={6} />
              </View>
              <Skeleton width={72} height={26} borderRadius={13} />
            </View>

            {/* Setting Row 5: Community & Feedback */}
            <View className="flex-row items-center py-3.5 border-b border-gray-50">
              <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 14 }} />
              <View className="flex-1 mr-2">
                <Skeleton width="38%" height={15} borderRadius={7.5} style={{ marginBottom: 6 }} />
                <Skeleton width="52%" height={12} borderRadius={6} />
              </View>
              <Skeleton width={18} height={18} borderRadius={9} />
            </View>

            {/* Setting Row 6: About */}
            <View className="flex-row items-center py-3.5">
              <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 14 }} />
              <View className="flex-1 mr-2">
                <Skeleton width="28%" height={15} borderRadius={7.5} style={{ marginBottom: 6 }} />
                <Skeleton width="40%" height={12} borderRadius={6} />
              </View>
              <Skeleton width={18} height={18} borderRadius={9} />
            </View>
          </SkeletonCard>
        </View>

        {/* Logout Row */}
        <SkeletonCard className="flex-row items-center py-3.5">
          <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 14 }} />
          <View className="flex-1">
            <Skeleton width="30%" height={15} borderRadius={7.5} />
          </View>
          <Skeleton width={18} height={18} borderRadius={9} />
        </SkeletonCard>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Screen Skeleton for Overview (Tổng quan chi tiêu)
 */
export const OverviewSkeleton: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background-warm" style={style}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Skeleton width={160} height={22} borderRadius={11} />
            <Skeleton width={120} height={13} borderRadius={6.5} style={{ marginTop: 6 }} />
          </View>
          <View className="flex-row items-center gap-x-2.5">
            <SkeletonCircle size={40} />
            <SkeletonCircle size={40} />
          </View>
        </View>

        {/* Hero Balance Card */}
        <SkeletonCard className="mb-6 p-5">
          <Skeleton width={110} height={13} borderRadius={6.5} style={{ marginBottom: 10 }} />
          <Skeleton width={190} height={32} borderRadius={16} style={{ marginBottom: 20 }} />

          <View className="flex-row gap-3 pt-3 border-t border-gray-100">
            <View className="flex-1">
              <Skeleton width="40%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
              <Skeleton width="80%" height={18} borderRadius={9} />
            </View>
            <View className="flex-1">
              <Skeleton width="40%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
              <Skeleton width="80%" height={18} borderRadius={9} />
            </View>
          </View>
        </SkeletonCard>

        {/* Quick Action buttons */}
        <View className="flex-row justify-around mb-6 px-2">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="items-center">
              <SkeletonCircle size={52} style={{ marginBottom: 8 }} />
              <Skeleton width={48} height={11} borderRadius={5.5} />
            </View>
          ))}
        </View>

        {/* Spending chart placeholder */}
        <SkeletonCard className="mb-6 p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Skeleton width={140} height={16} borderRadius={8} />
            <Skeleton width={70} height={24} borderRadius={12} />
          </View>
          <Skeleton width="100%" height={140} borderRadius={16} />
        </SkeletonCard>

        {/* Recent Transactions */}
        <View>
          <View className="flex-row justify-between items-center mb-3 px-1">
            <Skeleton width={130} height={16} borderRadius={8} />
            <Skeleton width={60} height={13} borderRadius={6.5} />
          </View>

          <SkeletonCard>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className={`flex-row items-center py-3.5 ${i !== 3 ? 'border-b border-gray-50' : ''}`}
              >
                <Skeleton width={42} height={42} borderRadius={14} style={{ marginRight: 12 }} />
                <View className="flex-1 mr-2">
                  <Skeleton width="55%" height={15} borderRadius={7.5} style={{ marginBottom: 6 }} />
                  <Skeleton width="35%" height={12} borderRadius={6} />
                </View>
                <Skeleton width={70} height={16} borderRadius={8} />
              </View>
            ))}
          </SkeletonCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Screen Skeleton for History (Lịch sử giao dịch)
 */
export const HistorySkeleton: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background-warm" style={style}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Skeleton width={160} height={24} borderRadius={12} />
          <SkeletonCircle size={38} />
        </View>

        {/* Search Bar */}
        <Skeleton width="100%" height={46} borderRadius={23} style={{ marginBottom: 12 }} />

        {/* Category Filter Pills */}
        <View className="flex-row gap-2 mb-4">
          <Skeleton width={70} height={32} borderRadius={16} />
          <Skeleton width={85} height={32} borderRadius={16} />
          <Skeleton width={95} height={32} borderRadius={16} />
          <Skeleton width={75} height={32} borderRadius={16} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
      >
        {/* Date Group 1 */}
        <Skeleton width={90} height={13} borderRadius={6.5} style={{ marginBottom: 8, marginTop: 4, marginLeft: 4 }} />
        <SkeletonCard className="mb-5">
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className={`flex-row items-center py-3.5 ${i !== 3 ? 'border-b border-gray-50' : ''}`}
            >
              <Skeleton width={40} height={40} borderRadius={14} style={{ marginRight: 12 }} />
              <View className="flex-1 mr-2">
                <Skeleton width="50%" height={14} borderRadius={7} style={{ marginBottom: 6 }} />
                <Skeleton width="30%" height={11} borderRadius={5.5} />
              </View>
              <Skeleton width={75} height={16} borderRadius={8} />
            </View>
          ))}
        </SkeletonCard>

        {/* Date Group 2 */}
        <Skeleton width={80} height={13} borderRadius={6.5} style={{ marginBottom: 8, marginLeft: 4 }} />
        <SkeletonCard>
          {[1, 2].map((i) => (
            <View
              key={i}
              className={`flex-row items-center py-3.5 ${i !== 2 ? 'border-b border-gray-50' : ''}`}
            >
              <Skeleton width={40} height={40} borderRadius={14} style={{ marginRight: 12 }} />
              <View className="flex-1 mr-2">
                <Skeleton width="45%" height={14} borderRadius={7} style={{ marginBottom: 6 }} />
                <Skeleton width="35%" height={11} borderRadius={5.5} />
              </View>
              <Skeleton width={68} height={16} borderRadius={8} />
            </View>
          ))}
        </SkeletonCard>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Screen Skeleton for Edit Profile
 */
export const EditProfileSkeleton: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background-warm" style={style}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <SkeletonCircle size={40} />
          <Skeleton width={140} height={20} borderRadius={10} />
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar Picker */}
        <View className="items-center mb-6">
          <SkeletonCircle size={88} style={{ marginBottom: 12 }} />
          <Skeleton width={110} height={14} borderRadius={7} />
        </View>

        {/* Form Inputs */}
        <SkeletonCard className="mb-6 p-5">
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginBottom: i !== 3 ? 16 : 0 }}>
              <Skeleton width={90} height={13} borderRadius={6.5} style={{ marginBottom: 8 }} />
              <Skeleton width="100%" height={48} borderRadius={14} />
            </View>
          ))}
        </SkeletonCard>

        {/* Save Button */}
        <Skeleton width="100%" height={52} borderRadius={26} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#E5E7EB',
  },
});
