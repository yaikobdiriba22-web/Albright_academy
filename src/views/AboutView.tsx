import React from 'react';
import {
  Compass,
  Target,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { SchoolSettings } from '../types/index.ts';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';
import { Button } from '../components/ui/Button.tsx';

interface AboutViewProps {
  navigate: (route: string) => void;
  settings: SchoolSettings | null;
}

export const AboutView: React.FC<AboutViewProps> = ({ navigate, settings }) => {
  const values = [
    {
      title: 'Excellence',
      description: 'We hold ourselves to elevated benchmarks in instructional quality, pupil effort, and institutional performance.',
    },
    {
      title: 'Integrity',
      description: 'Honesty, moral uprightness, and ethical responsibility form the bedrock of our academy culture.',
    },
    {
      title: 'Innovation',
      description: 'We integrate contemporary scientific discovery, digital literacy, and progressive pedagogy into every subject.',
    },
    {
      title: 'Respect',
      description: 'Every pupil, educator, and parent is honored as an essential and valued member of our diverse academic family.',
    },
    {
      title: 'Responsibility',
      description: 'We encourage young scholars to be responsible stewards of their intellectual talents, actions, and surrounding world.',
    },
    {
      title: 'Collaboration',
      description: 'Through teamwork, debate, and cooperative learning, students discover the power of collective problem-solving.',
    },
  ];

  return (
    <div className="py-12 bg-white">
      {/* Header Banner */}
      <div className="bg-[#0f2444] text-white py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            About Our Academy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            Who We Are
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {settings?.slogan || 'Center of Excellence and Innovation'} — Dedicated to shaping
            inquisitive, principled, and forward-thinking scholars from KG1 to Grade 8.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Institutional Heritage
            </span>
            <h2 className="text-3xl font-bold text-[#0f2444] font-display leading-snug">
              Nurturing Bright Minds with Purpose, Heart, and Innovation
            </h2>
            <p className="text-slate-700 leading-relaxed text-base">
              {settings?.about ||
                'Albright Academy is committed to providing quality education in a supportive and innovative learning environment.'}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              From our vibrant early childhood kindergarten classrooms through the rigorous academic
              challenges of Grade 8, our instructional paradigm emphasizes active conceptual
              understanding over rote memorization. We inspire students to ask deep questions, apply
              knowledge across disciplines, and develop genuine intellectual tenacity.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Button
                variant="gold"
                onClick={() => navigate('/admissions')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Join Our Student Body
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/academics')}
              >
                Explore Programs
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80"
                alt="Academy Classroom"
                className="rounded-2xl shadow-md h-64 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                alt="Students in Library"
                className="rounded-2xl shadow-md h-64 w-full object-cover mt-8"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f2444] font-display mb-4">
              Our Mission
            </h3>
            <p className="text-base text-slate-700 leading-relaxed">
              {settings?.mission ||
                'To foster an inspiring, technology-forward, and compassionate educational environment where every student from KG1 to Grade 8 develops critical thinking, strong character, innovative problem-solving, and a genuine passion for lifelong learning.'}
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#0f2444] text-white relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-6">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display mb-4">
              Our Vision
            </h3>
            <p className="text-base text-slate-200 leading-relaxed">
              {settings?.vision ||
                'To be the premier school of excellence and innovation in East Africa, graduating confident, ethical, and forward-looking leaders equipped for an ever-changing world.'}
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mb-24">
          <SectionHeader
            badge="Institutional Pillars"
            title="Our Core Values"
            description="Our six foundational virtues inform every school rule, teacher interaction, and student accomplishment."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2.5 mb-3 text-[#0f2444] font-bold text-lg font-display">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <h4>{v.title}</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Principal Message feature */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center">
              <img
                src={
                  settings?.principalPhotoUrl ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
                }
                alt={settings?.principalName || 'Principal'}
                className="w-48 h-48 rounded-2xl object-cover mx-auto shadow-md border-2 border-amber-400"
              />
              <h4 className="mt-4 font-bold text-[#0f2444] text-lg">
                {settings?.principalName || 'Dr. Helen Mengistu'}
              </h4>
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
                {settings?.principalRole || 'Principal & Head of School'}
              </p>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                A Word from the Principal
              </span>
              <h3 className="text-2xl font-bold text-[#0f2444] font-display">
                Partnering in Your Child's Journey of Discovery
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
                "{settings?.principalMessage}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
