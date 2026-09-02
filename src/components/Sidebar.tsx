import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  CalendarClock, 
  History, 
  Settings, 
  Sparkles,
  Layers,
  ChevronRight,
  X,
  PhoneCall
} from 'lucide-react';
import { CustomerRequest, FollowUpItem, Quotation } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  requests?: CustomerRequest[];
  quotations?: Quotation[];
  followUps?: FollowUpItem[];
  pendingRequestsCount?: number;
  followUpsDueCount?: number;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  requests = [],
  quotations = [],
  followUps = [],
  pendingRequestsCount: propPendingRequestsCount,
  followUpsDueCount: propFollowUpsDueCount,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const calculatedPendingRequests = requests.filter(r => r.status === 'New' || r.status === 'Under Review').length;
  const calculatedPendingFollowups = followUps.filter(f => f.status === 'Pending').length;
  const calculatedActiveQuotes = quotations.filter(q => q.status === 'Sent' || q.status === 'Draft').length;

  const pendingRequestsCount = propPendingRequestsCount !== undefined ? propPendingRequestsCount : calculatedPendingRequests;
  const pendingFollowupsCount = propFollowUpsDueCount !== undefined ? propFollowUpsDueCount : calculatedPendingFollowups;
  const activeQuotesCount = calculatedActiveQuotes;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'requests',
      label: 'Customer Requests',
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      badgeColor: 'bg-amber-500 text-stone-950 font-bold',
    },
    {
      id: 'quotations',
      label: 'Quotations',
      icon: FileText,
      badge: activeQuotesCount > 0 ? activeQuotesCount : null,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'followups',
      label: 'Follow-ups',
      icon: CalendarClock,
      badge: pendingFollowupsCount > 0 ? pendingFollowupsCount : null,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'history',
      label: 'Activity History',
      icon: History,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings & Workflows',
      icon: Settings,
      badge: 'Auto',
      badgeColor: 'bg-stone-800 text-emerald-400 border border-emerald-500/30 text-[10px]',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          id="mobile-sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="cambiz-main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0d151c] text-stone-200 flex flex-col border-r border-stone-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-md shadow-emerald-950/40 border border-emerald-500/30 text-white font-bold text-lg font-display">
              CB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight text-white">
                  CamBiz<span className="text-emerald-400">.AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  SME
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Cameroon Business OS
              </p>
            </div>
          </div>
          <button
            id="close-mobile-sidebar-btn"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cameroon SME Badge */}
        <div className="mx-4 my-3 p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-xs">
          <div className="flex items-center justify-between text-stone-300 mb-1">
            <span className="font-medium flex items-center gap-1.5 text-stone-200">
              <span className="flex gap-0.5">
                <span className="w-2 h-2.5 rounded-xs bg-emerald-600"></span>
                <span className="w-2 h-2.5 rounded-xs bg-red-600 relative">
                  <span className="absolute inset-0 flex items-center justify-center text-[6px] text-amber-300 font-bold leading-none">★</span>
                </span>
                <span className="w-2 h-2.5 rounded-xs bg-amber-400"></span>
              </span>
              Central Africa Edition
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">FCFA (XAF)</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Automated quotes & WhatsApp follow-ups for Douala, Yaoundé & regional SMEs.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* AI Engine Status Card */}
        <div className="p-4 border-t border-stone-800 bg-[#0a0f14]">
          <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/50 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-200">Gemini 3.7 Engine</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Instant quote drafting, French/English replies & pipeline actions.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
