import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  X,
  Phone,
  CheckCircle2,
  School,
  Sparkles,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { Button } from '../../components/ui/Button.tsx';
import { useTranslation } from '../../i18n/LanguageContext.tsx';
import { Language } from '../../i18n/types.ts';

interface AdminLoginViewProps {
  navigate: (route: string) => void;
  onLoginSuccess: (user: any) => void;
  currentUser?: any;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  navigate,
  onLoginSuccess,
  currentUser,
}) => {
  const { language, setLanguage, d } = useTranslation();

  // Translations with fallbacks
  const t = d.adminAuth || {
    portalTitle: 'Administrative Portal',
    adminLogin: 'Admin Login',
    portalSubtitle: 'Authorized Staff & School Administrators Only',
    emailOrUsername: 'Email Address or Username',
    emailOrUsernamePlaceholder: 'admin@albrightacademy.edu or username',
    password: 'Password',
    passwordPlaceholder: 'Enter your administrator password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    rememberMe: 'Remember me on this device',
    loginButton: 'Sign In to Admin Portal',
    loggingIn: 'Verifying Credentials...',
    forgotPassword: 'Forgot password?',
    forgotPasswordTitle: 'Administrator Credential Recovery',
    forgotPasswordDesc:
      'For institutional data governance and student privacy compliance, administrator password resets must be authorized by the School Leadership or IT Administration Office. Please contact dinigaatrading@gmail.com or call 0923014132.',
    emailRequiredError: 'Please enter your administrator email or username.',
    passwordRequiredError: 'Please enter your administrator password.',
    authFailedError: 'Invalid credentials. Please verify your email/username and password.',
    backToHome: 'Return to Albright Academy Public Website',
    alreadyLoggedInTitle: 'Already Authenticated',
    alreadyLoggedInDesc: 'You are currently signed in as an administrator.',
    goToDashboard: 'Go to Admin Dashboard',
    logout: 'Sign Out',
  };

  // Form states - clean with NO hardcoded credentials
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Restore remembered username on mount
  useEffect(() => {
    const remembered = localStorage.getItem('albright_admin_remembered_user');
    if (remembered) {
      setIdentifier(remembered);
      setRememberMe(true);
    }
  }, []);

  const validate = (): boolean => {
    const errors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      errors.identifier = t.emailRequiredError;
    }

    if (!password) {
      errors.password = t.passwordRequiredError;
    } else if (password.length < 4) {
      errors.password =
        language === 'am'
          ? 'የይለፍ ቃል ቢያንስ 4 ፊደላት/ቁጥሮች መሆን አለበት።'
          : language === 'om'
          ? 'Jechi darbii yoo xiqqaate qubee 4 ta’uu qaba.'
          : 'Password must be at least 4 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.login(identifier.trim(), password);

      // Handle remember me preference
      if (rememberMe) {
        localStorage.setItem('albright_admin_remembered_user', identifier.trim());
      } else {
        localStorage.removeItem('albright_admin_remembered_user');
      }

      onLoginSuccess(res.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setAuthError(err.message || t.authFailedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top utility bar */}
      <header className="w-full bg-white border-b border-slate-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            title="Return to homepage"
          >
            <div className="w-10 h-10 rounded-full border border-amber-400 overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Albright Academy Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="block text-sm font-extrabold text-[#0f2444] font-display tracking-tight group-hover:text-amber-600 transition-colors">
                Albright Academy
              </span>
              <span className="block text-[10px] font-semibold text-amber-700 tracking-wider uppercase">
                Center of Excellence and Innovation
              </span>
            </div>
          </button>

          {/* Multilingual Selector: EN | አማ | Afaan Oromoo */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#0f2444] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('am')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-serif ${
                language === 'am'
                  ? 'bg-[#0f2444] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              አማ
            </button>
            <button
              type="button"
              onClick={() => setLanguage('om')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                language === 'om'
                  ? 'bg-[#0f2444] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Afaan Oromoo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Active Session Notice if already logged in */}
          {currentUser && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 mb-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.alreadyLoggedInTitle}</span>
              </div>
              <p className="text-xs text-emerald-700 mb-3">
                {t.alreadyLoggedInDesc} ({currentUser.email || currentUser.name})
              </p>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full text-xs"
                >
                  {t.goToDashboard}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await api.logout();
                    window.location.reload();
                  }}
                  className="w-auto text-xs"
                >
                  {t.logout}
                </Button>
              </div>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="h-2 bg-gradient-to-r from-[#0f2444] via-amber-500 to-[#1e3a66]" />

            <div className="p-6 sm:p-8">
              {/* Header Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0f2444]/5 text-[#0f2444] mb-3 border border-[#0f2444]/10 shadow-sm">
                  <ShieldCheck className="w-7 h-7 text-[#0f2444]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2444] font-display">
                  {t.adminLogin}
                </h1>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500">
                  {t.portalSubtitle}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>KG1 – Grade 8 Central Management</span>
                </div>
              </div>

              {/* Authentication Error Banner */}
              {authError && (
                <div
                  role="alert"
                  className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
                >
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold block">{t.authFailedError}</span>
                    <span className="text-rose-700 text-xs mt-0.5 block">{authError}</span>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email / Username field */}
                <div>
                  <label
                    htmlFor="admin-identifier"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    {t.emailOrUsername} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-identifier"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (validationErrors.identifier) {
                          setValidationErrors((prev) => ({ ...prev, identifier: undefined }));
                        }
                      }}
                      placeholder={t.emailOrUsernamePlaceholder}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        validationErrors.identifier
                          ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500'
                          : 'border-slate-300 bg-white focus:ring-[#0f2444] focus:border-[#0f2444]'
                      }`}
                    />
                  </div>
                  {validationErrors.identifier && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{validationErrors.identifier}</span>
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      {t.password} <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer hover:underline"
                    >
                      {t.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }}
                      placeholder={t.passwordPlaceholder}
                      className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        validationErrors.password
                          ? 'border-rose-300 bg-rose-50/30 focus:ring-rose-500'
                          : 'border-slate-300 bg-white focus:ring-[#0f2444] focus:border-[#0f2444]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={showPassword ? t.hidePassword : t.showPassword}
                      aria-label={showPassword ? t.hidePassword : t.showPassword}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{validationErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="admin-remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#0f2444] focus:ring-[#0f2444] cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {t.rememberMe}
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    id="admin-submit-login-button"
                    variant="primary"
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="w-full text-base font-bold shadow-lg shadow-slate-900/10 hover:shadow-xl transition-all"
                    icon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
                  >
                    {isLoading ? t.loggingIn : t.loginButton}
                  </Button>
                </div>
              </form>

              {/* Bottom Navigation */}
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0f2444] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.backToHome}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick links to other portals */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 mb-2">Looking for other school portals?</p>
            <div className="inline-flex items-center justify-center gap-3 text-xs font-semibold text-amber-700">
              <button
                type="button"
                onClick={() => navigate('/parent/login')}
                className="hover:underline cursor-pointer"
              >
                {d.portals.parentTitle}
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => navigate('/teacher/login')}
                className="hover:underline cursor-pointer"
              >
                {d.portals.teacherTitle}
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => navigate('/student/login')}
                className="hover:underline cursor-pointer"
              >
                {d.portals.studentTitle}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f2444]">
                  {t.forgotPasswordTitle}
                </h3>
                <p className="text-xs text-slate-500">Security & Access Protocol</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>{t.forgotPasswordDesc}</p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold text-slate-500">Registrar / IT:</span>
                  <a
                    href="mailto:dinigaatrading@gmail.com"
                    className="text-[#0f2444] font-bold hover:underline"
                  >
                    dinigaatrading@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold text-slate-500">Direct Telephone:</span>
                  <a href="tel:0923014132" className="text-[#0f2444] font-bold hover:underline">
                    0923014132
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold text-slate-500">Campus Location:</span>
                  <span className="text-slate-800">Sheggar city, Gefarsa Gujjee, kella</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowForgotModal(false)}
              >
                {d.common.close}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} Albright Academy • KG1 – Grade 8 • Center of Excellence and Innovation
        </p>
      </footer>
    </div>
  );
};
