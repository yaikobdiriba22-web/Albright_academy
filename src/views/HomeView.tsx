import React from 'react';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  Cpu,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  GraduationCap,
  Award,
  Users,
  CheckCircle,
  Quote,
} from 'lucide-react';
import { SchoolSettings, NewsItem, SchoolEvent } from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { motion } from 'motion/react';
import { MovingBanner } from '../components/ui/MovingBanner.tsx';

interface HomeViewProps {
  navigate: (route: string) => void;
  settings: SchoolSettings | null;
  news: NewsItem[];
  events: SchoolEvent[];
  setSelectedNews: (news: NewsItem | null) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  navigate,
  settings,
  news,
  events,
  setSelectedNews,
}) => {
  const { d, language } = useTranslation();

  const academicPrograms = [
    {
      title: d.academics.earlyTitle,
      subtitle: 'KG1 – KG2 (Ages 3–5)',
      description: d.academics.earlySubtitle,
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      tagColor: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      title: d.academics.primaryTitle,
      subtitle: 'Grades 1 – 4 (Ages 6–10)',
      description: d.academics.primarySubtitle,
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      tagColor: 'bg-blue-50 text-blue-900 border-blue-200',
    },
    {
      title: d.academics.juniorTitle,
      subtitle: 'Grades 5 – 8 (Ages 11–14)',
      description: d.academics.juniorSubtitle,
      icon: <Compass className="w-6 h-6 text-emerald-600" />,
      tagColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
  ];

  const whyChooseCards = [
    {
      title: language === 'am' ? 'ብቁ እና ሩህሩህ መምህራን' : language === 'om' ? 'Barsiisota Gahumsa Qaban' : 'Certified & Dedicated Faculty',
      desc: language === 'am' ? 'ለእያንዳንዱ ተማሪ ልዩ እንክብካቤ የሚሰጡ በሙያው የሰለጠኑ ልምድ ያካበቱ መምህራን።' : language === 'om' ? "Barsiisota dandeettii olaanaa qaban kanneen daa'imman hundaaf xiyyeeffannoo dhuunfaa kennan." : 'Experienced, background-checked educators dedicated to unlocking every child’s individual learning potential.',
      icon: <Award className="w-6 h-6 text-amber-500" />,
    },
    {
      title: language === 'am' ? 'ተግባራዊ ሳይንስ እና ሮቦቲክስ' : language === 'om' ? 'Saayinsii Hojiin Agarsiifamu fi STEM' : 'Hands-on STEM & Robotics',
      desc: language === 'am' ? 'ተማሪዎችን ከልጅነታቸው ጀምሮ ለቴክኖሎጂ፣ ለኮዲንግና ለፈጠራ የሚያዘጋጁ ዘመናዊ ላቦራቶሪዎች።' : language === 'om' ? 'Laabii saayinsii fi koodingii barattoota kalaqaaf qopheessan.' : 'Modern laboratories where students learn coding, robotics, and experimental physics from an early age.',
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: language === 'am' ? 'አስተማማኝና ምቹ የትምህርት ከባቢ' : language === 'om' ? 'Nageenya Eegame fi Naannoo Qulqulluu' : 'Safe & Nurturing Campus',
      desc: language === 'am' ? 'በካሜራ ቁጥጥር ስር ያለ፣ የህጻናት ደህንነትና ስነ-ልቦናዊ ምቾት የተረጋገጠበት ግቢ።' : language === 'om' ? 'Nageenyi isaa eegamee fi miira nagaa barattootaaf kan uumu.' : 'Controlled campus access, child-safe playgrounds, first-aid nurses, and positive peer culture.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: language === 'am' ? 'የስነ-ምግባርና የአመራር ክህሎት' : language === 'om' ? 'Naamusa Cimaa fi Hoggansa' : 'Character & Leadership',
      desc: language === 'am' ? 'ትጋት፣ ታማኝነት፣ አክብሮት እና የህብረተሰብ አገልግሎት እሴቶችን ከትምህርት ጎን ለጎን ማስተማር።' : language === 'om' ? 'Duudhaalee amala gaarii, kabaja fi itti-gaafatamummaa gabbisuu.' : 'Instilling integrity, mutual respect, civic responsibility, and active teamwork throughout all grades.',
      icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
    },
    {
      title: language === 'am' ? 'የተመጣጠነ የመማሪያ ክፍል ምጥጥን' : language === 'om' ? 'Reeshiyoo Madaalamaa (1:18)' : 'Optimal Ratio (1:18)',
      desc: language === 'am' ? 'በአንድ ክፍል ውስጥ ዝቅተኛ የተማሪዎች ቁጥር በመያዝ ጥራት ያለው ትምህርት መስጠት።' : language === 'om' ? "Kutaa keessatti reeshiyoo barsiisaa fi barataa madaalamaa ta'e eeguu." : 'Low classroom sizes ensure teachers know each student closely and adapt to their pace.',
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      title: language === 'am' ? 'ቋንቋና ባህልን ማክበር' : language === 'om' ? 'Aadaa fi Afaan Gabbisuu' : 'Multilingual & Cultural Pride',
      desc: language === 'am' ? 'እንግሊዝኛን በዋናነት እያስተማሩ የአማርኛና አፋን ኦሮሞ ቋንቋዎችንና ባህሎችን ማጎልበት።' : language === 'om' ? 'Afaan Ingilizii, Oromoo fi Amaaraa kabajuun tokkummaa ijaaruu.' : 'Balancing fluent English mastery with profound appreciation for Ethiopian languages and history.',
      icon: <Lightbulb className="w-6 h-6 text-amber-600" />,
    },
  ];

  const testimonials = [
    {
      quote: language === 'am' ? 'ልጆቼ በአልብራይት አካዳሚ መማር ከጀመሩ በኋላ በንባብ፣ በሂሳብ እና በራስ መተማመን ላይ ያሳዩት ለውጥ እጅግ አስደናቂ ነው። የመምህራኑ እንክብካቤ ወደር የለውም።' : language === 'om' ? "Ijoolleen koo Albright Academytti eega galanii guddinni isaan dubbisaa fi herrega irratti agarsiisan baay'ee na gammachiiseera. Barsiisonnis xiyyeeffannoo guddaa kennuuf." : 'The growth my children have experienced in reading fluency, mathematics, and creative confidence at Albright is extraordinary. The faculty’s genuine care is second to none.',
      parent: 'Dr. Getachew Tadesse',
      role: language === 'am' ? 'የ4ኛ እና ኬጂ2 ክፍል ተማሪዎች አባት' : language === 'om' ? 'Abbaa Barattoota Kutaa 4 fi KG2' : 'Parent of Grade 4 & KG2 Scholars',
    },
    {
      quote: language === 'am' ? 'የትምህርት ቤቱ የሳይንስ ላቦራቶሪ፣ የኮዲንግ ትምህርት እና ንጹህ የመማሪያ ክፍሎች በከተማችን ካሉ ትምህርት ቤቶች ሁሉ የላቁ ናቸው።' : language === 'om' ? 'Laaboraatoriin saayinsii, koodingii fi qulqullinni kutaalee barumsaa Albright Academy iddoo guddaa qaba.' : 'The hands-on science lab experiments, robotics curriculum, and positive atmosphere made Albright our top choice for our daughter.',
      parent: 'Mrs. Selamawit Bekele',
      role: language === 'am' ? 'የ6ኛ ክፍል ተማሪ እናት' : language === 'om' ? 'Haadha Barataa Kutaa 6ffaa' : 'Parent of Grade 6 Scholar',
    },
  ];

  const publishedNews = news.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#071324] via-[#0f2444] to-[#142d54] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{d.common.admissionsOpenBadge}</span>
              </div>

              {/* Animated Moving Title: Albright Academy — Center of Excellence and Innovation */}
              <motion.div
                className="relative py-1"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.15] text-white">
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {d.hero.headline}
                  </motion.span>{' '}
                  <span className="text-amber-400 font-light">—</span>{' '}
                  <motion.span
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200"
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {d.hero.headlineHighlight}
                  </motion.span>
                </h1>
              </motion.div>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                {d.hero.supportingText}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  id="hero-apply-btn"
                  variant="gold"
                  size="lg"
                  onClick={() => navigate('/admissions')}
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto shadow-lg shadow-amber-500/20"
                >
                  {d.common.applyNow}
                </Button>
                <Button
                  id="hero-explore-btn"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/academics')}
                  className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                >
                  {d.common.exploreSchool}
                </Button>
              </div>

              {/* Key Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-700/60 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-black text-amber-400 font-display">
                    {d.hero.statGrades}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {d.hero.statGradesLabel}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-400 font-display">
                    {d.hero.statRatio}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {d.hero.statRatioLabel}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-400 font-display">
                    {d.hero.statExcellence}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {d.hero.statExcellenceLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image with Floating Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"
                  alt="Albright Academy Students"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/90 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-amber-400/30 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md shrink-0 overflow-hidden flex items-center justify-center border border-amber-400/40">
                      <img
                        src="/logo.png"
                        alt="Albright Academy Official Seal"
                        className="w-full h-full object-contain rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                        {d.hero.floatingBadgeTitle}
                      </p>
                      <p className="text-xs text-white leading-tight mt-0.5">
                        {d.hero.floatingBadgeDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Animated Ribbon: "Albright Academy — Center of Excellence and Innovation" (Configured by Admin) */}
      <div className="relative z-20 shadow-md">
        <MovingBanner variant="gold" showControls={true} settings={settings} />
      </div>

      {/* 2. ACADEMIC DIVISIONS SECTION */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge={d.home.programsTitle}
            title={d.home.programsSubtitle}
            description="Our structured educational pathways are tailored to foster foundational skills, scientific thinking, and character."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {academicPrograms.map((program, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400/80 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-white shadow-xs border border-slate-100 group-hover:bg-amber-50 transition-colors">
                      {program.icon}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${program.tagColor}`}>
                      {program.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-[#0f2444] transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80">
                  <button
                    onClick={() => navigate('/academics')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    <span>{d.common.learnMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE ALBRIGHT ACADEMY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge={d.home.whyChooseTitle}
            title={d.home.whyChooseSubtitle}
            description="Providing young learners with an empowering environment that cultivates academic excellence and integrity."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {card.icon}
                </div>
                <h4 className="text-base font-bold text-slate-900 font-display">
                  {card.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CAMPUS FACILITIES & STUDENT LIFE PREVIEW */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Facilities Box */}
            <div className="space-y-6">
              <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-900">
                {d.home.facilitiesTitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                {d.home.facilitiesSubtitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                From fiber-connected computer labs and child-safe experimental science stations to our trilingual library and outdoor athletics field.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Smart Classrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Experimental Science Lab</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Coding & Robotics Hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Safe School Transportation</span>
                </div>
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={() => navigate('/facilities')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Tour All Facilities
                </Button>
              </div>
            </div>

            {/* Student Life Box */}
            <div className="space-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-900">
                {d.home.studentLifeTitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                {d.home.studentLifeSubtitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nurturing balanced individuals through over 15 after-school clubs, youth sports leagues, national spelling bees, robotics olympiads, and cultural celebrations.
              </p>
              <div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/student-life')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Student Life
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PARENT TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge={d.home.testimonialsTitle}
            title={d.home.testimonialsSubtitle}
            description="Hear authentic reflections from parents whose children flourish in our classrooms."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative space-y-4"
              >
                <Quote className="w-10 h-10 text-amber-200 absolute top-6 right-6 opacity-60" />
                <p className="text-sm text-slate-700 italic leading-relaxed relative z-10">
                  “{t.quote}”
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <div className="font-bold text-slate-900 text-sm font-display">
                    {t.parent}
                  </div>
                  <div className="text-xs text-amber-600 font-semibold mt-0.5">
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LATEST NEWS & UPCOMING EVENTS */}
      {(publishedNews.length > 0 || upcomingEvents.length > 0) && (
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {d.home.newsTitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
                  {d.home.newsSubtitle}
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/news')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {d.common.viewAll}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedNews(item);
                    navigate('/news');
                  }}
                  className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="h-44 overflow-hidden bg-slate-200">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-amber-600 uppercase">
                        {item.category || 'School News'}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 line-clamp-2 mt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {item.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-200/60 text-xs text-slate-400 flex items-center justify-between">
                      <span>{item.publishedAt}</span>
                      <span className="text-amber-600 font-bold">{d.common.readMore} →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-[#071324] via-[#0f2444] to-[#142d54] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
            {d.common.admissionsOpenBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            {d.home.ctaHeading}
          </h2>
          <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {d.home.ctaSubtitle}
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              id="cta-apply-btn"
              variant="gold"
              size="lg"
              onClick={() => navigate('/admissions')}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {d.common.applyNow}
            </Button>
            <Button
              id="cta-contact-btn"
              variant="outline"
              size="lg"
              onClick={() => navigate('/contact')}
              className="text-white border-white/20 hover:bg-white/10"
            >
              {d.common.contactUs}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
