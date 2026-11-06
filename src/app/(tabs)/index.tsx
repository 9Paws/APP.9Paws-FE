import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { OverviewSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/stores/auth.store';

export default function OverviewScreen() {
  const { t } = useTranslation();
  const { isLoading: isAuthLoading } = useAuthStore();
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOverviewLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  }, []);

  if (isOverviewLoading || isAuthLoading) {
    return <OverviewSkeleton />;
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
        <Text className="text-xl font-bold text-text-main">{t('tabs.overviewTitle')}</Text>
        <Text className="mt-2 text-center text-sm text-text-muted">
          {t('tabs.overviewDesc')}
        </Text>
      </View>
    </ScrollView>
  );
}
