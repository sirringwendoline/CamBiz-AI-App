import React from 'react';
import { 
  Inbox, 
  FileText, 
  CalendarClock, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Plus, 
  Send,
  AlertCircle,
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { CustomerRequest, FollowUpItem, Quotation, ActivityLogItem } from '../types';
import { formatFCFA, formatDateOnly, formatDateTime, getWhatsAppUrl, getRelativeTimeStatus } from '../utils/formatters';

interface DashboardViewProps {
  requests: CustomerRequest[];
  quotations: Quotation[];
  followUps: FollowUpItem[];
  activities?: ActivityLogItem[];
  activityLogs?: ActivityLogItem[];
  onNavigateTab: (tab: any) => void;
  onOpenNewRequest: () => void;
  onOpenNewQuotation?: () => void;
  onOpenNewQuote?: () => void;
  onOpenNewFollowup?: () => void;
  onSelectRequest: (request: CustomerRequest) => void;
  onSelectQuote: (quote: Quotation) => void;
  onToggleFollowUpComplete?: (id: string, currentStatus: any) => void;
  onCompleteFollowup?: (followupId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  requests,
  quotations,
  followUps,
  activities,
  activityLogs,
  onNavigateTab,
  onOpenNewRequest,
  onOpenNewQuotation,
  onOpenNewQuote,
  onOpenNewFollowup,
  onSelectRequest,
  onSelectQuote,
  onToggleFollowUpComplete,
  onCompleteFollowup,
}) => {
  const effectiveActivityLogs = activities || activityLogs || [];
  const handleOpenQuote = onOpenNewQuotation || onOpenNewQuote || (() => onNavigateTab('quotations'));
  const handleOpenFollowup = onOpenNewFollowup || (() => onNavigateTab('followups'));

  const handleDoneFollowup = (id: string, currentStatus?: any) => {
    if (onToggleFollowUpComplete) {
      onToggleFollowUpComplete(id, currentStatus || 'Pending');
    } else if (onCompleteFollowup) {
      onCompleteFollowup(id);
    }
  };

  const newRequestsCount = requests.filter(r => r.status === 'New').length;
  const pendingRequestsCount = requests.filter(r => r.status === 'New' || r.status === 'Under Review').length;
  const totalQuotationsCount = quotations.length;
  const activeQuotationsValue = quotations
    .filter(q => q.status === 'Sent' || q.status === 'Accepted' || q.status === 'Draft')
    .reduce((sum, q) => sum + q.grandTotal, 0);

  const pendingFollowups = followUps.filter(f => f.status === 'Pending');
  const followUpsDueToday = pendingFollowups.filter(f => {
    const timeInfo = getRelativeTimeStatus(f.scheduledDate);
    return timeInfo.isToday || timeInfo.isPast;
  });

  const recentRequests = requests.slice(0, 4);
  const recentQuotations = quotations.slice(0, 4);

  return (
    <div id="dashboard-view-container" className="space-y-6 pb-12">
      {/* Welcome & Live Status Header */}
      <div className="bg-gradient-to-r from-[#0f231e] via-[#162f27] to-[#122822] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-900/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              CamBiz Automation Active
            </span>
            <span className="text-xs text-stone-400">Douala • Yaoundé • Nationwide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
            Welcome to CamBiz AI Assistant
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
            Streamline customer enquiries, generate itemized quotations in FCFA, and trigger automated WhatsApp follow-ups for your business.
          </p>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="dash-action-new-request"
            onClick={onOpenNewRequest}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Enquiry</span>
          </button>
          <button
            id="dash-action-new-quote"
            onClick={handleOpenQuote}
            className="px-3.5 py-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>New Quote</span>
          </button>
          <button
            id="dash-action-new-followup"
            onClick={handleOpenFollowup}
            className="px-3.5 py-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
          >
            <CalendarClock className="w-4 h-4 text-amber-400" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* 4 Core Business Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: New Enquiries */}
        <div 
          id="metric-card-new-enquiries"
          onClick={() => onNavigateTab('requests')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">New Enquiries</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-display text-stone-900">{newRequestsCount}</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {pendingRequestsCount} Pending
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Unprocessed client inquiries</p>
        </div>

        {/* Metric 2: Pending Requests */}
        <div 
          id="metric-card-pending-requests"
          onClick={() => onNavigateTab('requests')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Pipeline</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-display text-stone-900">{pendingRequestsCount}</span>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              In Review
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Enquiries under evaluation</p>
        </div>

        {/* Metric 3: Quotations */}
        <div 
          id="metric-card-quotations"
          onClick={() => onNavigateTab('quotations')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Quotations</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-display text-stone-900">{totalQuotationsCount}</span>
            <span className="text-xs font-semibold font-mono text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full truncate max-w-[110px]">
              {formatFCFA(activeQuotationsValue)}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Total active proposals in FCFA</p>
        </div>

        {/* Metric 4: Follow-ups Due */}
        <div 
          id="metric-card-followups-due"
          onClick={() => onNavigateTab('followups')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Follow-ups Due</span>
            <div className={`p-2 rounded-xl transition-colors ${
              followUpsDueToday.length > 0
                ? 'bg-amber-100 text-amber-800 animate-pulse'
                : 'bg-stone-100 text-stone-700 group-hover:bg-amber-700 group-hover:text-white'
            }`}>
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-display text-stone-900">{followUpsDueToday.length}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              followUpsDueToday.length > 0
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-700'
            }`}>
              {pendingFollowups.length} Total
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Pending outreach actions</p>
        </div>
      </div>

      {/* Urgent Follow-up Alert Box (if any due today) */}
      {followUpsDueToday.length > 0 && (
        <div id="urgent-followup-banner" className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm font-bold text-amber-950">
                Action Required: {followUpsDueToday.length} Follow-up{followUpsDueToday.length > 1 ? 's' : ''} Due
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('followups')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {followUpsDueToday.slice(0, 2).map((fol) => (
              <div key={fol.id} className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-xs flex flex-col justify-between gap-2.5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-900 truncate">
                      {fol.customerName} {fol.companyName ? `(${fol.companyName})` : ''}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                      {fol.channel}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {fol.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-stone-500 font-mono text-[11px]">Due: {fol.scheduledDate || 'Today'}</span>
                  <div className="flex items-center gap-2">
                    {fol.customerPhone && (
                      <a
                        href={getWhatsAppUrl(fol.customerPhone, `Hello ${fol.customerName.split(' ')[0]}, checking in from CamBiz regarding ${fol.reason}`)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] flex items-center gap-1 border border-emerald-200"
                      >
                        <MessageSquare className="w-3 h-3" />
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => handleDoneFollowup(fol.id, fol.status)}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Recent Requests & Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Customer Requests (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-emerald-700" />
                  Recent Customer Enquiries
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Submitted via online form, WhatsApp & direct calls</p>
              </div>
              <button
                id="dash-view-all-requests-btn"
                onClick={() => onNavigateTab('requests')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({requests.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {req.customerName}
                      </span>
                      {req.companyName && (
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          • <Building2 className="w-3 h-3 text-stone-400" /> {req.companyName}
                        </span>
                      )}
                      {req.city && (
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200">
                          {req.city}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-1">
                      {req.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-stone-400">
                      <span className="text-emerald-700 font-medium">{req.serviceType}</span>
                      <span>•</span>
                      <span>{formatDateOnly(req.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      req.status === 'New' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      req.status === 'Under Review' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      req.status === 'Quoted' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      req.status === 'In Progress' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {req.status}
                    </span>
                    <button
                      className="p-1.5 rounded-lg bg-stone-100 text-stone-600 group-hover:bg-emerald-700 group-hover:text-white transition-colors"
                      title="View with AI Assistant"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Powered by Gemini 3.7 Request Analysis</span>
            <button
              onClick={onOpenNewRequest}
              className="font-semibold text-stone-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Customer Request
            </button>
          </div>
        </div>

        {/* Right Column: Recent Quotations & Pipeline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  Active Quotations
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Calculated in FCFA with VAT & payment terms</p>
              </div>
              <button
                id="dash-view-all-quotes-btn"
                onClick={() => onNavigateTab('quotations')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({quotations.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {recentQuotations.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => onSelectQuote(quote)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-900">
                        {quote.quotationNumber}
                      </span>
                      <span className={`px-1.5 py-0.2 text-[10px] font-semibold rounded ${
                        quote.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                        quote.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-stone-100 text-stone-700'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-stone-900 truncate max-w-[180px]">
                      {quote.customerName}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Valid until {quote.validUntil}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold font-mono text-stone-900">
                      {formatFCFA(quote.grandTotal)}
                    </div>
                    <span className="text-[11px] text-stone-500">
                      {quote.items.length} line item{quote.items.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="font-mono font-semibold text-emerald-800">Total: {formatFCFA(activeQuotationsValue)}</span>
            <button
              onClick={handleOpenQuote}
              className="font-semibold text-stone-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Quote
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline Preview Strip */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <h3 className="font-display font-bold text-sm text-stone-900">Recent Automation Activity & Log</h3>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <span>Full History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {effectiveActivityLogs.slice(0, 3).map((act) => (
            <div key={act.id} className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/70 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-stone-900">{act.title}</span>
                </div>
                <p className="text-stone-600 text-[11px] line-clamp-2">
                  {act.description}
                </p>
              </div>
              <span className="text-[10px] text-stone-400 font-mono mt-2 block">
                {formatDateTime(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
