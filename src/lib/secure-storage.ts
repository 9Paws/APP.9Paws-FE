import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const setItem = async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return Promise.resolve();
    }
    await SecureStore.setItemAsync(key, value);
}

const getItem = async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
        const item = localStorage.getItem(key);
        return item;
    }
    return SecureStore.getItemAsync(key);
}

const removeItem = async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return Promise.resolve();
    }
    await SecureStore.deleteItemAsync(key);
}

export { getItem, removeItem, setItem };
