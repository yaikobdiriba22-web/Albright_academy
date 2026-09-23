import React from 'react';
import { Home, ArrowLeft, GraduationCap, Phone, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';
import { useTranslation } from '../i18n/LanguageContext.tsx';

interface NotFoundViewProps {
  navigate: (route: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ navigate }) => {
  const { d, language } = useTranslation();

  const getHeading = () => {
    if (language === 'am') return 'ገጹ አልተገኘም (404)';
    if (language === 'om') return 'Fuulli Hin Argamne (404)';
    return 'Page Not Found (404)';
  };

  const getSubheading = () => {
    if (language === 'am') {
      return 'ይቅርታ፣ የፈለጉት ገጽ አልተገኘም ወይም ተንቀሳቅሷል። እባክዎ ከታች ያሉትን አገናኞች በመጠቀም ወደ ዋናው ገጽ ይመለሱ።';
    }
    if (language === 'om') {
      return 'Dhiifama, fuulli barbaaddan hin argamne yookiin gara bakka biraatti jijjiirameera. Maaloo qabsiisota armaan gadii fayyadamaa.';
    }
    return 'The page you are looking for does not exist or may have been moved. Please use the navigation links below to explore Albright Academy.';
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Visual Badge */}
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-[#0f2444] to-[#1e3a66] flex items-center justify-center text-amber-400 shadow-xl border-4 border-amber-400/30">
            <span className="text-4xl sm:text-5xl font-black font-display tracking-tight text-amber-400">
              404
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-500 text-slate-950 shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {d.common.schoolName} — {d.common.centerOfExcellence || 'Center of Excellence and Innovation'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f2444] font-display">
            {getHeading()}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            {getSubheading()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            id="not-found-home-btn"
            variant="gold"
            size="md"
            onClick={() => navigate('/')}
            icon={<Home className="w-4 h-4" />}
          >
            {d.nav.home}
          </Button>

          <Button
            id="not-found-admissions-btn"
            variant="primary"
            size="md"
            onClick={() => navigate('/admissions')}
            icon={<GraduationCap className="w-4 h-4" />}
          >
            {d.common.applyNow}
          </Button>

          <Button
            id="not-found-contact-btn"
            variant="outline"
            size="md"
            onClick={() => navigate('/contact')}
            icon={<Phone className="w-4 h-4" />}
          >
            {d.nav.contact}
          </Button>
        </div>

        {/* Helpful Directory Cards */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Popular Albright Academy Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
            <button
              onClick={() => navigate('/about')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 transition-colors text-center"
            >
              {d.nav.about}
            </button>
            <button
              onClick={() => navigate('/academics')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 transition-colors text-center"
            >
              {d.nav.academics}
            </button>
            <button
              onClick={() => navigate('/teachers')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 transition-colors text-center"
            >
              {d.nav.teachers}
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 transition-colors text-center"
            >
              {d.common.adminPortal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
