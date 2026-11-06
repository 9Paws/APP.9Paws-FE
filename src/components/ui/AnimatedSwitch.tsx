import React, { useEffect, useRef, useState } from 'react';
import { Animated, Switch, type SwitchProps } from 'react-native';

type AnimatedSwitchProps = SwitchProps & {
  /** Bật hiệu ứng scale khi chuyển từ tắt sang bật (mặc định true) */
  animateOnEnable?: boolean;
};

/**
 * AnimatedSwitch: Bọc Switch của React Native.
 * Khởi tạo đúng trạng thái ban đầu của value (không chạy animation khi mount lần đầu)
 * để tránh tình trạng toggle bị giật/nhảy từ tắt sang bật khi mới mở màn hình.
 */
export const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({
  value,
  animateOnEnable = true,
  ...props
}) => {
  const isFirstRender = useRef(true);
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    // Không chạy animation ở lần render đầu tiên để giữ state ban đầu mượt mà
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!animateOnEnable) return;

    Animated.spring(progress, {
      toValue: value ? 1 : 0,
      friction: 7,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [animateOnEnable, progress, value]);

  const scale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.06, 1],
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Switch value={value} {...props} />
    </Animated.View>
  );
};
