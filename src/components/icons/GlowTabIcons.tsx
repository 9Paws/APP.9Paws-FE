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
// 1. TỔNG QUAN (OVERVIEW) - Magic Crystal Home Vault
// Biểu tượng ngôi nhà tài chính ma thuật, bo tròn mượt mà, gradient cam hoàng kim
// =============================================================================
export function GlowOverviewIcon({ focused, size = 30 }: GlowIconProps) {
  const s = size;
  return (
    <View style={[styles.iconWrapper, focused && styles.activePill]}>
      <Svg width={s} height={s} viewBox="0 0 32 32">
        <Defs>
          {/* Active Gradient: Rực rỡ hoàng kim */}
          <LinearGradient id="homeGradActive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFA726" />
            <Stop offset="55%" stopColor="#F15C22" />
            <Stop offset="100%" stopColor="#D82246" />
          </LinearGradient>
          {/* Inner Door Gradient */}
          <LinearGradient id="homeDoorGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFF7ED" />
            <Stop offset="100%" stopColor="#FED7AA" />
          </LinearGradient>
          {/* Specular White Shine */}
          <LinearGradient id="homeShine" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </LinearGradient>
          {/* Inactive Gradient */}
          <LinearGradient id="homeGradInactive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {focused ? (
          <G>
            {/* Soft Ambient Shadow behind */}
            <Path
              d="M16 2.8L4.5 12.2C3.5 13 3 14.3 3 15.6V24C3 27 5.5 29.5 8.5 29.5H23.5C26.5 29.5 29 27 29 24V15.6C29 14.3 28.5 13 27.5 12.2L16 2.8Z"
              fill="#F15C22"
              opacity="0.2"
              transform="translate(0, 1.5)"
            />

            {/* Main Solid Home Vault Silhouette */}
            <Path
              d="M16 2.8L4.5 12.2C3.5 13 3 14.3 3 15.6V24C3 27 5.5 29.5 8.5 29.5H23.5C26.5 29.5 29 27 29 24V15.6C29 14.3 28.5 13 27.5 12.2L16 2.8Z"
              fill="url(#homeGradActive)"
            />

            {/* Upper Roof Glossy Highlight */}
            <Path
              d="M16 4.5L5.5 13.2C5.2 13.5 5 13.9 5 14.3V16.5C8 14 12 12.5 16 12.5C20 12.5 24 14 27 16.5V14.3C27 13.9 26.8 13.5 26.5 13.2L16 4.5Z"
              fill="url(#homeShine)"
            />

            {/* Interior Arch / Magic Vault Door */}
            <Path
              d="M12 29.5V20.5C12 18.3 13.8 16.5 16 16.5C18.2 16.5 20 18.3 20 20.5V29.5H12Z"
              fill="url(#homeDoorGrad)"
            />

            {/* Golden Star Sparkle inside Arch */}
            <Path
              d="M16 19L16.6 20.8L18.4 21.4L16.6 22L16 23.8L15.4 22L13.6 21.4L15.4 20.8Z"
              fill="#F59E0B"
            />
            <Circle cx="16" cy="21.4" r="0.8" fill="#FFFFFF" />
          </G>
        ) : (
          <G fill="url(#homeGradInactive)">
            <Path d="M16 3.5L4.8 12.8C4 13.5 3.5 14.5 3.5 15.6V24C3.5 26.8 5.7 29 8.5 29H23.5C26.3 29 28.5 26.8 28.5 24V15.6C28.5 14.5 28 13.5 27.2 12.8L16 3.5Z" />
            <Path
              d="M12.5 29V21.5C12.5 19.6 14.1 18 16 18C17.9 18 19.5 19.6 19.5 21.5V29H12.5Z"
              fill="#FFFFFF"
              opacity="0.85"
            />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =============================================================================
// 2. LỊCH SỬ / CHI TIÊU (EXPENSE / HISTORY) - Emerald Vault & Gold Coin
// Chiếc ví da ngọc lục bảo đầy đặn với đồng xu vàng may mắn nhô lên tỏa sáng
// =============================================================================
export function GlowExpenseIcon({ focused, size = 30 }: GlowIconProps) {
  const s = size;
  return (
    <View style={[styles.iconWrapper, focused && styles.activePill]}>
      <Svg width={s} height={s} viewBox="0 0 32 32">
        <Defs>
          {/* Emerald Gradient */}
          <LinearGradient id="walGradActive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="50%" stopColor="#10B981" />
            <Stop offset="100%" stopColor="#047857" />
          </LinearGradient>
          {/* Gold Coin Gradient */}
          <LinearGradient id="coinGradActive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="50%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#D97706" />
          </LinearGradient>
          {/* Flap Highlight */}
          <LinearGradient id="walShine" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </LinearGradient>
          {/* Inactive */}
          <LinearGradient id="walGradInactive" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {focused ? (
          <G>
            {/* Rising Golden Coin from Wallet Top Slot */}
            <Circle cx="16" cy="9.5" r="7" fill="url(#coinGradActive)" />
            <Circle cx="16" cy="9.5" r="5.6" stroke="#FEF08A" strokeWidth="0.8" fill="none" opacity="0.7" />
            {/* Coin Star Inscription */}
            <Path
              d="M16 6.8L16.7 8.3L18.2 8.7L17 9.8L17.4 11.3L16 10.5L14.6 11.3L15 9.8L13.8 8.7L15.3 8.3Z"
              fill="#FFFFFF"
            />
            <Circle cx="14.2" cy="7.8" r="0.9" fill="#FFFFFF" opacity="0.8" />

            {/* Main Rounded Wallet Body */}
            <Rect x="2.5" y="11" width="27" height="17" rx="5" fill="url(#walGradActive)" />

            {/* Upper Flap Curved Shadow */}
            <Path
              d="M2.5 16C2.5 13.2 4.7 11 7.5 11H24.5C27.3 11 29.5 13.2 29.5 16V17C23 15 9 15 2.5 17V16Z"
              fill="url(#walShine)"
            />

            {/* Wallet Clasp / Badge on Right Side */}
            <Path
              d="M20 16.5H27C28.4 16.5 29.5 17.6 29.5 19C29.5 20.4 28.4 21.5 27 21.5H20C18.6 21.5 17.5 20.4 17.5 19C17.5 17.6 18.6 16.5 20 16.5Z"
              fill="#064E3B"
              opacity="0.35"
            />
            <Circle cx="21" cy="19" r="2.4" fill="url(#coinGradActive)" />
            <Circle cx="20.6" cy="18.6" r="0.7" fill="#FFFFFF" />

            {/* Decorative Card Stitching Line */}
            <Path
              d="M5.5 24H16"
              stroke="#A7F3D0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="2 2"
              opacity="0.8"
            />
          </G>
        ) : (
          <G fill="url(#walGradInactive)">
            <Circle cx="16" cy="10" r="6" opacity="0.8" />
            <Rect x="3" y="11.5" width="26" height="16.5" rx="4.5" />
            <Circle cx="22" cy="19.5" r="2" fill="#FFFFFF" opacity="0.8" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =============================================================================
// 3. CHIA BILL NHÓM (SPLIT BILL) - Dynamic Connected Infinity Friends
// Hai nhân vật kết nối mượt mà, gradient Tím Hoàng Gia & Xanh Electric lung linh
// =============================================================================
export function GlowSplitIcon({ focused, size = 30 }: GlowIconProps) {
  const s = size;
  return (
    <View style={[styles.iconWrapper, focused && styles.activePill]}>
      <Svg width={s} height={s} viewBox="0 0 32 32">
        <Defs>
          {/* Violet Gradient for Left Friend */}
          <LinearGradient id="splitViolet" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#C084FC" />
            <Stop offset="50%" stopColor="#9333EA" />
            <Stop offset="100%" stopColor="#6B21A8" />
          </LinearGradient>
          {/* Blue Gradient for Right Friend */}
          <LinearGradient id="splitElectric" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#60A5FA" />
            <Stop offset="50%" stopColor="#3B82F6" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>
          {/* Golden Badge Gradient */}
          <LinearGradient id="splitBadgeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
          {/* Inactive */}
          <LinearGradient id="splitInactiveGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {focused ? (
          <G>
            {/* Left Member (Violet) */}
            <Circle cx="10" cy="9" r="5" fill="url(#splitViolet)" />
            <Circle cx="8.5" cy="7.5" r="1.5" fill="#FFFFFF" opacity="0.65" />
            <Path
              d="M3 26C3 20.8 6.5 17 11 17C13 17 14.8 17.8 16.2 19.1C14.8 20.9 14 23.3 14 26H3Z"
              fill="url(#splitViolet)"
            />

            {/* Right Member (Electric Blue - Overlapping gracefully) */}
            <Circle cx="22" cy="9" r="5" fill="url(#splitElectric)" />
            <Circle cx="20.5" cy="7.5" r="1.5" fill="#FFFFFF" opacity="0.65" />
            <Path
              d="M29 26C29 20.8 25.5 17 21 17C19 17 17.2 17.8 15.8 19.1C17.2 20.9 18 23.3 18 26H29Z"
              fill="url(#splitElectric)"
            />

            {/* Central Glowing Synergy Badge */}
            <Circle cx="16" cy="22.5" r="4.2" fill="url(#splitBadgeGrad)" />
            <Circle cx="16" cy="22.5" r="3.4" stroke="#D97706" strokeWidth="0.8" fill="none" opacity="0.6" />

            {/* Split Division Icon inside Badge (÷) */}
            <Circle cx="16" cy="20.7" r="0.65" fill="#78350F" />
            <Rect x="14.2" y="22.1" width="3.6" height="0.8" rx="0.4" fill="#78350F" />
            <Circle cx="16" cy="24.3" r="0.65" fill="#78350F" />
          </G>
        ) : (
          <G fill="url(#splitInactiveGrad)">
            <Circle cx="10.5" cy="9.5" r="4.5" opacity="0.85" />
            <Path d="M4 26C4 21.2 7 17.8 11.5 17.8C13.5 17.8 15.3 18.6 16.5 20C15.3 21.6 14.5 23.7 14.5 26H4Z" opacity="0.85" />
            <Circle cx="21.5" cy="9.5" r="4.5" opacity="0.7" />
            <Path d="M28 26C28 21.2 25 17.8 20.5 17.8C18.5 17.8 16.7 18.6 15.5 20C16.7 21.6 17.5 23.7 17.5 26H28Z" opacity="0.7" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =============================================================================
// 4. CÁ NHÂN (PROFILE) - Miu Miu Lucky Cat & Crown
// Khuôn mặt mèo Miu Miu dễ thương, to rõ, tai hồng phấn, má ửng và chuông vàng
// =============================================================================
export function GlowProfileIcon({ focused, size = 30 }: GlowIconProps) {
  const s = size;
  return (
    <View style={[styles.iconWrapper, focused && styles.activePill]}>
      <Svg width={s} height={s} viewBox="0 0 32 32">
        <Defs>
          {/* Peach Sunset Face Gradient */}
          <LinearGradient id="miuFaceGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFA270" />
            <Stop offset="50%" stopColor="#FB7185" />
            <Stop offset="100%" stopColor="#E11D48" />
          </LinearGradient>
          {/* Ears Gradient */}
          <LinearGradient id="miuEarGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FDA4AF" />
            <Stop offset="100%" stopColor="#F43F5E" />
          </LinearGradient>
          {/* Bell Gradient */}
          <LinearGradient id="miuBellGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
          {/* Inactive */}
          <LinearGradient id="miuInactiveGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>
        </Defs>

        {focused ? (
          <G>
            {/* Cute Perky Cat Ears */}
            <Path d="M7 11.5L6 3.5L14.5 7.5Z" fill="url(#miuEarGrad)" />
            <Path d="M25 11.5L26 3.5L17.5 7.5Z" fill="url(#miuEarGrad)" />
            {/* Inner Ear Fluff */}
            <Path d="M8.2 9.8L7.5 5.5L12.5 7.8Z" fill="#FFF1F2" />
            <Path d="M23.8 9.8L24.5 5.5L19.5 7.8Z" fill="#FFF1F2" />

            {/* Miu Miu Chubby Round Face */}
            <Circle cx="16" cy="13.5" r="8.8" fill="url(#miuFaceGrad)" />
            <Circle cx="13.5" cy="10.8" r="2.2" fill="#FFFFFF" opacity="0.6" />

            {/* Blushing Rosy Cheeks */}
            <Circle cx="10.5" cy="15.2" r="1.6" fill="#FDA4AF" opacity="0.85" />
            <Circle cx="21.5" cy="15.2" r="1.6" fill="#FDA4AF" opacity="0.85" />

            {/* Cute Kawaii Eyes */}
            <Circle cx="13" cy="13" r="1.3" fill="#4C0519" />
            <Circle cx="19" cy="13" r="1.3" fill="#4C0519" />
            <Circle cx="12.6" cy="12.6" r="0.5" fill="#FFFFFF" />
            <Circle cx="18.6" cy="12.6" r="0.5" fill="#FFFFFF" />

            {/* Cute Tiny Nose */}
            <Path d="M15.4 14.6H16.6L16 15.3Z" fill="#881337" />

            {/* Rounded Body Base */}
            <Path
              d="M6 28.5C6 22.8 10.2 20 16 20C21.8 20 26 22.8 26 28.5H6Z"
              fill="url(#miuFaceGrad)"
            />

            {/* Lucky Golden Collar Bell */}
            <Circle cx="16" cy="20.5" r="3.2" fill="url(#miuBellGrad)" />
            <Circle cx="16" cy="20.5" r="2.4" stroke="#D97706" strokeWidth="0.6" fill="none" opacity="0.6" />
            <Circle cx="15.2" cy="19.7" r="0.8" fill="#FFFFFF" />
          </G>
        ) : (
          <G fill="url(#miuInactiveGrad)">
            <Path d="M7.5 11L6.5 4.5L14 8Z" opacity="0.8" />
            <Path d="M24.5 11L25.5 4.5L18 8Z" opacity="0.8" />
            <Circle cx="16" cy="13.5" r="8" opacity="0.9" />
            <Path d="M7 28.5C7 23.5 10.8 21 16 21C21.2 21 25 23.5 25 28.5H7Z" opacity="0.8" />
            <Circle cx="16" cy="21" r="2.5" fill="#FFFFFF" opacity="0.8" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// =============================================================================
// 5. NÚT THÊM GIAO DỊCH TRUNG TÂM (CENTER ADD BUTTON) - 9Paws Golden Orb
// Quả cầu 62px siêu nổi bật, dấu chân mèo Miu Miu dập nổi vàng óng và hào quang rực rỡ
// =============================================================================
export function GlowAddCenterButton(props: any) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.85}
      style={[styles.addButtonTouchable, props.style]}
      accessibilityRole="button"
      accessibilityLabel={t('tabs.addTransaction') || 'Thêm giao dịch'}
    >
      <View style={styles.addOrbContainer}>
        {/* Glowing Orange Halo behind Orb */}
        <View style={styles.glowHalo} />

        <Svg width={62} height={62} viewBox="0 0 62 62">
          <Defs>
            {/* Rich Sunset Flame Gradient */}
            <LinearGradient id="pawOrbGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFA726" />
              <Stop offset="45%" stopColor="#F15C22" />
              <Stop offset="100%" stopColor="#D81B60" />
            </LinearGradient>
            {/* Golden Paw Emboss Gradient */}
            <LinearGradient id="pawGoldRelief" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="40%" stopColor="#FFFBEB" />
              <Stop offset="100%" stopColor="#FDE68A" />
            </LinearGradient>
            {/* Glossy Upper Shine */}
            <LinearGradient id="orbGlassShine" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Main 3D Sphere */}
          <Circle cx="31" cy="31" r="29" fill="url(#pawOrbGrad)" />

          {/* Upper Glass Specular Arc */}
          <Path
            d="M8 27C8 16 18 8 31 8C44 8 54 16 54 27C46 20 37 18 31 18C25 18 16 20 8 27Z"
            fill="url(#orbGlassShine)"
          />

          {/* 9Paws Golden Mascot Paw (Large, Bold & Chunky) */}
          <G fill="url(#pawGoldRelief)">
            {/* 4 Chunky Rounded Toe Beans */}
            <Circle cx="21" cy="20.5" r="3.6" />
            <Circle cx="27.5" cy="17" r="4.1" />
            <Circle cx="34.5" cy="17" r="4.1" />
            <Circle cx="41" cy="20.5" r="3.6" />

            {/* Main Center Heart-shaped Curved Pad */}
            <Path
              d="M21.5 28.5C20.2 30.5 19.8 33 21.2 35.5C22.8 38.2 26.2 39.5 31 39.5C35.8 39.5 39.2 38.2 40.8 35.5C42.2 33 41.8 30.5 40.5 28.5C38.5 25.5 34.5 25 31 25C27.5 25 23.5 25.5 21.5 28.5Z"
            />
          </G>

          {/* Pure Brilliant Plus Symbol at Center of Pad */}
          <Path
            d="M31 29V36M27.5 32.5H34.5"
            stroke="#D97706"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    width: 44,
    borderRadius: 20,
  },
  activePill: {
    backgroundColor: 'rgba(241, 92, 34, 0.08)',
  },
  addButtonTouchable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOrbContainer: {
    width: 62,
    height: 62,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowHalo: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F15C22',
    opacity: 0.4,
    transform: [{ scale: 1.18 }],
    shadowColor: '#F15C22',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
});
