import React from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'outline' | 'ghost';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const variantStyles = {
    primary: {
        container: 'bg-brand shadow-sm',
        text: 'text-white font-bold',
        indicator: '#FFFFFF',
    },
    outline: {
        container: 'bg-transparent border border-gray-300',
        text: 'text-text-main font-semibold',
        indicator: '#F15C22',
    },
    ghost: {
        container: 'bg-transparent',
        text: 'text-brand font-semibold',
        indicator: '#F15C22',
    },
} as const;

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    isLoading = false,
    icon,
    disabled,
    className = '',
    ...props
}) => {
    const isDisabled = disabled || isLoading;
    const styles = variantStyles[variant];

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={isDisabled}
            className={`h-14 w-full flex-row items-center justify-center rounded-full px-6 ${styles.container} ${isDisabled ? 'opacity-60' : ''} ${className}`}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={styles.indicator} />
            ) : (
                <>
                    {icon && <View className="mr-3">{icon}</View>}
                    <Text className={`text-center text-base ${styles.text}`}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};