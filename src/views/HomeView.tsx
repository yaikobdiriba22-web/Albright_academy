import React from 'react';
import { ArrowRight, Award, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Cpu, HeartHandshake, MapPin, Menu, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { SchoolSettings, NewsItem, SchoolEvent } from '../types/index.ts';
import { useTranslation } from '../i18n/LanguageContext.tsx';

interface HomeViewProps {
  navigate: (route: string) => void;
  settings: SchoolSettings | null;
  news: NewsItem[];
  events: SchoolEvent[];
  setSelectedNews: (news: NewsItem | null) => void;
}

const imageSet = {
  hero: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=85',
  learning: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=85',
  stem: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85',
  students: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=85',
};

export const HomeView: React.FC<HomeViewProps> = ({ navigate, settings, news, events, setSelectedNews }) => {
  const { language } = useTranslation();
  const isOm = language === 'om';
  const isAm = language === 'am';

  const copy = {
    eyebrow: isAm ? 'የልቀት እና ፈጠራ ማዕከል' : isOm ? 'Gidduu Gala Gahumsa fi Kalaqaa' : 'CENTER OF EXCELLENCE & INNOVATION',
    title: isAm ? 'የወደፊት ትውልድን እንገነባለን።' : isOm ? 'Dhaloota Boruu Ijaarra.' : 'Building Bright Minds. Shaping Future Leaders.',
    subtitle: isAm ? 'ከKG1 እስከ 8ኛ ክፍል፣ ልጆች እንዲያስቡ፣ እንዲፈጥሩ እና በእምነት እንዲያድጉ የሚያግዝ ዘመናዊ ትምህርት።' : isOm ? 'KG1 irraa hanga Kutaa 8tti, barattoonni akka yaadan, akka kalaqan, fi ofitti amanamummaa qabaatanii akka guddatan ni deeggarra.' : 'A modern KG1–Grade 8 learning community where children are encouraged to think deeply, create boldly, and grow with confidence.',
    apply: isAm ? 'ለመግቢያ ያመልክቱ' : isOm ? 'Galmee Barnootaaf Iyyadhu' : 'Apply for Admission',
    explore: isAm ? 'አልብራይትን ያስሱ' : isOm ? 'Albright Daawwadhu' : 'Explore Albright',
    aboutTitle: isAm ? 'ልጅዎ ከመማር በላይ ይማራል' : isOm ? 'Ilmi keessan barachuu caalaa ni barataa' : 'More than a school. A place to discover.',
    aboutText: isAm ? 'አልብራይት አካዳሚ ትምህርትን፣ ባህሪን፣ ቴክኖሎጂን እና ደህንነትን በአንድ የተመጣጠነ የመማሪያ ልምድ ያጣምራል።' : isOm ? 'Albright Academy barnoota, amala gaarii, teeknooloojii fi nageenya muuxannoo barnootaa madaalawaa tokko keessatti walitti qaba.' : 'Albright Academy brings together strong academics, character, technology, creativity, and student wellbeing in one connected learning experience.',
    programs: isAm ? 'የትምህርት መርሃ ግብሮች' : isOm ? 'Sagantaalee Barnootaa' : 'Learning Pathways',
    news: isAm ? 'የቅርብ ጊዜ ዜና' : isOm ? 'Oduu Haaraa' : 'Latest from Albright',
    events: isAm ? 'መጪ ዝግጅቶች' : isOm ? 'Sagantaalee Dhufan' : 'Upcoming Events',
    portalTitle: isAm ? 'ቤተሰቦችን ከትምህርት ጋር እናገናኛለን' : isOm ? 'Maatii fi Barnoota Walitti Hidhuu' : 'Keep families connected to learning',
    portalText: isAm ? 'ወላጆች፣ መምህራን እና ተማሪዎች ከየራሳቸው ፖርታል በኩል መረጃን በደህንነት ያገኛሉ።' : isOm ? 'Maatiin, barsiisotni fi barattootni poortaala isaanii irraa odeeffannoo barbaachisaa nageenyaan argatu.' : 'Parents, teachers, and students can securely access the information and tools they need through dedicated portals.',
  };

  const programs = [
    { title: 'KG1 – KG2', label: 'Early Years', icon: Sparkles, color: 'amber', text: 'Play-based discovery, language, social growth, and early numeracy.' },
    { title: 'Grades 1 – 4', label: 'Primary', icon: BookOpen, color: 'blue', text: 'Strong foundations in languages, mathematics, science, arts, and values.' },
    { title: 'Grades 5 – 8', label: 'Junior School', icon: Cpu, color: 'emerald', text: 'Deeper inquiry, ICT, STEM, leadership, and independent learning.' },
  ];

  const pillars = [
    { icon: Award, title: 'Academic Excellence', text: 'Clear learning goals, purposeful assessment, and support for every learner.' },
    { icon: Cpu, title: 'Innovation & Technology', text: 'Technology and practical projects used to strengthen problem-solving and creativity.' },
    { icon: HeartHandshake, title: 'Character & Values', text: 'Respect, responsibility, integrity, collaboration, and service are part of school life.' },
    { icon: ShieldCheck, title: 'Safe & Caring', text: 'A welcoming environment designed around student wellbeing, safeguarding, and belonging.' },
  ];

  return (
    <div className="bg-[#f7f9fc] overflow-hidden">
      <section className="relative min-h-[760px] flex items-center">
        <img src={imageSet.hero} alt="Students learning at Albright Academy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,38,.94),rgba(4,18,38,.76),rgba(4,18,38,.18))]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a32] via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 w-full">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-2 text-xs font-bold tracking-[.18em] text-amber-300">
              <Sparkles className="w-4 h-4" /> {copy.eyebrow}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-.045em] text-white leading-[.98] font-display">
              {copy.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="mt-7 text-lg sm:text-xl leading-8 text-slate-200 max-w-2xl">
              {copy.subtitle}
            </motion.p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button onClick={() => navigate('/admissions')} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-black text-[#071a32] shadow-xl hover:bg-amber-300 transition">
                {copy.apply}<ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/about')} className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition">
                {copy.explore}<ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 text-sm text-white/90">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> KG1 – Grade 8</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Technology-forward learning</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Family partnership</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f7f9fc] to-transparent" />
      </section>

      <section className="relative z-10 -mt-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {programs.map((p, i) => {
            const Icon = p.icon;
            return <motion.button key={p.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} onClick={() => navigate('/academics')} className="text-left bg-white/95 backdrop-blur rounded-2xl border border-slate-200 p-6 shadow-[0_20px_60px_rgba(15,36,68,.10)] hover:-translate-y-1 transition group">
              <div className="flex items-start justify-between">
                <span className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center"><Icon className="w-5 h-5 text-[#0f2444]" /></span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition" />
              </div>
              <div className="mt-5 text-xs font-black uppercase tracking-[.16em] text-amber-600">{p.label}</div>
              <h3 className="mt-1 text-xl font-black text-[#0f2444]">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{p.text}</p>
            </motion.button>;
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-black tracking-[.18em] uppercase text-amber-600">ALBRIGHT ACADEMY</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-[#0f2444] font-display">{copy.aboutTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl">{copy.aboutText}</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {pillars.map((p) => { const Icon = p.icon; return <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="w-5 h-5 text-amber-500" /><h3 className="mt-3 font-black text-[#0f2444]">{p.title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{p.text}</p></div>; })}
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img src={imageSet.learning} alt="Students learning together" className="w-full aspect-[4/5] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-[#0f2444] text-white rounded-2xl px-6 py-5 shadow-2xl max-w-xs">
              <div className="text-amber-300 text-xs font-black uppercase tracking-widest">Our promise</div>
              <div className="mt-1 font-bold leading-6">Every learner deserves to be known, supported, and challenged.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0b203b] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-black tracking-[.18em] text-amber-300 uppercase">LEARNING IN ACTION</span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-black font-display">{copy.programs}</h2>
              <p className="mt-5 text-slate-300 leading-7 max-w-xl">From joyful early learning to independent inquiry, our pathways are designed to build strong foundations and confidence for the next stage.</p>
              <button onClick={() => navigate('/academics')} className="mt-7 inline-flex items-center gap-2 text-sm font-black text-amber-300 hover:text-amber-200">View academic programs <ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <img src={imageSet.stem} alt="Science learning" className="rounded-3xl aspect-square object-cover" />
              <img src={imageSet.students} alt="Students collaborating" className="rounded-3xl aspect-square object-cover sm:mt-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div><span className="text-xs font-black tracking-[.18em] uppercase text-amber-600">{copy.news}</span><h2 className="mt-2 text-4xl font-black text-[#0f2444] font-display">What’s happening at Albright</h2></div>
          <button onClick={() => navigate('/news')} className="hidden sm:flex items-center gap-2 text-sm font-black text-[#0f2444]">All news <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {news.slice(0, 3).map((item) => <article key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition">
            <img src={item.imageUrl} alt={item.title} className="w-full aspect-[16/9] object-cover" />
            <div className="p-5"><div className="text-[11px] font-black uppercase tracking-widest text-amber-600">{item.author || 'Albright Academy'}</div><h3 className="mt-2 text-lg font-black text-[#0f2444] line-clamp-2">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">{item.summary}</p><button onClick={() => { setSelectedNews(item); navigate('/news'); }} className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0f2444]">Read story <ArrowRight className="w-4 h-4" /></button></div>
          </article>)}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div><span className="text-xs font-black tracking-[.18em] uppercase text-amber-600">{copy.events}</span><h2 className="mt-2 text-4xl font-black text-[#0f2444] font-display">Plan ahead with our school calendar</h2></div>
            <button onClick={() => navigate('/events')} className="hidden sm:flex items-center gap-2 text-sm font-black text-[#0f2444]">View calendar <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {events.slice(0, 3).map((event) => <button key={event.id} onClick={() => navigate('/events')} className="text-left rounded-2xl border border-slate-200 p-5 hover:border-amber-300 hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-amber-600"><CalendarDays className="w-5 h-5" /><span className="text-xs font-black uppercase tracking-widest">{event.date}</span></div>
              <h3 className="mt-4 font-black text-[#0f2444]">{event.title}</h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{event.description}</p>
              <div className="mt-4 text-xs text-slate-400 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{event.location}</div>
            </button>)}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#0f2444] to-[#173e6d] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8"><span className="text-xs font-black uppercase tracking-[.18em] text-amber-300">FAMILY PORTALS</span><h2 className="mt-3 text-4xl sm:text-5xl font-black font-display">{copy.portalTitle}</h2><p className="mt-5 max-w-2xl text-slate-300 leading-7">{copy.portalText}</p></div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button onClick={() => navigate('/parent/login')} className="rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-black text-[#071a32] hover:bg-amber-300 transition">Parent Portal</button>
              <button onClick={() => navigate('/teacher/login')} className="rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-black text-white hover:bg-white/15 transition">Teacher Portal</button>
              <button onClick={() => navigate('/student/login')} className="rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-black text-white hover:bg-white/15 transition">Student Portal</button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-400">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div><div className="text-xs font-black uppercase tracking-[.18em] text-[#0f2444]/70">READY TO JOIN ALBRIGHT?</div><h2 className="mt-1 text-3xl font-black text-[#0f2444]">Start your child’s next chapter.</h2></div>
          <button onClick={() => navigate('/admissions')} className="inline-flex items-center gap-2 rounded-xl bg-[#0f2444] text-white px-6 py-3.5 font-black text-sm hover:bg-[#173e6d] transition">{copy.apply}<ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
    </div>
  );
};
