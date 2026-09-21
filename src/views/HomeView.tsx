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
  Target,
} from 'lucide-react';
import { SchoolSettings, NewsItem, SchoolEvent } from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';

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
  const quickInfoCards = [
    {
      title: 'KG Education',
      level: 'KG1 – KG3',
      description: 'Early learning and development through sensory exploration, foundational phonics, numbers, and guided play.',
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Primary Education',
      level: 'Grades 1 – 4',
      description: 'Strong foundations in literacy, numeracy, inquiry-based science, environmental studies, and artistic creativity.',
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: 'Middle Grades',
      level: 'Grades 5 – 8',
      description: 'Developing critical thinking, independence, research skills, mathematical reasoning, and academic excellence.',
      icon: <Compass className="w-6 h-6 text-emerald-600" />,
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Student Development',
      level: 'All Grades',
      description: 'Building confidence, self-discipline, ethics, leadership, athletic teamwork, and cultural pride.',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      tagColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
  ];

  const whyChooseCards = [
    {
      title: 'Qualified Teachers',
      description: 'Supportive, certified, and dedicated educators committed to inspiring every child’s individual potential.',
      icon: <Award className="w-6 h-6 text-amber-500" />,
    },
    {
      title: 'Student-Centered Learning',
      description: 'Curricula and classroom methodologies thoughtfully designed around student developmental stages and learning styles.',
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'Technology & Innovation',
      description: 'Encouraging students to responsibly understand, create with, and master modern technology from an early age.',
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: 'Safe Learning Environment',
      description: 'A welcoming, secure, and respectful campus where physical safety and emotional well-being are paramount.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: 'Character Development',
      description: 'Cultivating responsible, ethical, compassionate, and confident young leaders who make positive contributions.',
      icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
    },
    {
      title: 'Creativity & Critical Thinking',
      description: 'Empowering curious students to question deeply, invent bravely, collaborate, and solve complex problems.',
      icon: <Lightbulb className="w-6 h-6 text-amber-600" />,
    },
  ];

  const coreValues = [
    { name: 'Excellence', desc: 'Pursuing the highest standards in academics, character, and effort.' },
    { name: 'Integrity', desc: 'Upholding honesty, moral courage, and accountability in all actions.' },
    { name: 'Innovation', desc: 'Embracing fresh ideas, scientific inquiry, and creative solutions.' },
    { name: 'Respect', desc: 'Valuing diversity, listening actively, and treating all with dignity.' },
    { name: 'Responsibility', desc: 'Taking ownership of our learning, community, and environment.' },
    { name: 'Collaboration', desc: 'Working harmoniously in teams to achieve collective greatness.' },
  ];

  const publishedNews = news.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a182e] via-[#0f2444] to-[#132c52] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle geometric background motif */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Admissions Open for 2026 Academic Year</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.15] text-white">
                Building Bright Minds for a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  Brighter Future
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Albright Academy provides quality education from KG1 through Grade 8, nurturing
                knowledge, character, creativity, confidence, and lifelong learning.
              </p>

              {/* CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  id="hero-apply-btn"
                  variant="gold"
                  size="lg"
                  onClick={() => navigate('/admissions')}
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="w-full sm:w-auto shadow-lg shadow-amber-500/20"
                >
                  Apply Now
                </Button>
                <Button
                  id="hero-explore-btn"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/academics')}
                  className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                >
                  Explore Our School
                </Button>
              </div>

              {/* Key Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-700/60 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-bold text-amber-400">KG1 – 8</div>
                  <div className="text-xs text-slate-300 font-medium">Grade Levels</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">1:18</div>
                  <div className="text-xs text-slate-300 font-medium">Teacher-Student Ratio</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">100%</div>
                  <div className="text-xs text-slate-300 font-medium">Dedicated Mentorship</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"
                  alt="Albright Academy Students Engaged in Learning"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a182e]/90 via-transparent to-transparent" />
                
                {/* Overlay floating badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-amber-400/30 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                        Accredited Academy
                      </p>
                      <p className="text-sm font-semibold text-white">
                        Holistic Child Development & Innovation Hub
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK INFORMATION SECTION */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Academic Divisions"
            title="Nurturing Growth at Every Developmental Stage"
            description="Our structured educational pathways are meticulously tailored to foster intellectual curiosity, foundational skills, and emotional maturity."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickInfoCards.map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-amber-400/80 hover:bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white shadow-xs border border-slate-100">
                      {card.icon}
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${card.tagColor}`}
                    >
                      {card.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f2444] mb-2 font-display">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <button
                    onClick={() => navigate('/academics')}
                    className="inline-flex items-center text-xs font-bold text-[#0f2444] hover:text-amber-600 transition-colors group cursor-pointer"
                  >
                    <span>View Curriculum</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2444] font-display tracking-tight leading-tight">
                Albright Academy is Committed to Quality Education in an Innovative Learning Environment
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {settings?.about ||
                  'Albright Academy is committed to providing quality education in a supportive and innovative learning environment.'}
              </p>

              {/* Mission & Vision Cards */}
              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2.5 text-[#0f2444] font-bold text-base mb-1.5">
                    <Target className="w-5 h-5 text-amber-500" />
                    <h4>Our Mission</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {settings?.mission ||
                      'To provide quality education from KG1 to Grade 8, nurturing knowledge, character, creativity, and lifelong learning.'}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2.5 text-[#0f2444] font-bold text-base mb-1.5">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <h4>Our Vision</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {settings?.vision ||
                      'To be a recognized center of educational excellence and innovation, shaping principled future leaders.'}
                  </p>
                </div>
              </div>

              <div>
                <Button
                  id="about-learn-more-btn"
                  variant="primary"
                  onClick={() => navigate('/about')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Learn More About Our Heritage
                </Button>
              </div>
            </div>

            {/* Core Values Bento */}
            <div className="lg:col-span-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
                <h3 className="text-xl font-bold text-[#0f2444] font-display mb-2">
                  Our Core Values
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  The enduring principles guiding every classroom lesson, interaction, and school policy.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coreValues.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-[#0f2444] font-bold text-sm mb-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span>{val.name}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE ALBRIGHT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Why Albright"
            title="The Albright Advantage"
            description="Six foundational pillars that distinguish Albright Academy as an exceptional home for your child’s primary and junior schooling."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseCards.map((card, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0f2444] font-display mb-2.5">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRINCIPAL'S MESSAGE SECTION */}
      <section className="py-20 bg-[#0c1c36] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Principal Photo */}
            <div className="lg:col-span-5 text-center">
              <div className="relative inline-block">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-4 border-amber-400/40 shadow-2xl mx-auto bg-slate-800">
                  <img
                    src={
                      settings?.principalPhotoUrl ||
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={settings?.principalName || 'Principal'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-md whitespace-nowrap">
                  School Leadership
                </div>
              </div>
            </div>

            {/* Principal Message Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                Message from School Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Welcome to Albright Academy
              </h2>
              <blockquote className="text-base sm:text-lg text-slate-200 leading-relaxed italic border-l-4 border-amber-400 pl-4 my-4">
                "{settings?.principalMessage ||
                  'Welcome to Albright Academy! At Albright, every child is recognized as an inquisitive thinker and a future innovator. Our goal is to cultivate a secure, vibrant community where students feel cherished and empowered.'}"
              </blockquote>
              <div>
                <h4 className="text-xl font-bold text-white">
                  {settings?.principalName || 'Dr. Helen Mengistu'}
                </h4>
                <p className="text-sm text-amber-400 font-medium">
                  {settings?.principalRole || 'Principal & Head of School'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST NEWS & UPCOMING EVENTS PREVIEW */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-100 text-amber-900 border border-amber-200 mb-2">
                Campus Pulse
              </span>
              <h2 className="text-3xl font-bold text-[#0f2444] font-display">
                Latest News & Announcements
              </h2>
            </div>
            <Button
              id="view-all-news-btn"
              variant="outline"
              size="sm"
              onClick={() => navigate('/news')}
              className="mt-4 md:mt-0"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View All News
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedNews.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedNews(item);
                  navigate('/news');
                }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer group"
              >
                <div className="h-48 overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0f2444]/90 text-amber-400 text-xs font-semibold">
                    {new Date(item.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      {item.author}
                    </span>
                    <h3 className="text-lg font-bold text-[#0f2444] font-display mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#0f2444] group-hover:text-amber-600">
                    <span>Read Full Story</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Events highlight banner */}
          <div className="mt-16 p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0f2444] font-display">
                    Upcoming School Calendar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Important academic events, athletics, and community gatherings.
                  </p>
                </div>
              </div>
              <Button
                id="view-all-events-btn"
                variant="ghost"
                size="sm"
                onClick={() => navigate('/events')}
                className="mt-3 sm:mt-0"
              >
                View Full Calendar →
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </div>
                  <h4 className="font-bold text-[#0f2444] text-base mb-2 line-clamp-1">
                    {event.title}
                  </h4>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. ADMISSION CALL-TO-ACTION */}
      <section className="py-16 bg-[#0f2444] text-white text-center relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
            Admissions Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Give Your Child the Foundation They Deserve
          </h2>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Begin the online admission application today. Our admissions team reviews each candidate
            with care and personalized attention.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              id="cta-apply-now"
              variant="gold"
              size="lg"
              onClick={() => navigate('/admissions')}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Start Online Application
            </Button>
            <Button
              id="cta-contact-admissions"
              variant="outline"
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-transparent text-white border-slate-600 hover:bg-slate-800"
            >
              Contact Admissions Office
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
