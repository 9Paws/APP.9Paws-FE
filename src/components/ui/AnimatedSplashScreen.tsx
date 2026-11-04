import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');
const { width } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  isReady: boolean;
  onFinish?: () => void;
}

export function AnimatedSplashScreen({ isReady, onFinish }: AnimatedSplashScreenProps) {
  const { t } = useTranslation();

  // Animation drivers using lazy useState (React 19 / Compiler compliant)
  const [containerOpacity] = useState(() => new Animated.Value(1));
  const [containerScale] = useState(() => new Animated.Value(1));
  const [mascotScale] = useState(() => new Animated.Value(0.6));
  const [mascotFloatY] = useState(() => new Animated.Value(0));
  const [pulseRingScale] = useState(() => new Animated.Value(0.85));
  const [pulseRingOpacity] = useState(() => new Animated.Value(0.3));
  const [textOpacity] = useState(() => new Animated.Value(0));
  const [textTranslateY] = useState(() => new Animated.Value(20));
  const [badgeOpacity] = useState(() => new Animated.Value(0));
  const [dotsOpacity] = useState(() => new Animated.Value(0));

  const [dot1Scale] = useState(() => new Animated.Value(0.8));
  const [dot2Scale] = useState(() => new Animated.Value(0.8));
  const [dot3Scale] = useState(() => new Animated.Value(0.8));

  const isNative = Platform.OS !== 'web';

  useEffect(() => {
    // 1. Initial entrance animation
    Animated.parallel([
      // Mascot spring up
      Animated.spring(mascotScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: isNative,
      }),
      // Title slide up + fade in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: isNative,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 700,
        delay: 200,
        useNativeDriver: isNative,
      }),
      // Tagline fade in
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: 600,
        delay: 450,
        useNativeDriver: isNative,
      }),
      // Loading dots fade in
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 600,
        delay: 600,
        useNativeDriver: isNative,
      }),
    ]).start();

    // 2. Looping Mascot Floating Animation
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotFloatY, {
          toValue: -8,
          duration: 1600,
          useNativeDriver: isNative,
        }),
        Animated.timing(mascotFloatY, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: isNative,
        }),
      ])
    );
    floatLoop.start();

    // 3. Looping Pulse Glow Ring Animation
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseRingScale, {
            toValue: 1.25,
            duration: 1800,
            useNativeDriver: isNative,
          }),
          Animated.timing(pulseRingOpacity, {
            toValue: 0.7,
            duration: 900,
            useNativeDriver: isNative,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseRingScale, {
            toValue: 0.9,
            duration: 1800,
            useNativeDriver: isNative,
          }),
          Animated.timing(pulseRingOpacity, {
            toValue: 0.25,
            duration: 900,
            useNativeDriver: isNative,
          }),
        ]),
      ])
    );
    glowLoop.start();

    // 4. Looping 3 loading dots animation
    const animateDot = (dotVal: Animated.Value, delayMs: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delayMs),
          Animated.timing(dotVal, {
            toValue: 1.35,
            duration: 350,
            useNativeDriver: isNative,
          }),
          Animated.timing(dotVal, {
            toValue: 0.8,
            duration: 350,
            useNativeDriver: isNative,
          }),
          Animated.delay(700 - delayMs),
        ])
      );
    };

    const dot1Anim = animateDot(dot1Scale, 0);
    const dot2Anim = animateDot(dot2Scale, 200);
    const dot3Anim = animateDot(dot3Scale, 400);

    dot1Anim.start();
    dot2Anim.start();
    dot3Anim.start();

    return () => {
      floatLoop.stop();
      glowLoop.stop();
      dot1Anim.stop();
      dot2Anim.stop();
      dot3Anim.stop();
    };
  }, [badgeOpacity, dot1Scale, dot2Scale, dot3Scale, dotsOpacity, isNative, mascotFloatY, mascotScale, pulseRingOpacity, pulseRingScale, textOpacity, textTranslateY]);

  // When app is ready to display screens, fade out gracefully
  useEffect(() => {
    if (isReady) {
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: isNative,
        }),
        Animated.timing(containerScale, {
          toValue: 1.04,
          duration: 450,
          useNativeDriver: isNative,
        }),
      ]).start(() => {
        if (onFinish) onFinish();
      });
    }
  }, [containerOpacity, containerScale, isNative, isReady, onFinish]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ scale: containerScale }],
        },
      ]}
      pointerEvents={isReady ? 'none' : 'auto'}
    >
      <StatusBar style="dark" />

      {/* Decorative background ambient glows */}
      <View style={styles.ambientCircleTop} />
      <View style={styles.ambientCircleBottom} />

      {/* Center Hero Content */}
      <View style={styles.centerContent}>
        {/* Animated Glow Ring Behind Mascot */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              transform: [{ scale: pulseRingScale }],
              opacity: pulseRingOpacity,
            },
          ]}
        />

        {/* Mascot Container with Spring and Float */}
        <Animated.View
          style={[
            styles.mascotWrapper,
            {
              transform: [
                { scale: mascotScale },
                { translateY: mascotFloatY },
              ],
            },
          ]}
        >
          <View style={styles.mascotCircle}>
            <Image
              source={MIU_MIU_IMAGE}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Brand Name & Logo */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>9</Text>
            <Text style={[styles.brandTitle, styles.brandHighlight]}>Paws</Text>
          </View>
          <Text style={styles.brandSubtitle}>
            {t('auth.login.subtitle', { defaultValue: 'Chi tiêu nhẹ nhàng & Chia bill dễ dàng' })}
          </Text>
        </Animated.View>

        {/* Mascot Feature Badge */}
        <Animated.View style={[styles.badgeContainer, { opacity: badgeOpacity }]}>
          <View style={styles.badge}>
            <Text style={styles.badgePaw}>🐾</Text>
            <Text style={styles.badgeText}>Đồng hành cùng Miu Miu</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Loading Dots indicator */}
      <Animated.View style={[styles.bottomContainer, { opacity: dotsOpacity }]}>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { transform: [{ scale: dot1Scale }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ scale: dot2Scale }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ scale: dot3Scale }] }]} />
        </View>
        <Text style={styles.bottomVersion}>Phiên bản 1.0.0</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  ambientCircleTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(241, 92, 34, 0.06)',
  },
  ambientCircleBottom: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(251, 146, 60, 0.08)',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  glowRing: {
    position: 'absolute',
    top: -20,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FDEEE6',
  },
  mascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mascotCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFF7ED',
    borderWidth: 3,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F15C22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  mascotImage: {
    width: 95,
    height: 95,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: '#F15C22',
  },
  brandSubtitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  badgeContainer: {
    marginTop: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EA',
    borderWidth: 1,
    borderColor: '#FFD7C5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgePaw: {
    fontSize: 13,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 44,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F15C22',
  },
  bottomVersion: {
    fontSize: 11,
    fontWeight: '500',
    color: '#A8A29E',
  },
});
