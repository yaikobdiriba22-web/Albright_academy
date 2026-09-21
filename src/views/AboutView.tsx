import React from 'react';
import {
  Compass,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
} from 'lucide-react';
import { SchoolSettings } from '../types/index.ts';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';
import { Button } from '../components/ui/Button.tsx';
import { useTranslation } from '../i18n/LanguageContext.tsx';

interface AboutViewProps {
  navigate: (route: string) => void;
  settings: SchoolSettings | null;
}

export const AboutView: React.FC<AboutViewProps> = ({ navigate, settings }) => {
  const { d, language } = useTranslation();

  const values = [
    {
      title: language === 'am' ? 'የበላይነትና ጥራት' : language === 'om' ? 'Gahumsa Olaanaa' : 'Academic Excellence',
      description: language === 'am' ? 'በአካዳሚክስ፣ በስነ-ምግባር እና በጥረት ከፍተኛውን ደረጃ እንጠብቃለን።' : language === 'om' ? 'Barnoota, amala gaarii fi carraaqqii olaanaa qabaachuu.' : 'Pursuing the highest benchmarks in instruction, pupil effort, and intellectual integrity.',
    },
    {
      title: language === 'am' ? 'ታማኝነትና ቅንነት' : language === 'om' ? 'Amanamtummaa' : 'Integrity & Ethics',
      description: language === 'am' ? 'እውነተኝነት፣ ሞራላዊ ጽናት እና ተጠያቂነት የባህላችን መሰረት ናቸው።' : language === 'om' ? "Dhugaa dubbachuu, naamus-qabeessa ta'uu fi itti gaafatamummaa ba'achuu." : 'Upholding uncompromising honesty, moral uprightness, and personal accountability.',
    },
    {
      title: language === 'am' ? 'የፈጠራ አስተሳሰብ' : language === 'om' ? 'Kalaqa Haarawaa' : 'Continuous Innovation',
      description: language === 'am' ? 'አዳዲስ ሳይንሳዊ ግኝቶችንና የቴክኖሎጂ እውቀትን በሁሉም የትምህርት መስክ ማካተት።' : language === 'om' ? 'Yaada haarawaa, saayinsii fi teeknooloojii barnoota waliin makuu.' : 'Embracing scientific curiosity, creative problem-solving, and cutting-edge educational technology.',
    },
    {
      title: language === 'am' ? 'አክብሮትና ወንድማማችነት' : language === 'om' ? 'Kabaja fi Tokkummaa' : 'Mutual Respect',
      description: language === 'am' ? 'ብዝሃነትን ማክበር፣ በንቃት ማዳመጥና ሁሉንም ሰው በእኩልነት መመልከት።' : language === 'om' ? 'Garaagarummaa kabajuu fi nama hundaaf ulfina kennuu.' : 'Honoring diversity, listening actively, and treating every child, parent, and teacher with dignity.',
    },
    {
      title: language === 'am' ? 'ተጠያቂነት' : language === 'om' ? 'Itti-Gaafatamummaa' : 'Civic Responsibility',
      description: language === 'am' ? 'ለትምህርታችን፣ ለማህበረሰባችን እና ለአካባቢያችን ጥበቃ የበኩላችንን ድርሻ መወጣት።' : language === 'om' ? 'Barnoota keenyaaf, hawaasaaf fi naannoof kunuunsa gochuu.' : 'Nurturing conscious stewards of intellectual talents, local communities, and the natural environment.',
    },
    {
      title: language === 'am' ? 'የጋራ ትብብር' : language === 'om' ? 'Waloon Hojjechuu' : 'Dynamic Collaboration',
      description: language === 'am' ? 'ተማሪዎች በቡድን ስራ፣ በውይይትና በክርክር ችግሮችን በጋራ እንዲፈቱ ማገዝ።' : language === 'om' ? "Garee fi waloon mari'achuun rakkoolee furaa deemuu." : 'Empowering children through structured teamwork, cooperative inquiry, and shared discovery.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071324] via-[#0f2444] to-[#142d54] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            {d.nav.about}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            {d.about.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {d.about.subtitle}
          </p>
        </div>
      </section>

      {/* 2. OVERVIEW & PHILOSOPHY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                {d.about.overviewHeading}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2444] font-display leading-snug">
                Building Tomorrow's Leaders with Rigor and Compassion
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {d.about.overviewText1}
              </p>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                {d.about.overviewText2}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  variant="gold"
                  onClick={() => navigate('/admissions')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {d.common.applyNow}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/academics')}
                >
                  {d.common.learnMore}
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

          {/* 3. VISION & MISSION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0f2444] text-white relative overflow-hidden shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-4">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                {d.about.visionTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {d.about.visionText}
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 relative overflow-hidden shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold mb-4">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f2444] font-display">
                {d.about.missionTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {d.about.missionText}
              </p>
            </div>
          </div>

          {/* 4. CORE VALUES SECTION */}
          <div>
            <SectionHeader
              badge={d.about.valuesTitle}
              title={d.about.valuesSubtitle}
              description="Our foundational virtues inform everyday classroom experiences, teacher mentorship, and community growth."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all space-y-2"
                >
                  <div className="flex items-center gap-2.5 text-[#0f2444] font-bold text-base font-display">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h4>{v.title}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. EDUCATIONAL PHILOSOPHY & HISTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {d.about.philosophyTitle}
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {d.about.philosophySubtitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {d.about.philosophyText}
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {d.about.historyTitle}
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {d.about.historySubtitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {d.about.historyText}
              </p>
            </div>
          </div>

          {/* 6. PRINCIPAL'S MESSAGE */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0f2444] text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 text-center">
                <img
                  src={
                    settings?.principalPhotoUrl ||
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={d.about.principalName}
                  className="w-44 h-44 rounded-2xl object-cover mx-auto shadow-md border-2 border-amber-400"
                />
                <h4 className="mt-4 font-bold text-white text-lg">
                  {d.about.principalName}
                </h4>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  {d.about.principalRole}
                </p>
              </div>
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {d.about.principalTitle}
                </span>
                <h3 className="text-2xl font-bold text-white font-display">
                  {d.about.principalSubtitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  “{d.about.principalMessage}”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
