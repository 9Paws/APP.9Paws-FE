import React from 'react';
import { Text, View } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background-warm px-6">
      <Text className="text-xl font-bold text-text-main">Lịch sử giao dịch</Text>
      <Text className="mt-2 text-center text-sm text-text-muted">
        Danh sách thu chi và biên lai chi tiêu của bạn.
      </Text>
    </View>
  );
}
