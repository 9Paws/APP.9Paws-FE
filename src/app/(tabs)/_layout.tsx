import React from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { History, LayoutGrid, Plus, User, Users } from 'lucide-react-native';

function AddCenterButton({ onPress }: { onPress?: (e?: any) => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.addButton}
      accessibilityRole="button"
      accessibilityLabel="Tạo giao dịch mới"
    >
      <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F15C22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#F15C22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default function TabsLayout() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width >= 640;
  const maxContentWidth = 500;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        sceneStyle: {
          backgroundColor: '#FAF7F2',
          maxWidth: isWide ? maxContentWidth : undefined,
          width: '100%',
          alignSelf: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          maxWidth: isWide ? maxContentWidth : undefined,
          width: '100%',
          alignSelf: 'center',
          ...(isWide
            ? {
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderLeftColor: '#F3F4F6',
                borderRightColor: '#F3F4F6',
              }
            : {}),
        },
        tabBarActiveTintColor: '#F15C22',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.overview'),
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: (props) => <AddCenterButton onPress={props.onPress ?? undefined} />,
        }}
      />
      <Tabs.Screen
        name="split"
        options={{
          title: t('tabs.split'),
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
