// ============================================================
// DeviceInfoForm Component — AJK PowerMeter Dashboard v2.0
// Premium device info cards + editable config form
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { Save, Cpu, Wifi, Hash, MapPin, Tag, RefreshCw, Loader2 } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import {
  fetchDeviceSettings, fetchDashboardConfig, updateDashboardConfig,
} from '@/lib/firebase/database';
import toast from 'react-hot-toast';
import type { DeviceSettings } from '@/types';

export function DeviceInfoForm() {
  const activeDeviceId = useAppStore((s) => s.activeDeviceId);
  const tariffPerKwh = useAppStore((s) => s.tariffPerKwh);
  const setTariffPerKwh = useAppStore((s) => s.setTariffPerKwh);

  const [settings, setSettings] = useState<DeviceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deviceName, setDeviceName] = useState('');
  const [deviceLocation, setDeviceLocation] = useState('');
  const [tariffInput, setTariffInput] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [settingsData, configData] = await Promise.all([
          fetchDeviceSettings(activeDeviceId),
          fetchDashboardConfig(activeDeviceId),
        ]);
        setSettings(settingsData);
        setDeviceName(configData?.name || '');
        setDeviceLocation(configData?.location || '');
        setTariffInput(String(tariffPerKwh));
      } catch {
        toast.error('Gagal memuat informasi perangkat.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeDeviceId, tariffPerKwh]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDashboardConfig(activeDeviceId, { name: deviceName.trim(), location: deviceLocation.trim() });
      const parsedTariff = parseFloat(tariffInput);
      if (!isNaN(parsedTariff) && parsedTariff > 0) setTariffPerKwh(parsedTariff);
      toast.success('Pengaturan berhasil disimpan!');
    } catch {
      toast.error('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const settingsData = await fetchDeviceSettings(activeDeviceId);
      setSettings(settingsData);
      toast.success('Data perangkat diperbarui.');
    } catch {
      toast.error('Gagal memperbarui data perangkat.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-5">
            <div className="animate-shimmer h-24 rounded-xl" style={{ background: 'var(--bg-card-hover)' }} />
          </div>
        ))}
      </div>
    );
  }

  const deviceInfoItems = settings ? [
    { label: 'Device ID', value: settings.device_id, icon: Hash, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Firmware', value: settings.firmware, icon: Cpu, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'IP Address', value: settings.ip, icon: Wifi, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'MAC Address', value: settings.mac, icon: Hash, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ] : [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ═══ Info Perangkat (Read-Only) ═══ */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Info Perangkat
            </h3>
            <p className="text-[10px] sm:text-xs mt-0.5 text-[var(--text-muted)]">
              Data firmware ESP32 (read-only)
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5"
            style={{ color: 'var(--text-secondary)', minHeight: '36px' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {settings ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deviceInfoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3.5 rounded-xl transition-colors hover:bg-white/[0.02]"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)]">{item.label}</p>
                    <p className="text-xs sm:text-sm font-mono truncate text-[var(--text-primary)]">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Data perangkat belum tersedia
            </div>
            <p className="text-xs mt-2 text-[var(--text-muted)]">
              Pastikan device sudah terhubung dan mengirim data.
            </p>
          </div>
        )}
      </div>

      {/* ═══ Konfigurasi Dashboard (Editable) ═══ */}
      <div className="glass-card p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            Konfigurasi Dashboard
          </h3>
          <p className="text-[10px] sm:text-xs mt-0.5 text-[var(--text-muted)]">
            Pengaturan tambahan yang disimpan di dashboard
          </p>
        </div>

        <div className="space-y-4 max-w-lg">
          {/* Nama Alat */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Nama Alat
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="Contoh: PowerMeter Gudang A"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/30"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                minHeight: '44px',
              }}
            />
            <p className="text-[10px] text-[var(--text-muted)]">Nama custom untuk identifikasi alat</p>
          </div>

          {/* Lokasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              Lokasi
            </label>
            <input
              type="text"
              value={deviceLocation}
              onChange={(e) => setDeviceLocation(e.target.value)}
              placeholder="Contoh: Panel MDP Lt.1"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/30"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                minHeight: '44px',
              }}
            />
            <p className="text-[10px] text-[var(--text-muted)]">Lokasi pemasangan alat</p>
          </div>

          {/* Tarif PLN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Tarif PLN (Rp/kWh)
            </label>
            <input
              type="number"
              value={tariffInput}
              onChange={(e) => setTariffInput(e.target.value)}
              placeholder="1444.70"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/30"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                minHeight: '44px',
              }}
            />
            <p className="text-[10px] text-[var(--text-muted)]">Default: Rp 1.444,70 (R-1/TR 2200 VA)</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              minHeight: '44px',
            }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Pengaturan
          </button>
        </div>
      </div>

      {/* ═══ Info Tambahan ═══ */}
      <div className="glass-card p-5 sm:p-6">
        <h3 className="text-sm sm:text-base font-bold mb-4 text-[var(--text-primary)]">
          Informasi Sistem
        </h3>
        <div className="space-y-0">
          {[
            { label: 'Device ID Aktif', value: activeDeviceId },
            { label: 'Interval Real-time', value: '2 detik' },
            { label: 'Interval Log', value: '60 detik' },
            { label: 'Interval Settings', value: '5 menit' },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-color)' : 'none' }}
            >
              <span className="text-xs sm:text-sm text-[var(--text-secondary)]">{item.label}</span>
              <span className="text-xs sm:text-sm font-mono truncate ml-4 text-[var(--text-primary)]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
