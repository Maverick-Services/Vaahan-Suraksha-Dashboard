import { create } from 'zustand'

const LOCALSTORAGE_KEY = "authState";

function loadFromLocalStorage() {
    if (typeof window === "undefined") return null;
    try {
        const str = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!str) return null;
        return JSON.parse(str);
    } catch {
        return null;
    }
}

function saveToLocalStorage({ user, accessToken, refreshToken }) {
    if (typeof window === "undefined") return;
    localStorage.setItem(
        LOCALSTORAGE_KEY,
        JSON.stringify({ user, accessToken, refreshToken })
    );
}

export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,

    setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
        saveToLocalStorage({ user, accessToken, refreshToken });
    },

    clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        if (typeof window !== "undefined") {
            localStorage.removeItem(LOCALSTORAGE_KEY);
        }
    },

    initializeAuth: () => {
        const saved = loadFromLocalStorage();
        if (saved && saved.user && saved.accessToken && saved.refreshToken) {
            set({
                user: saved.user,
                accessToken: saved.accessToken,
                refreshToken: saved.refreshToken,
            });
        }
    },

}))
