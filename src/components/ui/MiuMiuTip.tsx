import React from 'react';
import { Image, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface MiuMiuTipProps {
    content: string;
}

const MIU_MIU_IMAGE = require('@/assets/images/icon.png');

export const MiuMiuTip: React.FC<MiuMiuTipProps> = ({ content }) => {
    const { t } = useTranslation();

    return (
        <View className="flex-row items-center rounded-2xl border border-miumiu-border bg-miumiu-bg p-3.5 shadow-sm">
            <View className="mr-3 h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-amber-100/50">
                <Image
                    source={MIU_MIU_IMAGE}
                    className="h-10 w-10"
                    resizeMode="contain"
                />
            </View>

            <View className="flex-1">
                <Text className="text-xs font-bold text-amber-800">
                    {t('common.miumiuTipTitle')}
                </Text>
                <Text className="mt-0.5 text-xs leading-4 text-amber-900">
                    {content}
                </Text>
            </View>
        </View>
    );
};