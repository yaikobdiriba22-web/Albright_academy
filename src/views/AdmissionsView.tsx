import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  FileText,
  UserCheck,
  CalendarCheck,
  CheckCircle,
  ClipboardList,
  AlertCircle,
  Copy,
  Printer,
  Sparkles,
  ArrowDown,
  Info,
} from 'lucide-react';
import { api } from '../lib/api.ts';
import { AdmissionApplication } from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';
import { useTranslation } from '../i18n/LanguageContext.tsx';

interface AdmissionsViewProps {
  navigate: (route: string) => void;
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = ({ navigate }) => {
  const { d, language } = useTranslation();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    applyingGrade: 'KG1',
    previousSchool: '',
    guardianName: '',
    guardianRelationship: 'Mother',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    emergencyContact: '',
    additionalInformation: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    birthCert?: string;
    reportCard?: string;
    photo?: string;
  }>({});

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceNumber: string;
    application: AdmissionApplication;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const gradeOptions = [
    'KG1 (Age 3-4)',
    'KG2 (Age 4-5)',
    'KG3 (Age 5-6)',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim()) errs.firstName = 'Student first name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Student last name is required.';
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required.';
    if (!formData.guardianName.trim()) errs.guardianName = 'Parent/Guardian name is required.';
    if (!formData.guardianPhone.trim()) {
      errs.guardianPhone = 'Contact phone number is required.';
    } else if (formData.guardianPhone.trim().length < 8) {
      errs.guardianPhone = 'Please provide a valid phone number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.guardianEmail.trim()) {
      errs.guardianEmail = 'Parent/Guardian email is required.';
    } else if (!emailRegex.test(formData.guardianEmail)) {
      errs.guardianEmail = 'Please provide a valid email address.';
    }

    if (!formData.address.trim()) errs.address = 'Residential address is required.';
    if (!formData.emergencyContact.trim()) errs.emergencyContact = 'Emergency contact is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstErr = document.querySelector('.has-error');
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitAdmission(formData);
      setSubmissionSuccess({
        referenceNumber: res.referenceNumber,
        application: res.application,
      });

