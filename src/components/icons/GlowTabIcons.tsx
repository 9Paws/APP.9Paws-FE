import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Rect,
  G,
} from 'react-native-svg';
import { useTranslation } from 'react-i18next';

export interface GlowIconProps {
  focused: boolean;
  size?: number;
}

// =============================================================================
// 1. TỔNG QUAN (OVERVIEW) - Magic Crystal Dashboard
// 4 viên ngọc bo tròn gradient đa sắc lung linh, phản chiếu ánh sáng hoàng gia
// =============================================================================
export function GlowOverviewIcon({ focused, size = 26 }: GlowIconProps) {
  const s = size;
  return (
    <View style={styles.iconContainer}>
      <Svg width={s} height={s} viewBox="0 0 28 28">
        <Defs>
          <LinearGradient id="ovGradOrange" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FF9E2C" />
            <Stop offset="100%" stopColor="#F15C22" />
          </LinearGradient>
          <LinearGradient id="ovGradRose" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FB7185" />
            <Stop offset="100%" stopColor="#E11D48" />
          </LinearGradient>
          <LinearGradient id="ovGradCyan" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#0284C7" />
          </LinearGradient>
          <LinearGradient id="ovGradGold" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FCD34D" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
          <LinearGradient id="ovInactive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {focused ? (
          <G>
            {/* Top Left: Warm Orange Gem */}
            <Rect x="2.5" y="2.5" width="10" height="10" rx="3.5" fill="url(#ovGradOrange)" />
            <Circle cx="5.5" cy="5.5" r="1.5" fill="#FFFFFF" opacity="0.65" />

            {/* Top Right: Rose Jewel */}
            <Rect x="15.5" y="2.5" width="10" height="10" rx="3.5" fill="url(#ovGradRose)" />
            <Circle cx="18.5" cy="5.5" r="1.5" fill="#FFFFFF" opacity="0.65" />

            {/* Bottom Left: Azure Sapphire */}
            <Rect x="2.5" y="15.5" width="10" height="10" rx="3.5" fill="url(#ovGradCyan)" />
            <Circle cx="5.5" cy="18.5" r="1.5" fill="#FFFFFF" opacity="0.65" />

            {/* Bottom Right: Golden Amber */}
            <Rect x="15.5" y="15.5" width="10" height="10" rx="3.5" fill="url(#ovGradGold)" />
            <Circle cx="18.5" cy="18.5" r="1.5" fill="#FFFFFF" opacity="0.65" />

            {/* Center Magic Sparkle */}
            <Path
              d="M14 11.5L14.7 13.3L16.5 14L14.7 14.7L14 16.5L13.3 14.7L11.5 14L13.3 13.3Z"
              fill="#FFFFFF"
            />
          </G>
        ) : (
          <G fill="url(#ovInactive)">
            <Rect x="3" y="3" width="9.5" height="9.5" rx="3" opacity="0.85" />
            <Rect x="15.5" y="3" width="9.5" height="9.5" rx="3" opacity="0.65" />
            <Rect x="3" y="15.5" width="9.5" height="9.5" rx="3" opacity="0.65" />
            <Rect x="15.5" y="15.5" width="9.5" height="9.5" rx="3" opacity="0.85" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =============================================================================
// 2. LỊCH SỬ / CHI TIÊU (EXPENSE / HISTORY) - Emerald Ledger & Golden Coin
// Sổ tay chi tiêu ngọc lục bảo lung linh kết hợp đồng xu vàng óng ánh
// =============================================================================
export function GlowExpenseIcon({ focused, size = 26 }: GlowIconProps) {
  const s = size;
  return (
    <View style={styles.iconContainer}>
      <Svg width={s} height={s} viewBox="0 0 28 28">
        <Defs>
          <LinearGradient id="expEmerald" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="50%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#047857" />
          </LinearGradient>
          <LinearGradient id="expGoldCoin" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="100%" stopColor="#EAB308" />
          </LinearGradient>
          <LinearGradient id="expInactive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {focused ? (
          <G>
            {/* Emerald Ledger Book Cover */}
            <Path
              d="M4 6C4 4.34 5.34 3 7 3H20.5C21.88 3 23 4.12 23 5.5V21C23 22.1 22.1 23 21 23H7C5.34 23 4 21.66 4 20V6Z"
              fill="url(#expEmerald)"
            />
            {/* Book Spine Highlight */}
            <Path
              d="M7 3C5.34 3 4 4.34 4 6V20C4 21.66 5.34 23 7 23C7.5 23 8 22.5 8 22V4C8 3.5 7.5 3 7 3Z"
              fill="#064E3B"
              opacity="0.4"
            />
            {/* Ledger Line Marks */}
            <Rect x="10" y="7.5" width="7" height="2" rx="1" fill="#A7F3D0" opacity="0.9" />
            <Rect x="10" y="11.5" width="5" height="2" rx="1" fill="#A7F3D0" opacity="0.75" />

            {/* Glowing Golden Coin in Foreground */}
            <Circle cx="18" cy="17" r="5.5" fill="url(#expGoldCoin)" />
            <Circle cx="18" cy="17" r="4.2" stroke="#CA8A04" strokeWidth="1" fill="none" opacity="0.6" />
            <Circle cx="16.5" cy="15.5" r="1.2" fill="#FFFFFF" opacity="0.8" />
            {/* Mini Trend Arrow on Coin */}
            <Path
              d="M16 18.5L18 15.5L20 18.5"
              stroke="#854D0E"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        ) : (
          <G fill="url(#expInactive)">
            <Path
              d="M5 6C5 4.34 6.34 3 8 3H21C22.1 3 23 3.9 23 5V21C23 22.1 22.1 23 21 23H8C6.34 23 5 21.66 5 20V6Z"
              opacity="0.75"
            />
            <Path
              d="M8 3C6.34 3 5 4.34 5 6V20C5 21.66 6.34 23 8 23H9V3H8Z"
              fill="#64748B"
              opacity="0.5"
            />
            <Circle cx="17.5" cy="16.5" r="4" fill="#94A3B8" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =============================================================================
// 3. CHIA BILL NHÓM (SPLIT BILL) - Connected Hearts & Team Ribbon
// Biểu tượng gắn kết bạn bè, minh bạch hóa đơn với gradient tím & xanh dương hoàng gia
// =============================================================================
export function GlowSplitIcon({ focused, size = 26 }: GlowIconProps) {
  const s = size;
  return (
    <View style={styles.iconContainer}>
      <Svg width={s} height={s} viewBox="0 0 28 28">
        <Defs>
          <LinearGradient id="splitGradPurple" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#A855F7" />
            <Stop offset="100%" stopColor="#6366F1" />
          </LinearGradient>
          <LinearGradient id="splitGradBlue" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#60A5FA" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </LinearGradient>
          <LinearGradient id="splitInactive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {focused ? (
          <G>
            {/* Left Member Orb */}
            <Circle cx="9" cy="8.5" r="4.5" fill="url(#splitGradPurple)" />
            <Circle cx="7.7" cy="7.2" r="1.3" fill="#FFFFFF" opacity="0.7" />
            <Path
              d="M3 21.5C3 17.5 6 15 9.5 15C13 15 16 17.5 16 21.5"
              fill="url(#splitGradPurple)"
              opacity="0.9"
            />

            {/* Right Member Orb (Overlapping harmoniously) */}
            <Circle cx="19" cy="8.5" r="4.5" fill="url(#splitGradBlue)" />
            <Circle cx="17.7" cy="7.2" r="1.3" fill="#FFFFFF" opacity="0.7" />
            <Path
              d="M12.5 21.5C12.5 17.5 15.5 15 19 15C22.5 15 25 17.5 25 21.5"
              fill="url(#splitGradBlue)"
              opacity="0.8"
            />

            {/* Center Synergy Sparkle / Magic Split Coin */}
            <Circle cx="14" cy="14" r="3.2" fill="#FBBF24" />
            <Path
              d="M14 11.8V16.2M11.8 14H16.2"
              stroke="#78350F"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <Circle cx="13.2" cy="13.2" r="0.8" fill="#FFFFFF" />
          </G>
        ) : (
          <G fill="url(#splitInactive)">
            <Circle cx="9.5" cy="9" r="4" opacity="0.85" />
            <Path d="M4 21C4 17.8 6.5 15.5 9.5 15.5C12.5 15.5 15 17.8 15 21" opacity="0.85" />
            <Circle cx="18.5" cy="9" r="3.5" opacity="0.65" />
            <Path d="M13.5 21C13.5 18.2 16 16 18.5 16C21.5 16 24 18.2 24 21" opacity="0.65" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =============================================================================
// 4. CÁ NHÂN (PROFILE) - Miu Miu Guardian & Crown
// Linh vật Miu Miu tài lộc ấm áp với đôi tai vểnh và chiếc chuông vàng may mắn
// =============================================================================
export function GlowProfileIcon({ focused, size = 26 }: GlowIconProps) {
  const s = size;
  return (
    <View style={styles.iconContainer}>
      <Svg width={s} height={s} viewBox="0 0 28 28">
        <Defs>
          <LinearGradient id="profGradPeach" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFA07A" />
            <Stop offset="50%" stopColor="#FB7185" />
            <Stop offset="100%" stopColor="#E11D48" />
          </LinearGradient>
          <LinearGradient id="profEarPink" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FDA4AF" />
            <Stop offset="100%" stopColor="#F43F5E" />
          </LinearGradient>
          <LinearGradient id="profBellGold" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
          <LinearGradient id="profInactive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {focused ? (
          <G>
            {/* Cute Cat Ears (Left & Right) */}
            <Path d="M7 11L6 4L13 7Z" fill="url(#profEarPink)" />
            <Path d="M21 11L22 4L15 7Z" fill="url(#profEarPink)" />
            <Path d="M7.8 9.5L7.2 5.5L11.5 7.5Z" fill="#FFF1F2" />
            <Path d="M20.2 9.5L20.8 5.5L16.5 7.5Z" fill="#FFF1F2" />

            {/* Miu Miu Head (Chubby Cute Face) */}
            <Circle cx="14" cy="12" r="7.2" fill="url(#profGradPeach)" />
            <Circle cx="12" cy="9.8" r="1.8" fill="#FFFFFF" opacity="0.6" />

            {/* Rosy Cheeks */}
            <Circle cx="9.5" cy="13.2" r="1.3" fill="#FDA4AF" opacity="0.8" />
            <Circle cx="18.5" cy="13.2" r="1.3" fill="#FDA4AF" opacity="0.8" />

            {/* Cute Cat Eyes & Nose */}
            <Circle cx="11.5" cy="11.5" r="1.1" fill="#4C0519" />
            <Circle cx="16.5" cy="11.5" r="1.1" fill="#4C0519" />
            <Path d="M13.5 12.8L14.5 12.8L14 13.5Z" fill="#BE123C" />

            {/* Body Base */}
            <Path
              d="M6.5 24C6.5 19.5 9.8 17.5 14 17.5C18.2 17.5 21.5 19.5 21.5 24"
              fill="url(#profGradPeach)"
              opacity="0.9"
            />

            {/* Golden Bell / Lucky Charm on Collar */}
            <Circle cx="14" cy="18" r="2.6" fill="url(#profBellGold)" />
            <Circle cx="13.3" cy="17.3" r="0.7" fill="#FFFFFF" />
          </G>
        ) : (
          <G fill="url(#profInactive)">
            {/* Inactive Cat Silhouette */}
            <Path d="M7.5 10.5L6.5 5L12.5 7.5Z" opacity="0.7" />
            <Path d="M20.5 10.5L21.5 5L15.5 7.5Z" opacity="0.7" />
            <Circle cx="14" cy="12" r="6.5" opacity="0.85" />
            <Path d="M7 23.5C7 19.5 10 18 14 18C18 18 21 19.5 21 23.5" opacity="0.7" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =============================================================================
// 5. NÚT THÊM GIAO DỊCH TRUNG TÂM (CENTER ADD BUTTON) - Golden Paw Magic Orb
// Nút tròn nổi bật với dấu chân mèo Miu Miu 9Paws vàng óng ánh và hiệu ứng tỏa sáng
// =============================================================================
export function GlowAddCenterButton(props: any) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.88}
      style={[styles.addButtonTouchable, props.style]}
      accessibilityRole="button"
      accessibilityLabel={t('tabs.addTransaction') || 'Thêm giao dịch'}
    >
      <View style={styles.addOrbContainer}>
        {/* Glow Halo Background */}
        <View style={styles.glowHalo} />

        <Svg width={56} height={56} viewBox="0 0 56 56">
          <Defs>
            {/* Sunset Flame Gradient */}
            <LinearGradient id="pawOrbGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFA03A" />
              <Stop offset="50%" stopColor="#F15C22" />
              <Stop offset="100%" stopColor="#E11D48" />
            </LinearGradient>
            {/* Golden Paw Highlight Gradient */}
            <LinearGradient id="pawGoldGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="40%" stopColor="#FFFBEB" />
              <Stop offset="100%" stopColor="#FDE68A" />
            </LinearGradient>
            {/* Top Shine Specular */}
            <LinearGradient id="orbShine" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Main Sphere */}
          <Circle cx="28" cy="28" r="26" fill="url(#pawOrbGrad)" />

          {/* Glossy Top Specular Highlight */}
          <Path
            d="M8 24C8 14.5 16 7 28 7C40 7 48 14.5 48 24C41 18 33 16 28 16C23 16 15 18 8 24Z"
            fill="url(#orbShine)"
          />

          {/* 9Paws Golden Paw Print with Plus Overlay */}
          <G fill="url(#pawGoldGrad)">
            {/* 4 Paw Toe Beans */}
            <Circle cx="20" cy="19.5" r="2.8" />
            <Circle cx="25.2" cy="16.5" r="3.1" />
            <Circle cx="30.8" cy="16.5" r="3.1" />
            <Circle cx="36" cy="19.5" r="2.8" />

            {/* Main Center Paw Pad with Star / Plus relief */}
            <Path
              d="M20.5 27C19.5 28.5 19 30.5 20.2 32.5C21.5 34.5 24 35.5 28 35.5C32 35.5 34.5 34.5 35.8 32.5C37 30.5 36.5 28.5 35.5 27C33.8 24.5 30.5 24 28 24C25.5 24 22.2 24.5 20.5 27Z"
            />
          </G>

          {/* Clean Brilliant Plus inside the Center Pad */}
          <Path
            d="M28 26.5V33M24.8 29.8H31.2"
            stroke="#D97706"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
  },
  addButtonTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOrbContainer: {
    width: 56,
    height: 56,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowHalo: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F15C22',
    opacity: 0.35,
    transform: [{ scale: 1.15 }],
    shadowColor: '#F15C22',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
});
