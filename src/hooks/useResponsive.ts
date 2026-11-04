import { useWindowDimensions } from 'react-native';

export interface ResponsiveInfo {
    width: number;
    height: number;
    isSmallDevice: boolean;
    isMediumDevice: boolean;
    isTablet: boolean;
    maxContentWidth: number;
    contentHorizontalPadding: number;
    spacingScale: number;
}

export function useResponsive(): ResponsiveInfo {
    const { width, height } = useWindowDimensions();

    const isSmallDevice = width < 375 || height < 700;
    const isTablet = width >= 768;
    const isMediumDevice = !isSmallDevice && !isTablet;

    const maxContentWidth = isTablet ? 520 : Math.min(width, 480);
    const contentHorizontalPadding = isSmallDevice ? 16 : isTablet ? 32 : 24;
    const spacingScale = isSmallDevice ? 0.85 : isTablet ? 1.15 : 1.0;

    return {
        width,
        height,
        isSmallDevice,
        isMediumDevice,
        isTablet,
        maxContentWidth,
        contentHorizontalPadding,
        spacingScale,
    };
}
