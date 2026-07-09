// ============================================================
// Login Page — AJK PowerMeter Dashboard
// Halaman login dengan desain premium dark glassmorphism
// ============================================================

'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff, Zap } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || isSubmitting) return;

    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  const isFormDisabled = loading || isSubmitting;

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg" />
      <div className="login-grid-overlay" />

      {/* Decorative Glow Orbs */}
      <div className="login-orb login-orb--blue" />
      <div className="login-orb login-orb--violet" />
      <div className="login-orb login-orb--emerald" />

      {/* Main Content */}
      <div className="login-container">
        {/* Logo & Brand */}
        <div className="login-brand">
          <div className="login-logo-wrapper">
            <Image
              src="/logo-ajk.png"
              alt="Logo AJK"
              width={52}
              height={52}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="login-title">AJK PowerMeter</h1>
          <p className="login-subtitle">
            <Zap className="inline w-3.5 h-3.5 mr-1 text-amber-400" />
            Dashboard Monitoring Kelistrikan
          </p>
        </div>

        {/* Form Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-card-title">Masuk</h2>
            <p className="login-card-desc">
              Masukkan kredensial untuk mengakses dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <div className="login-input-wrapper">
                <Mail className="login-input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ajk.co.id"
                  disabled={isFormDisabled}
                  required
                  autoComplete="email"
                  className="login-input"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isFormDisabled}
                  required
                  autoComplete="current-password"
                  className="login-input login-input--password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="login-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isFormDisabled || !email || !password}
              className="login-submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="login-footer">
          © {new Date().getFullYear()} PT. Adi Joyo Kusumo — R&D Division
        </p>
      </div>
    </div>
  );
}
