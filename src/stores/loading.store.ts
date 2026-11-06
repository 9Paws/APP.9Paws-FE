import { create } from 'zustand';

/** Chờ một chút trước khi hiện overlay để request nhanh không gây nhấp nháy */
const SHOW_DELAY = 200;
/** Giữ overlay tối thiểu lâu để không bị nhấp nháy khi vừa hiện vừa ẩn */
const MIN_VISIBLE_DURATION = 500;

interface LoadingState {
    visible: boolean;
    message: string | undefined;
    showLoading: (message?: string) => void;
    hideLoading: () => void;
    beginRequest: () => void;
    endRequest: () => void;
}

let pendingRequests = 0;
let manualHolds = 0;
let visibleSince = 0;
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useLoadingStore = create<LoadingState>((set, get) => ({
    visible: false,
    message: undefined,

    showLoading: (message) => {
        manualHolds += 1;
        clearShowTimer();
        clearHideTimer();
        visibleSince = Date.now();
        set({ visible: true, message });
    },

    hideLoading: () => {
        manualHolds = Math.max(0, manualHolds - 1);
        if (manualHolds === 0 && pendingRequests === 0) {
            scheduleHide(set, get);
        }
    },

    beginRequest: () => {
        pendingRequests += 1;
        // Huỷ lịch ẩn đang chờ: request mới đang chạy nên overlay phải tiếp tục hiện
        clearHideTimer();
        if (!get().visible && !showTimer) {
            showTimer = setTimeout(() => {
                showTimer = null;
                if (pendingRequests === 0) return;
                visibleSince = Date.now();
                set({ visible: true });
            }, SHOW_DELAY);
        }
    },

    endRequest: () => {
        pendingRequests = Math.max(0, pendingRequests - 1);
        if (pendingRequests === 0 && manualHolds === 0) {
            scheduleHide(set, get);
        }
    },
}));

function clearShowTimer() {
    if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
    }
}

function clearHideTimer() {
    if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
    }
}

function scheduleHide(
    set: (partial: Partial<LoadingState>) => void,
    get: () => LoadingState
) {
    clearShowTimer();

    if (!get().visible) {
        set({ visible: false, message: undefined });
        return;
    }

    const remaining = MIN_VISIBLE_DURATION - (Date.now() - visibleSince);

    if (remaining <= 0) {
        clearHideTimer();
        set({ visible: false, message: undefined });
        return;
    }

    if (hideTimer) return;
    hideTimer = setTimeout(() => {
        hideTimer = null;
        set({ visible: false, message: undefined });
    }, remaining);
}
