import React from 'react';
import { Text, View } from 'react-native';

export default function OverviewScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background-warm px-6">
      <Text className="text-xl font-bold text-text-main">Tổng quan chi tiêu</Text>
      <Text className="mt-2 text-center text-sm text-text-muted">
        Màn hình bảng tin & thống kê đang được phát triển.
      </Text>
    </View>
  );
}
