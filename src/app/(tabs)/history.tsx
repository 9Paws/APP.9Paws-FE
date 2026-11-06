import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HistorySkeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/stores/auth.store';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { isLoading: isAuthLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  }, []);

  if (isLoading || isAuthLoading) {
    return <HistorySkeleton />;
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-background-warm"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#F15C22"
          colors={['#F15C22']}
        />
      }
    >
      <View className="flex-1 items-center justify-center px-6 py-12">
        <Text className="text-xl font-bold text-text-main">{t('tabs.historyTitle')}</Text>
        <Text className="mt-2 text-center text-sm text-text-muted">
          {t('tabs.historyDesc')}
        </Text>
      </View>
    </ScrollView>
  );
}
