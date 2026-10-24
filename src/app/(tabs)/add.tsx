import React from 'react';
import { Text, View } from 'react-native';

export default function AddScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background-warm px-6">
      <Text className="text-xl font-bold text-text-main">Thêm giao dịch mới</Text>
      <Text className="mt-2 text-center text-sm text-text-muted">
        Ghi chép chi tiêu nhanh hoặc quét hóa đơn thông minh.
      </Text>
    </View>
  );
}
