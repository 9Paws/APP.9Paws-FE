import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  GlowOverviewIcon,
  GlowExpenseIcon,
  GlowAddCenterButton,
  GlowSplitIcon,
  GlowProfileIcon,
} from '@/components/icons/GlowTabIcons';

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
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          height: 70,
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
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.overview'),
          tabBarIcon: ({ focused }) => <GlowOverviewIcon focused={focused} size={25} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ focused }) => <GlowExpenseIcon focused={focused} size={25} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: (props) => <GlowAddCenterButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="split"
        options={{
          title: t('tabs.split'),
          tabBarIcon: ({ focused }) => <GlowSplitIcon focused={focused} size={25} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) => <GlowProfileIcon focused={focused} size={25} />,
        }}
      />
    </Tabs>
  );
}
