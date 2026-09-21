import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  MapPin,
  Compass,
  UserCheck,
  Globe,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { SchoolSettings } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { MovingBanner } from '../../components/ui/MovingBanner.tsx';

interface AdminSettingsViewProps {
  settings: SchoolSettings | null;
  onSettingsUpdated: (newSettings: SchoolSettings) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  const [formData, setFormData] = useState<Partial<SchoolSettings>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewVariant, setPreviewVariant] = useState<'dark' | 'gold'>('dark');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field: keyof SchoolSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const updated = await api.updateSettings(formData);
      onSettingsUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update school settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2444] font-display">
            School Configuration & Content Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control the school identity, contact information, mission, vision, and principal's message.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>School settings updated successfully! Live website changes are now active.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Official Moving Announcement Animation (Created and Managed by Admin) */}
        <div className="bg-white rounded-3xl border-2 border-amber-400/50 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-[#0f2444] font-display">
                    Moving Animation Banner (Created by Admin)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Live Broadcast
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  The animated scrolling marquee displaying "Albright Academy — Center of Excellence and Innovation".
                </p>
              </div>
            </div>

            {/* Toggle Active Status */}
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shrink-0">
              <span className="text-xs font-bold text-slate-700 pl-2">Display:</span>
              <button
                type="button"
                onClick={() => handleChange('tickerEnabled', formData.tickerEnabled === false ? true : false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  formData.tickerEnabled !== false
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    formData.tickerEnabled !== false ? 'bg-white animate-pulse' : 'bg-slate-400'
                  }`}
                />
                {formData.tickerEnabled !== false ? 'Active (Live)' : 'Paused / Hidden'}
              </button>
            </div>
          </div>

          {/* Real-time Interactive Admin Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Eye className="w-4 h-4 text-amber-500" />
                <span>Live Admin Interactive Preview</span>
                <span className="text-slate-400 font-normal hidden sm:inline">
                  (instantly renders your edits as you type)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewVariant('dark')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    previewVariant === 'dark'
                      ? 'bg-[#0f2444] text-amber-400 font-bold'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Dark Ribbon
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewVariant('gold')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    previewVariant === 'gold'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Gold Ribbon
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <MovingBanner
                variant={previewVariant}
                showControls={true}
                overrideText={formData.tickerText || 'Albright Academy — Center of Excellence and Innovation'}
                overrideBadge={formData.tickerBadge || 'Created by Admin'}
                overrideSubtext={formData.tickerSubtext || 'Center of Excellence and Innovation • KG1 to Grade 8'}
                overrideSecondaryText={
                  formData.tickerSecondaryText ||
                  'Admissions Open 2026/2018 E.C. — Sheggar City, Gefarsa Gujjee, kella'
                }
                overrideSpeed={formData.tickerSpeed || 'normal'}
              />
            </div>
          </div>

          {/* Interactive Edit Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Primary Animated Text */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Primary Animated Moving Text / Headline *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleChange('tickerText', 'Albright Academy — Center of Excellence and Innovation')
                  }
                  className="text-2xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default Motto</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.tickerText ?? 'Albright Academy — Center of Excellence and Innovation'}
                onChange={(e) => handleChange('tickerText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-[#0f2444] focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                placeholder="Albright Academy — Center of Excellence and Innovation"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-2xs text-slate-400 font-medium self-center">1-Click Presets:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleChange('tickerText', 'Albright Academy — Center of Excellence and Innovation')
                  }
                  className="text-2xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 transition-colors cursor-pointer"
                >
                  Default Motto
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      'tickerText',
                      'Albright Academy — Center of Excellence and Innovation • Admissions Open 2026/2018 E.C.'
                    )
                  }
                  className="text-2xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 transition-colors cursor-pointer"
                >
                  With Admissions Alert
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      'tickerText',
                      'Albright Academy — Nurturing Critical Thinking, Character & Innovation'
                    )
                  }
                  className="text-2xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 transition-colors cursor-pointer"
                >
                  Character & Innovation
                </button>
              </div>
            </div>

            {/* Admin Badge Tag */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Attribution / Badge Tag
              </label>
              <input
                type="text"
                value={formData.tickerBadge ?? 'Created by Admin'}
                onChange={(e) => handleChange('tickerBadge', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                placeholder="Created by Admin"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Created by Admin', 'Admin Notice', 'Official Slogan', 'Admissions Alert'].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleChange('tickerBadge', tag)}
                      className="text-2xs px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Animation Speed Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Animation Scrolling Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fast', label: 'Fast (16s)', desc: 'Dynamic alert' },
                  { id: 'normal', label: 'Standard (24s)', desc: 'Recommended' },
                  { id: 'slow', label: 'Smooth Slow (36s)', desc: 'Relaxed reading' },
                ].map((spd) => (
                  <button
                    key={spd.id}
                    type="button"
                    onClick={() => handleChange('tickerSpeed', spd.id)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                      (formData.tickerSpeed || 'normal') === spd.id
                        ? 'border-[#0f2444] bg-[#0f2444] text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{spd.label}</div>
                    <div
                      className={`text-[10px] ${
                        (formData.tickerSpeed || 'normal') === spd.id
                          ? 'text-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {spd.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subtext */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Scrolling Subtitle / Grades
              </label>
              <input
                type="text"
                value={
                  formData.tickerSubtext ?? 'Center of Excellence and Innovation • KG1 to Grade 8'
                }
                onChange={(e) => handleChange('tickerSubtext', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                placeholder="Center of Excellence and Innovation • KG1 to Grade 8"
              />
            </div>

            {/* Secondary Announcement */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secondary Scrolling Announcement / Phone
              </label>
              <input
                type="text"
                value={
                  formData.tickerSecondaryText ??
                  'Admissions Open 2026/2018 E.C. — Sheggar City, Gefarsa Gujjee, kella • Phone: 0923014132'
                }
                onChange={(e) => handleChange('tickerSecondaryText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                placeholder="Admissions Open 2026/2018 E.C. — Sheggar City, Gefarsa Gujjee"
              />
            </div>
          </div>

          {/* Admin Metadata Footer */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-2xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Configured and published by Albright Academy Administration ({formData.tickerCreatedBy || 'Admin'})
              </span>
            </div>
            <div className="text-slate-400">
              Changes apply instantly across all pages upon saving
            </div>
          </div>
        </div>

        {/* Basic School Identity */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-[#0f2444] font-display">
              School Branding & Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official School Name *
              </label>
              <input
                type="text"
                required
                value={formData.schoolName || ''}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                School Slogan *
              </label>
              <input
                type="text"
                required
                value={formData.slogan || ''}
                onChange={(e) => handleChange('slogan', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>
          </div>
        </div>

        {/* Contact & Physical Address */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <Phone className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-[#0f2444] font-display">
              Contact Channels & Campus Coordinates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Physical Address *
              </label>
              <input
                type="text"
                required
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Maps Embed / Navigation URL
              </label>
              <input
                type="url"
                value={formData.mapsUrl || ''}
                onChange={(e) => handleChange('mapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Latitude Coordinate
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude || 9.0108}
                onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Longitude Coordinate
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude || 38.7613}
                onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Facebook Page URL
              </label>
              <input
                type="text"
                value={formData.facebookUrl || ''}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telegram Channel
              </label>
              <input
                type="text"
                value={formData.telegramUrl || ''}
                onChange={(e) => handleChange('telegramUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                YouTube Channel
              </label>
              <input
                type="text"
                value={formData.youtubeUrl || ''}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>
          </div>
        </div>

        {/* Mission, Vision & About Narrative */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-[#0f2444] font-display">
              Mission, Vision & Institutional Narrative
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              About Albright Academy (Overview Paragraph)
            </label>
            <textarea
              rows={3}
              value={formData.about || ''}
              onChange={(e) => handleChange('about', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mission Statement
              </label>
              <textarea
                rows={4}
                value={formData.mission || ''}
                onChange={(e) => handleChange('mission', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vision Statement
              </label>
              <textarea
                rows={4}
                value={formData.vision || ''}
                onChange={(e) => handleChange('vision', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>
          </div>
        </div>

        {/* Principal Message Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-[#0f2444] font-display">
              Principal's Welcome Address & Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Principal Full Name
              </label>
              <input
                type="text"
                value={formData.principalName || ''}
                onChange={(e) => handleChange('principalName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Principal Role / Title
              </label>
              <input
                type="text"
                value={formData.principalRole || ''}
                onChange={(e) => handleChange('principalRole', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Principal Photo URL
              </label>
              <input
                type="url"
                value={formData.principalPhotoUrl || ''}
                onChange={(e) => handleChange('principalPhotoUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Principal's Welcome Message
            </label>
            <textarea
              rows={4}
              value={formData.principalMessage || ''}
              onChange={(e) => handleChange('principalMessage', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            id="save-settings-btn"
            variant="gold"
            size="lg"
            type="submit"
            isLoading={isSaving}
            icon={<Save className="w-4 h-4" />}
            className="px-8"
          >
            Save All Configuration Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
