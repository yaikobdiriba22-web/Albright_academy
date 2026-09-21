import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Info,
  GraduationCap,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { Button } from '../../components/ui/Button.tsx';

interface AdminLoginViewProps {
  navigate: (route: string) => void;
  onLoginSuccess: (user: any) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  navigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@albrightacademy.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        {/* Brand header */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 p-3 rounded-2xl bg-[#0f2444] text-amber-400 mb-4 shadow-md cursor-pointer"
          >
            <GraduationCap className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-extrabold text-[#0f2444] font-display">
            Albright Academy
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Administrative Portal
          </p>
        </div>

        {/* Development credential reminder notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <Info className="w-4 h-4 shrink-0" />
            <span>Development Administrator Credentials</span>
          </div>
          <p className="text-amber-700">
            Email: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">admin@albrightacademy.local</code>
          </p>
          <p className="text-amber-700">
            Password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">ChangeMe123!</code>
          </p>
          <p className="text-2xs text-amber-600 italic pt-1">
            * Clearly marked as dev credential. Please change in production via Settings.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-slate-200 shadow-xl">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  id="admin-email-input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@albrightacademy.local"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  id="admin-password-input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                id="admin-login-submit-btn"
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isLoading}
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ← Return to Albright Academy Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
