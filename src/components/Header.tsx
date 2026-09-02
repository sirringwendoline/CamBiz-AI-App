import React from 'react';
import { 
  Menu, 
  Plus, 
  Search, 
  Bell, 
  FileText, 
  UserPlus, 
  CalendarClock, 
  Sparkles,
  DollarSign
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setIsMobileOpen?: (open: boolean) => void;
  onOpenMobileMenu?: () => void;
  onOpenNewRequest: () => void;
  onOpenNewQuote?: () => void;
  onOpenNewQuotation?: () => void;
  onOpenNewFollowup?: () => void;
  followUpsDueTodayCount?: number;
  followUpsDueCount?: number;
  pendingRequestsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setIsMobileOpen,
  onOpenMobileMenu,
  onOpenNewRequest,
  onOpenNewQuote,
  onOpenNewQuotation,
  onOpenNewFollowup,
  followUpsDueTodayCount = 0,
  followUpsDueCount = 0,
  pendingRequestsCount = 0,
}) => {
  const handleOpenMenu = onOpenMobileMenu || (() => setIsMobileOpen && setIsMobileOpen(true));
  const handleCreateQuote = onOpenNewQuote || onOpenNewQuotation || (() => {});
  const effectiveDueCount = followUpsDueTodayCount > 0 ? followUpsDueTodayCount : followUpsDueCount;

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Executive Dashboard', subtitle: 'Overview of enquiries, quotation pipeline & active follow-ups' };
      case 'requests':
        return { title: 'Customer Requests & Leads', subtitle: 'Manage incoming enquiries with integrated AI assistance & WhatsApp replies' };
      case 'quotations':
        return { title: 'Quotation Generator', subtitle: 'Generate, calculate, and preview professional FCFA business estimates' };
      case 'followups':
        return { title: 'Follow-up Management', subtitle: 'Track communication deadlines, WhatsApp reminders & client actions' };
      case 'history':
      case 'activity':
        return { title: 'Activity & Audit Trail', subtitle: 'Real-time timeline of requests, quote submissions, and automated events' };
      case 'settings':
        return { title: 'Business Settings & Automation Hub', subtitle: 'Company details, Tax NIU/RCCM, Mobile Money accounts & integrations' };
      default:
        return { title: 'CamBiz AI', subtitle: 'Business Automation Assistant' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header id="cambiz-top-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* Left side: Hamburger & Titles */}
      <div className="flex items-center gap-3">
        <button
          id="open-sidebar-menu-btn"
          onClick={handleOpenMenu}
          className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 cursor-pointer"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold font-display text-stone-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs text-stone-600 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Quick stats & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Currency & Market Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100/90 border border-stone-200 text-xs text-stone-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-stone-900">Cameroon SME Portal</span>
          <span className="text-stone-300">|</span>
          <span className="font-mono text-emerald-800 font-bold">XAF / FCFA</span>
        </div>

        {/* Due Today Notification Pill */}
        {effectiveDueCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
            <Bell className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>{effectiveDueCount} Follow-up{effectiveDueCount > 1 ? 's' : ''} Due</span>
          </div>
        )}

        {/* Action Button: New Request */}
        <button
          id="header-new-request-btn"
          onClick={onOpenNewRequest}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>New Request</span>
        </button>

        {/* Action Button: Quick Quotation */}
        <button
          id="header-new-quote-btn"
          onClick={handleCreateQuote}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Quote</span>
        </button>
      </div>
    </header>
  );
};
