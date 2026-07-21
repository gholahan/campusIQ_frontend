import { ArrowLeft, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AIHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-14 min-h-14 px-4 border-b border-[var(--border)] flex items-center gap-3 flex-shrink-0 bg-[var(--bg)]">
      {/* back button — mobile only */}
      <button
        onClick={() => navigate('/student/dashboard')}
        className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg2)] transition-colors flex-shrink-0"
        aria-label="Back"
      >
        <ArrowLeft size={18} className="text-[var(--text2)]" />
      </button>

      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--bg2)] border border-[var(--border)]">
          <Sparkles size={16} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-[var(--text)]">CampusIQ AI</div>
          <div className="text-[11px] text-[var(--text3)]">Free plan</div>
        </div>
      </div>
      {/* <button className="w-9 h-9 rounded-lg hover:bg-[var(--bg2)] flex items-center justify-center transition-colors">
        <Search size={17} className="text-[var(--text2)]" />
      </button> */}
    </header>
  );
}
