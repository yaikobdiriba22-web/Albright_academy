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
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { SchoolSettings } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';

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
