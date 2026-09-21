import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { api } from '../lib/api.ts';
import { SchoolSettings } from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';

interface ContactViewProps {
  settings: SchoolSettings | null;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a message subject.';
    if (!formData.message.trim()) errs.message = 'Please enter your message.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitContact(formData);
      setSubmittedMessage(res.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0f2444] text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            Connect With Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            Contact Albright Academy
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding admissions, academics, or campus tours? Our dedicated team is
            always delighted to assist your family.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
              School Office Details
            </span>
            <h2 className="text-3xl font-bold text-[#0f2444] font-display">
              We're Here to Assist You
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Prospective parents are welcome to visit our admissions office on weekdays during
              academic hours or reach out through our official channels.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2444]">Campus Location</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    {settings?.address || 'Sheggar city, Gefarsa Gujjee, kella'}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#0f2444] text-white font-bold shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2444]">Phone Inquiries</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    <a
                      href={`tel:${settings?.phone || '0923014132'}`}
                      className="hover:text-amber-600 transition-colors font-semibold"
                    >
                      {settings?.phone || '0923014132'}
                    </a>
                  </p>
                  <span className="text-2xs text-slate-400">Monday – Friday, 8:00 AM – 4:30 PM</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2444]">Email Admissions</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    <a
                      href={`mailto:${settings?.email || 'dinigaatrading@gmail.com'}`}
                      className="hover:text-emerald-700 transition-colors font-semibold"
                    >
                      {settings?.email || 'dinigaatrading@gmail.com'}
                    </a>
                  </p>
                  <span className="text-2xs text-slate-400">Average response time: &lt; 24 hours</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-600 text-white font-bold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2444]">Operating Hours</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Classes: Mon – Fri (8:00 AM – 3:30 PM)
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Admin Office: Mon – Fri (8:00 AM – 5:00 PM)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
              <h3 className="text-2xl font-bold text-[#0f2444] font-display mb-2">
                Send an Inquiry Message
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in the form below and our administrative office will reply promptly.
              </p>

              {submittedMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm mb-6 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Thank You!</p>
                    <p className="text-xs mt-0.5">{submittedMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Martha Kebede"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-rose-300 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.name && <p className="text-2xs text-rose-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. martha@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-rose-300 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.email && <p className="text-2xs text-rose-600 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +251 911 000 000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Grade 1 Enrolment Inquiry"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.subject
                          ? 'border-rose-300 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-2xs text-rose-600 mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your inquiry or question here..."
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      errors.message
                        ? 'border-rose-300 focus:ring-rose-500'
                        : 'border-slate-300 focus:ring-[#0f2444]'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-2xs text-rose-600 mt-1">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    id="submit-contact-btn"
                    variant="primary"
                    size="md"
                    type="submit"
                    isLoading={isSubmitting}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0f2444] font-display">
                Campus Location & Directions
              </h3>
              <p className="text-xs text-slate-500">
                Coordinates: {settings?.latitude?.toFixed(4) || '9.0685'}° N,{' '}
                {settings?.longitude?.toFixed(4) || '38.6521'}° E •{' '}
                {settings?.address || 'Sheggar city, Gefarsa Gujjee, kella'}
              </p>
            </div>
            <a
              id="google-maps-external-btn"
              href={settings?.mapsUrl || 'https://maps.google.com/?q=Sheggar+city+Gefarsa+Gujjee+kella'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs w-fit"
            >
              <ExternalLink className="w-4 h-4 text-amber-600" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Clean Interactive Map Placeholder Canvas */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-200">
            {/* Embedded Google Maps view using coordinates */}
            <iframe
              title="Albright Academy Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://maps.google.com/maps?q=${settings?.latitude || 9.0685},${
                settings?.longitude || 38.6521
              }&z=14&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
