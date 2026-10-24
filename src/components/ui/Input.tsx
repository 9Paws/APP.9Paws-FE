import { CheckCircle2, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    isPassword?: boolean;
    isValid?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    isPassword = false,
    isValid = false,
    className = '',
    onFocus,
    onBlur,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const borderClassName = error
        ? 'border-red-400'
        : isFocused
            ? 'border-brand'
            : 'border-gray-200';

    const handleFocus: TextInputProps['onFocus'] = event => {
        setIsFocused(true);
        onFocus?.(event);
    };

    const handleBlur: TextInputProps['onBlur'] = event => {
        setIsFocused(false);
        onBlur?.(event);
    };

    return (
        <View className="w-full">
            {label && (
                <Text className="mb-2 text-sm font-semibold text-text-main">
                    {label}
                </Text>
            )}

            <View
                className={`h-14 w-full flex-row items-center rounded-2xl border bg-white px-4 shadow-sm ${borderClassName} ${className}`}
            >
                {leftIcon && <View className="mr-3">{leftIcon}</View>}

                <TextInput
                    {...props}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={isPassword && !showPassword}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="flex-1 text-base text-text-main"
                />

                {isValid && !error && (
                    <View className="ml-2">
                        <CheckCircle2 size={20} color="#10B981" />
                    </View>
                )}

                {isPassword && (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                        onPress={() => setShowPassword(current => !current)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        className="ml-2"
                    >
                        {showPassword ? (
                            <EyeOff size={20} color="#6B7280" />
                        ) : (
                            <Eye size={20} color="#6B7280" />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text className="mt-1.5 text-xs font-medium text-red-500">
                    {error}
                </Text>
            )}
        </View>
    );
};