      // Launch celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (cErr) {
        // ignore if canvas not supported
      }

      // Reset form
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        applyingGrade: 'KG1',
        previousSchool: '',
        guardianName: '',
        guardianRelationship: 'Mother',
        guardianPhone: '',
        guardianEmail: '',
        address: '',
        emergencyContact: '',
        additionalInformation: '',
      });
      setErrors({});
    } catch (err: any) {
      alert(err.message || 'An error occurred while submitting the application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (submissionSuccess) {
      navigator.clipboard.writeText(submissionSuccess.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const printConfirmation = () => {
    window.print();
  };

  const scrollToForm = () => {
    const el = document.getElementById('admission-application-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 bg-white">
      {/* Header Banner */}
      <div className="bg-[#0f2444] text-white py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            Join Albright Academy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            Admissions & Enrollment
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            We welcome applications for Kindergarten (KG1–KG3) and Grades 1 through 8. Discover our
            straightforward admission process and submit your online application below.
          </p>
          <div className="mt-6">
            <Button
              id="jump-to-form-btn"
              variant="gold"
              size="lg"
              onClick={scrollToForm}
              icon={<ArrowDown className="w-4 h-4" />}
            >
              Apply Online Now
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admission Process (5 Steps) */}
        <div className="mb-20">
          <SectionHeader
            badge="Simple Steps"
            title="The 5-Step Admission Process"
            description="Our admissions team is committed to guiding your family transparently through each stage of enrolment."
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Submit Application',
                desc: 'Complete the online application form with student & guardian details.',
                icon: <FileText className="w-5 h-5 text-amber-500" />,
              },
              {
                step: '02',
                title: 'Application Review',
                desc: 'Admissions committee verifies academic records and age eligibility.',
                icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
              },
              {
                step: '03',
                title: 'Assessment / Interview',
                desc: 'Friendly developmental or foundational skills assessment if applicable.',
                icon: <UserCheck className="w-5 h-5 text-indigo-600" />,
              },
              {
                step: '04',
                title: 'Admission Decision',
                desc: 'Formal offer letter dispatched via email along with orientation packet.',
                icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
              },
              {
                step: '05',
                title: 'Registration',
                desc: 'Finalize tuition registration and join the Albright Academy family.',
                icon: <CalendarCheck className="w-5 h-5 text-rose-500" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-amber-500 font-display">
                      {item.step}
                    </span>
                    <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100">
                      {item.icon}
                    </div>
                  </div>
                  <h4 className="font-bold text-[#0f2444] text-base mb-1.5 font-display">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admission Requirements Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[#0f2444] font-display">
                General Admission Requirements & Documentation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Parents are requested to have the following documentation ready when called for the
                in-person verification step:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-700 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Copy of Student Birth Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Recent Passport-Sized Photographs (x4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Previous School Report Cards (for Grades 1-8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Immunization / Health Record Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Parent/Guardian Identification Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Transfer Letter from Previous School (if applicable)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal / State */}
        {submissionSuccess && (
          <div
            id="admission-success-card"
            className="mb-16 p-8 sm:p-10 rounded-3xl bg-emerald-50 border-2 border-emerald-300 shadow-xl animate-in zoom-in-95 duration-200"
          >
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-9 h-9" />
              </div>
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-200 text-emerald-900">
                Application Received
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                Application Submitted Successfully!
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Thank you, <strong>{submissionSuccess.application.guardianName}</strong>. Your admission
                application for{' '}
                <strong>
                  {submissionSuccess.application.firstName} {submissionSuccess.application.lastName}
                </strong>{' '}
                ({submissionSuccess.application.applyingGrade}) has been registered in our database.
              </p>

              {/* Reference Box */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
                <div className="text-left">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                    Application Reference Number
                  </span>
                  <span className="text-2xl font-black text-[#0f2444] font-mono tracking-wider">
                    {submissionSuccess.referenceNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    id="copy-ref-btn"
                    variant="outline"
                    size="sm"
                    onClick={copyReference}
                    icon={<Copy className="w-4 h-4" />}
                  >
                    {copied ? 'Copied!' : 'Copy Code'}
                  </Button>
                  <Button
                    id="print-ref-btn"
                    variant="secondary"
                    size="sm"
                    onClick={printConfirmation}
                    icon={<Printer className="w-4 h-4" />}
                  >
                    Print
                  </Button>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Please quote this reference number for all future inquiries with our admissions office.
                We have also queued an admission evaluation for our administration.
              </div>

              <div className="pt-2">
                <Button
                  variant="gold"
                  onClick={() => setSubmissionSuccess(null)}
                >
                  Submit Another Application
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ONLINE ADMISSION FORM */}
        <div id="admission-application-form" className="scroll-mt-24">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-[#0f2444] text-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Online Admission Application
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    Albright Academy • Academic Year 2026 / 2027
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
              {/* Section 1: Student Information */}
              <div>
                <h4 className="text-base font-bold text-[#0f2444] uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                  1. Student Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="student-first-name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Dawit"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.firstName
                          ? 'border-rose-300 focus:ring-rose-500 has-error'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      id="student-middle-name"
                      value={formData.middleName}
                      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      placeholder="e.g. Tadesse"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="student-last-name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Alemu"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.lastName
                          ? 'border-rose-300 focus:ring-rose-500 has-error'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="student-dob"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.dateOfBirth
                          ? 'border-rose-300 focus:ring-rose-500 has-error'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gender *
                    </label>
                    <select
                      id="student-gender"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value as any })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applying Grade Level *
                    </label>
                    <select
                      id="student-grade"
                      value={formData.applyingGrade}
                      onChange={(e) => setFormData({ ...formData, applyingGrade: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white font-medium text-[#0f2444]"
                    >
                      {gradeOptions.map((g) => (
                        <option key={g} value={g.split(' ')[0]}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Previous School Attended (If Any)
                  </label>
                  <input
                    type="text"
                    id="student-previous-school"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    placeholder="e.g. St. George Early Learning / Sunshine Nursery"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                  />
                </div>
              </div>

              {/* Section 2: Parent / Guardian Details */}
              <div>
                <h4 className="text-base font-bold text-[#0f2444] uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                  2. Parent / Guardian Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {d.admissions.guardianNameLabel} *
                    </label>
                    <input
                      type="text"
                      id="guardian-name"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      placeholder="e.g. Tadesse Alemu"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.guardianName
                          ? 'border-rose-300 focus:ring-rose-500 has-error'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.guardianName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.guardianName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {d.admissions.relationshipLabel || 'Relationship to Student'} *
                    </label>
                    <select
                      id="guardian-relationship"
                      value={formData.guardianRelationship}
                      onChange={(e) =>
                        setFormData({ ...formData, guardianRelationship: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white"
                    >
                      <option value="Mother">Mother / እናት / Haadha</option>
                      <option value="Father">Father / አባት / Abbaa</option>
                      <option value="Legal Guardian">Legal Guardian / ህጋዊ አሳዳጊ / Guddiftuu</option>
                      <option value="Other">Other Relative / ሌላ / Kan Biraa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {d.admissions.guardianPhoneLabel} *
                    </label>
                    <input
                      type="tel"
                      id="guardian-phone"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      placeholder="e.g. 0923014132 or +251 923 014 132"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.guardianPhone
                          ? 'border-rose-300 focus:ring-rose-500 has-error'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.guardianPhone && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.guardianPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {d.admissions.guardianEmailLabel} *
                    </label>
                    <input
                      type="email"
                      id="guardian-email"
                      value={formData.guardianEmail}
                      onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      placeholder="e.g. guardian@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.guardianEmail
                          ? 'border-rose-300 focus:ring-rose-500 has-error'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.guardianEmail && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.guardianEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Residential Address *
                    </label>
                    <input
                      type="text"
                      id="guardian-address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Sheggar City, Gefarsa Gujjee, House 412"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.address
                          ? 'border-rose-300 focus:ring-rose-500 has-error'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Emergency Contact Name & Phone *
                    </label>
                    <input
                      type="text"
                      id="guardian-emergency"
                      value={formData.emergencyContact}
                      onChange={(e) =>
                        setFormData({ ...formData, emergencyContact: e.target.value })
                      }
                      placeholder="e.g. Aster Alemu (Aunt) - +251 922 001 122"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                        errors.emergencyContact
                          ? 'border-rose-300 focus:ring-rose-500 has-error'
                          : 'border-slate-300 focus:ring-[#0f2444]'
                      }`}
                    />
                    {errors.emergencyContact && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.emergencyContact}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Supporting Documents (Optional at time of application) */}
              <div>
                <h4 className="text-base font-bold text-[#0f2444] uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                  {d.admissions.documentsSection || '3. Supporting Documents (Upload Architecture)'}
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  {d.admissions.uploadInstructions ||
                    'You may optionally upload copies of student documents now or provide them during the campus assessment.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/80 transition-colors text-center">
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      {d.admissions.birthCertLabel || 'Birth Certificate'}
                    </span>
                    <input
                      type="file"
                      id="upload-birth-cert"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFiles((prev) => ({ ...prev, birthCert: file.name }));
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer w-full"
                    />
                    {uploadedFiles.birthCert && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">✓ {uploadedFiles.birthCert}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/80 transition-colors text-center">
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      {d.admissions.reportCardLabel || 'Previous Report Card'}
                    </span>
                    <input
                      type="file"
                      id="upload-report-card"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFiles((prev) => ({ ...prev, reportCard: file.name }));
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer w-full"
                    />
                    {uploadedFiles.reportCard && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">✓ {uploadedFiles.reportCard}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/80 transition-colors text-center">
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      {d.admissions.photoLabel || 'Recent Passport Photo'}
                    </span>
                    <input
                      type="file"
                      id="upload-photo"
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFiles((prev) => ({ ...prev, photo: file.name }));
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer w-full"
                    />
                    {uploadedFiles.photo && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">✓ {uploadedFiles.photo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Additional Information */}
              <div>
                <h4 className="text-base font-bold text-[#0f2444] uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                  4. {d.admissions.additionalInfoLabel || 'Additional Information (Optional)'}
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special learning requirements, dietary preferences, or student talents:
                  </label>
                  <textarea
                    id="additional-info"
                    rows={3}
                    value={formData.additionalInformation}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalInformation: e.target.value })
                    }
                    placeholder="Tell us about your child's passions (e.g. robotics, reading, swimming) or any specific accommodations needed..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
                By submitting this application, you declare that the information provided is accurate
                and agree that Albright Academy admissions officers may contact you regarding entrance
                reviews and enrolment scheduling.
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  id="submit-admission-btn"
                  variant="gold"
                  size="lg"
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto px-8"
                >
                  Submit Official Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
