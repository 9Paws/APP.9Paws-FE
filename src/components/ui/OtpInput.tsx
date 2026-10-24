import React, { useRef } from 'react';
import {
    NativeSyntheticEvent,
    TextInput,
    View,
} from 'react-native';

interface OtpInputProps {
    value: string;
    onChange: (otp: string) => void;
    length?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    value,
    onChange,
    length = 6,
}) => {
    const inputRefs = useRef<(any | null)[]>([]);
    const otp = value.replace(/[^0-9]/g, '').slice(0, length);
    const digits = otp.split('').concat(Array(length).fill('')).slice(0, length);

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const handleChangeText = (text: string, index: number) => {
        const enteredDigits = text.replace(/[^0-9]/g, '').slice(0, length - index);

        if (!enteredDigits) {
            const nextOtp = otp.slice(0, index) + otp.slice(index + 1);
            onChange(nextOtp);
            return;
        }

        const nextDigits = [...digits];
        enteredDigits.split('').forEach((digit, offset) => {
            nextDigits[index + offset] = digit;
        });

        onChange(nextDigits.join('').slice(0, length));

        const nextIndex = Math.min(index + enteredDigits.length, length - 1);
        focusInput(nextIndex);
    };

    const handleKeyPress = (
        event: NativeSyntheticEvent<{ key: string }>,
        index: number
    ) => {
        if (event.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            focusInput(index - 1);
        }
    };

    return (
        <View className="w-full flex-row justify-between">
            {Array.from({ length }).map((_, index) => {
                const isActive = otp.length === index;
                const isFilled = Boolean(digits[index]);

                return (
                    <View
                        key={index}
                        className={`h-16 w-12 items-center justify-center rounded-2xl border-2 bg-white shadow-sm ${isActive
                            ? 'border-brand bg-orange-50/20'
                            : isFilled
                                ? 'border-brand/80'
                                : 'border-gray-200'
                            }`}
                    >
                        <TextInput
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            value={digits[index]}
                            onChangeText={(text) => handleChangeText(text, index)}
                            onKeyPress={(event) => handleKeyPress(event, index)}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            maxLength={length}
                            textAlign="center"
                            className="h-full w-full text-center text-2xl font-bold text-text-main"
                        />
                    </View>
                );
            })}
        </View>
    );
};