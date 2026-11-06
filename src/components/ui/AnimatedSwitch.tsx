import React, { useEffect, useMemo } from 'react';
import { Animated, Switch, type SwitchProps } from 'react-native';

type AnimatedSwitchProps = SwitchProps & {
  /** Bật hiệu ứng scale khi chuyển từ tắt sang bật (mặc định true) */
  animateOnEnable?: boolean;
};

/**
 * Switch của React Native không có animation khi bật/tắt.
 * Component này bọc Switch lại và thêm hiệu ứng nở (scale) khi
 * giá trị chuyển từ false -> true, giúp UI/UX mượt hơn.
 *
 * Animated.Value luôn khởi tạo bằng 0 nên khi trạng thái đã lưu được
 * nạp lại (toggle đang bật), người dùng sẽ thấy hiệu ứng chuyển từ
 * tắt sang bật thay vì hiển thị bật sẵn.
 */
export const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({
  value,
  animateOnEnable = true,
  ...props
}) => {
  const progress = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (!animateOnEnable) return;

    Animated.spring(progress, {
      toValue: value ? 1 : 0,
      friction: 6,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [animateOnEnable, progress, value]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Switch value={value} {...props} />
    </Animated.View>
  );
};
