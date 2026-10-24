import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function AddScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background-warm px-6">
      <Text className="text-xl font-bold text-text-main">{t('tabs.addTitle')}</Text>
      <Text className="mt-2 text-center text-sm text-text-muted">
        {t('tabs.addDesc')}
      </Text>
    </View>
  );
}
