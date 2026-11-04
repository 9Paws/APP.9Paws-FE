import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  type: ToastType;
  title?: string;
  message: string;
  showToast: (options: { type?: ToastType; title?: string; message: string }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  type: 'info',
  title: undefined,
  message: '',

  showToast: ({ type = 'info', title, message }) => {
    set({
      visible: true,
      type,
      title,
      message,
    });
  },

  hideToast: () => {
    set({ visible: false });
  },
}));
