// ============================================================
// Zustand Global Store — AJK PowerMeter Dashboard
// State management untuk sidebar, theme, dan device selection
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // ── Sidebar ──
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // ── Theme ──
  darkMode: boolean;
  toggleDarkMode: () => void;

  // ── Device ──
  activeDeviceId: string;
  setActiveDeviceId: (deviceId: string) => void;

  // ── Tariff ──
  tariffPerKwh: number;
  setTariffPerKwh: (tariff: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // ── Sidebar ──
      sidebarOpen: false,
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapsed: () => 
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // ── Theme ──
      darkMode: true, // Default dark mode
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // ── Device ──
      activeDeviceId: process.env.NEXT_PUBLIC_DEFAULT_DEVICE_ID || 'XXXXXXXXXXXX',
      setActiveDeviceId: (deviceId) => set({ activeDeviceId: deviceId }),

      // ── Tariff ──
      tariffPerKwh: 1_444.70,
      setTariffPerKwh: (tariff) => set({ tariffPerKwh: tariff }),
    }),
    {
      name: 'ajk-powermeter-settings', // localStorage key
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
        activeDeviceId: state.activeDeviceId,
        tariffPerKwh: state.tariffPerKwh,
      }),
    }
  )
);
