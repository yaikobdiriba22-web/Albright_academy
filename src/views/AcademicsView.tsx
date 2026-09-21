import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Compass,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Languages,
  Microscope,
  Palette,
  Laptop,
  Globe,
  Dna,
} from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';

interface AcademicsViewProps {
  navigate: (route: string) => void;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'kg' | 'primary' | 'junior'>('kg');

  const programs = {
    kg: {
      id: 'kg',
      badge: 'Early Childhood Education',
      title: 'Kindergarten Program (KG1 – KG3)',
      grades: ['KG1 (Ages 3-4)', 'KG2 (Ages 4-5)', 'KG3 (Ages 5-6)'],
      description:
        'Our early childhood wing creates a safe, nurturing, and joyful environment where children transition naturally into foundational literacy, numeracy, and cooperative peer play.',
      keyFocus: [
        'Early Literacy & Phonics Awakening',
        'Foundational Numeracy & Spatial Patterns',
        'Verbal Communication & Expressive Language',
        'Artistic Creativity & Music Expression',
        'Social-Emotional Development & Empathy',
        'Gross and Fine Motor Physical Development',
        'Guided Play-Based Experiential Learning',
        'Sensory Exploration & Nature Curiosity',
      ],
      methodology:
        'Learning through guided discovery, interactive storytelling, motor-skill development centers, and compassionate social guidance.',
      imageUrl:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
    },
    primary: {
      id: 'primary',
      badge: 'Foundational Mastery',
      title: 'Primary Program (Grade 1 – Grade 4)',
      grades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
      description:
        'In our primary classes, students build rock-solid competencies in core academic subjects while developing collaborative discipline, inquiry-driven thinking, and digital literacy.',
      keyFocus: [
        'Structured Mathematics & Mental Arithmetic',
        'English Language Arts, Reading Comprehension & Spelling',
        'Inquiry Science & Laboratory Experiments',
        'Environmental & Community Studies',
        'Creative Writing, Journaling & Story Development',
        'Visual Arts, Craftsmanship & Cultural Music',
        'ICT Fundamentals & Safe Digital Exploration',
        'Physical Education, Sportsmanship & Athletics',
      ],
      methodology:
        'Differentiated instruction tailored to each student’s pace, integrating hands-on manipulative learning with early digital exploration.',
      imageUrl:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    },
    junior: {
      id: 'junior',
      badge: 'Higher Order Thinking',
      title: 'Upper Primary & Junior Level (Grade 5 – Grade 8)',
      grades: ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'],
      description:
        'Preparing emerging adolescents for high-level secondary school entrance and modern global problem solving with deep academic rigor, critical analysis, and leadership ethics.',
      keyFocus: [
        'Advanced Mathematics & Pre-Algebra Reasoning',
        'English Literature, Persuasive Essays & Oratory',
        'Integrated Sciences (Biology, Chemistry, Physics Foundations)',
        'Social Studies, History & African/World Geography',
        'ICT, Applied Coding & Robotics Principles',
        'Complex Problem-Solving & Scientific Method',
        'Critical Thinking & Socratic Seminar Discussions',
        'Independent Research, Presentation & Study Skills',
      ],
      methodology:
        'Rigorous project-based learning, laboratory research reports, interdisciplinary projects, and rigorous exam preparation with personal mentorship.',
      imageUrl:
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80',
    },
  };

  const current = programs[activeTab];

  const subjectHighlights = [
    {
      title: 'STEM & Robotics Hub',
      desc: 'Hands-on coding, circuitry, and scientific experimentation from early grades.',
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Bilingual Literacy & Oratory',
      desc: 'Elevated English language mastery complemented by regional language appreciation.',
      icon: <Languages className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Mathematics Olympiad Prep',
      desc: 'Fostering deep numerical agility, logic puzzles, and competitive math clubs.',
      icon: <Calculator className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Experimental Science Labs',
      desc: 'Equipped biology, chemistry, and environmental science demonstration units.',
      icon: <Microscope className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <div className="py-12 bg-white">
      {/* Header Banner */}
      <div className="bg-[#0f2444] text-white py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            Curriculum & Pedagogy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            Academic Programs (KG1 to Grade 8)
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Our progressive curriculum is engineered to ignite lifelong curiosity, build foundational
            intellectual mastery, and foster innovative 21st-century problem solvers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              id="tab-kg"
              onClick={() => setActiveTab('kg')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'kg'
                  ? 'bg-[#0f2444] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              KG Program (KG1 – KG3)
            </button>
            <button
              id="tab-primary"
              onClick={() => setActiveTab('primary')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'primary'
                  ? 'bg-[#0f2444] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Primary (Grades 1 – 4)
            </button>
            <button
              id="tab-junior"
              onClick={() => setActiveTab('junior')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'junior'
                  ? 'bg-[#0f2444] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upper Primary / Junior (Grades 5 – 8)
            </button>
          </div>
        </div>

        {/* Selected Program Showcase */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left description */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                {current.badge}
              </span>
              <h2 className="text-3xl font-bold text-[#0f2444] font-display">
                {current.title}
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {current.description}
              </p>

              {/* Grade Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {current.grades.map((grade, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#0f2444] shadow-2xs"
                  >
                    {grade}
                  </span>
                ))}
              </div>

              {/* Focus Areas Grid */}
              <div className="pt-2">
                <h4 className="text-sm font-bold text-[#0f2444] uppercase tracking-wider mb-3">
                  Core Competencies & Curricular Focus:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.keyFocus.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide block mb-1">
                  Instructional Philosophy:
                </span>
                <p className="text-xs sm:text-sm text-slate-600 italic">
                  "{current.methodology}"
                </p>
              </div>

              <div className="pt-2">
                <Button
                  id="academics-apply-btn"
                  variant="gold"
                  onClick={() => navigate('/admissions')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Apply for {current.title.split(' ')[0]}
                </Button>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-slate-200">
                <img
                  src={current.imageUrl}
                  alt={current.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Enrichments */}
        <div className="mb-20">
          <SectionHeader
            badge="Innovation & Mastery"
            title="Integrated Co-Curricular & STEM Pillars"
            description="Our academic framework merges standard educational curricula with cutting-edge hands-on discovery and creative expression."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjectHighlights.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all"
              >
                <div className="p-3 rounded-xl bg-slate-50 w-fit mb-4 border border-slate-100">
                  {s.icon}
                </div>
                <h4 className="text-base font-bold text-[#0f2444] font-display mb-2">
                  {s.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment & Promotion info */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0a182e] text-white">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Continuous Assessment
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Holistic Evaluation & Parental Collaboration
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At Albright Academy, assessment is ongoing and comprehensive. Rather than relying purely
              on high-stakes testing, our educators evaluate pupil growth through portfolio projects,
              practical science demonstrations, reading journals, and classroom oratory. Regular
              termly progress reports and collaborative parent-teacher conferences ensure full
              alignment between home and school.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/admissions')}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Review Admissions Criteria
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
