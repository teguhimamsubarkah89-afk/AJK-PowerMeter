// ============================================================
// DeviceInfoForm Component — AJK PowerMeter Dashboard
// Form info perangkat: read-only firmware + editable config
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { Save, Cpu, Wifi, Hash, MapPin, Tag, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import {
  fetchDeviceSettings, fetchDashboardConfig, updateDashboardConfig,
} from '@/lib/firebase/database';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
      <div className="space-y-4 sm:space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-4 sm:p-6">
            <div className="animate-shimmer h-24 rounded-xl" style={{ background: 'var(--bg-card-hover)' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* ═══ Info Perangkat (Read-Only) ═══ */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Info Perangkat
            </h3>
            <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Data firmware ESP32 (read-only)
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh} icon={<RefreshCw className="w-4 h-4" />}>
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {settings ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Device ID', value: settings.device_id, icon: Hash, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
              { label: 'Firmware', value: settings.firmware, icon: Cpu, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
              { label: 'IP Address', value: settings.ip, icon: Wifi, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
              { label: 'MAC Address', value: settings.mac, icon: Hash, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                    <p className="text-xs sm:text-sm font-mono truncate" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Badge variant="warning" size="md">Data perangkat belum tersedia</Badge>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Pastikan device sudah terhubung dan mengirim data.
            </p>
          </div>
        )}
      </div>

      {/* ═══ Konfigurasi Dashboard (Editable) ═══ */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="mb-4">
          <h3 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Konfigurasi Dashboard
          </h3>
          <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Pengaturan tambahan yang disimpan di dashboard
          </p>
        </div>

        <div className="space-y-4 max-w-lg">
          <Input
            label="Nama Alat"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Contoh: PowerMeter Gudang A"
            icon={<Tag className="w-4 h-4" />}
            helperText="Nama custom untuk identifikasi alat"
          />
          <Input
            label="Lokasi"
            value={deviceLocation}
            onChange={(e) => setDeviceLocation(e.target.value)}
            placeholder="Contoh: Panel MDP Lt.1"
            icon={<MapPin className="w-4 h-4" />}
            helperText="Lokasi pemasangan alat"
          />
          <Input
            label="Tarif PLN (Rp/kWh)"
            type="number"
            value={tariffInput}
            onChange={(e) => setTariffInput(e.target.value)}
            placeholder="1444.70"
            helperText="Default: Rp 1.444,70 (R-1/TR 2200 VA)"
          />
        </div>

        <div className="mt-6">
          <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      {/* ═══ Info Tambahan ═══ */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Informasi Sistem
        </h3>
        <div className="text-sm space-y-0">
          {[
            { label: 'Device ID Aktif', value: activeDeviceId },
            { label: 'Interval Real-time', value: '2 detik' },
            { label: 'Interval Log', value: '60 detik' },
            { label: 'Interval Settings', value: '5 menit' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2.5"
              style={{ borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none' }}
            >
              <span className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              <span className="text-xs sm:text-sm font-mono truncate ml-4" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
