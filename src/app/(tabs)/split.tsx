import React from 'react';
import { Text, View } from 'react-native';

export default function SplitScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background-warm px-6">
      <Text className="text-xl font-bold text-text-main">Chia tiền nhóm</Text>
      <Text className="mt-2 text-center text-sm text-text-muted">
        Tự động hoá quyết toán hoá đơn nhóm & chia tiền cùng 9Paws.
      </Text>
    </View>
  );
}
