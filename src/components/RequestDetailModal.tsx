import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MessageSquare, 
  Mail, 
  Phone, 
  CalendarClock, 
  FileText, 
  Check, 
  Copy, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Clock, 
  Tag, 
  ArrowRight,
  RefreshCw,
  Send,
  AlertCircle
} from 'lucide-react';
import { CustomerRequest, RequestStatus } from '../types';
import { formatDateTime, getWhatsAppUrl } from '../utils/formatters';

interface RequestDetailModalProps {
  request: CustomerRequest | null;
  onClose: () => void;
  onUpdateStatus: (requestId: string, status: RequestStatus) => void;
  onTriggerAiAnalysis: (requestId: string) => Promise<void>;
  onCreateQuoteFromRequest: (request: CustomerRequest) => void;
  onCreateFollowupFromRequest: (request: CustomerRequest, timingDate?: string, actionText?: string) => void;
  isAiAnalyzing: boolean;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  onClose,
  onUpdateStatus,
  onTriggerAiAnalysis,
  onCreateQuoteFromRequest,
  onCreateFollowupFromRequest,
  isAiAnalyzing,
}) => {
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [activeResponseTab, setActiveResponseTab] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');

  if (!request) return null;

  const copyToClipboard = (text: string, channel: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channel);
    setTimeout(() => setCopiedChannel(null), 2500);
  };

  const ai = request.aiAnalysis;

  return (
    <div id="request-detail-modal" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-emerald-400 font-bold">{request.ticketNumber}</span>
                <span className="text-stone-400 text-xs">•</span>
                <h3 className="font-display font-bold text-base text-white truncate max-w-sm sm:max-w-md">
                  {request.customerName}
                </h3>
              </div>
              <p className="text-xs text-stone-300">
                {request.companyName ? `${request.companyName} — ` : ''}{request.serviceType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/50">
          
          {/* Status & Quick Metadata Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-stone-500">Pipeline Status:</span>
              <select
                id="request-status-dropdown"
                value={request.status}
                onChange={(e) => onUpdateStatus(request.id, e.target.value as RequestStatus)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="New">🟡 New</option>
                <option value="Under Review">🔵 Under Review</option>
                <option value="Quoted">🟣 Quoted</option>
                <option value="In Progress">🟢 In Progress</option>
                <option value="Closed (Won)">✅ Closed (Won)</option>
                <option value="Closed (Lost)">❌ Closed (Lost)</option>
              </select>

              <span className="text-stone-300">|</span>

              <div className="flex items-center gap-2 text-xs text-stone-600">
                <span className="font-semibold text-stone-700">Preferred Contact:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                  {request.preferredContact}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="create-quote-from-request-top-btn"
                onClick={() => {
                  onCreateQuoteFromRequest(request);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Create Quotation</span>
              </button>

              <button
                id="create-followup-from-request-top-btn"
                onClick={() => {
                  onCreateFollowupFromRequest(request, ai?.suggestedFollowUp?.suggestedDate, ai?.recommendedAction);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CalendarClock className="w-3.5 h-3.5 text-amber-400" />
                <span>Schedule Follow-up</span>
              </button>
            </div>
          </div>

          {/* Customer & Request Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Details Box */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                Client Profile
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-500 block">Name & Company:</span>
                  <span className="font-semibold text-stone-900 text-sm">{request.customerName}</span>
                  {request.companyName && <p className="text-stone-600">{request.companyName}</p>}
                </div>
                <div>
                  <span className="text-stone-500 block">Location / City:</span>
                  <span className="font-medium text-stone-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {request.city || 'Cameroon (National)'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Phone / WhatsApp:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-stone-900 font-medium">{request.phone || 'N/A'}</span>
                    {request.phone && (
                      <a
                        href={getWhatsAppUrl(request.phone, ai?.suggestedResponse?.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-stone-500 block">Email Address:</span>
                  <a href={`mailto:${request.email}`} className="text-emerald-800 font-medium hover:underline truncate block">
                    {request.email || 'N/A'}
                  </a>
                </div>
                <div>
                  <span className="text-stone-500 block">Estimated Budget:</span>
                  <span className="font-mono font-semibold text-stone-900">{request.budgetEstimate || 'To be determined'}</span>
                </div>
              </div>
            </div>

            {/* Request Full Description Box */}
            <div className="md:col-span-2 bg-white p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    Customer Request Description
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Received: {formatDateTime(request.createdAt)}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                  {request.description}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span className="font-medium text-stone-700">Category: {request.serviceType}</span>
                <span className="font-semibold text-amber-700">Priority: {request.priority}</span>
              </div>
            </div>
          </div>

          {/* AI Assistant Section (The core requirement!) */}
          <div className="bg-gradient-to-br from-[#0c1815] to-[#12231e] text-white p-5 sm:p-6 rounded-2xl border border-emerald-800/60 shadow-lg space-y-5">
            {/* AI Assistant Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    CamBiz AI Assistant Analysis
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Gemini 3.7 Flash
                    </span>
                  </h4>
                  <p className="text-xs text-stone-400">
                    Automated client summarization, response templates & commercial follow-up recommendations
                  </p>
                </div>
              </div>

              <button
                id="re-analyze-request-ai-btn"
                onClick={() => onTriggerAiAnalysis(request.id)}
                disabled={isAiAnalyzing}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAiAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
              </button>
            </div>

            {/* AI Content Modules */}
            {ai ? (
              <div className="space-y-4">
                {/* 1. AI Summary */}
                <div className="bg-stone-900/80 p-3.5 rounded-xl border border-emerald-900/40">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    1. Request Summary & Core Need
                  </span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                    {ai.summary}
                  </p>
                </div>

                {/* 2. Suggested Response (Tabs: WhatsApp / Email / Phone script) */}
                <div className="bg-stone-900/80 p-4 rounded-xl border border-emerald-900/40 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      2. Suggested Response (Bilingual SME Etiquette)
                    </span>
                    <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
                      <button
                        onClick={() => setActiveResponseTab('whatsapp')}
                        className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          activeResponseTab === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        WhatsApp
                      </button>
                      <button
                        onClick={() => setActiveResponseTab('email')}
                        className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          activeResponseTab === 'email' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </button>
                      <button
                        onClick={() => setActiveResponseTab('phone')}
                        className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          activeResponseTab === 'phone' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Phone className="w-3 h-3" />
                        Phone Script
                      </button>
                    </div>
                  </div>

                  {/* Active tab content */}
                  <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {activeResponseTab === 'whatsapp' && ai.suggestedResponse.whatsapp}
                    {activeResponseTab === 'email' && ai.suggestedResponse.email}
                    {activeResponseTab === 'phone' && ai.suggestedResponse.phoneScript}
                  </div>

                  {/* Action buttons for response */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        const text = activeResponseTab === 'whatsapp' 
                          ? ai.suggestedResponse.whatsapp 
                          : activeResponseTab === 'email' 
                          ? ai.suggestedResponse.email 
                          : ai.suggestedResponse.phoneScript;
                        copyToClipboard(text, activeResponseTab);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
                    >
                      {copiedChannel === activeResponseTab ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-400" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>

                    {activeResponseTab === 'whatsapp' && request.phone && (
                      <a
                        href={getWhatsAppUrl(request.phone, ai.suggestedResponse.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Direct on WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* 3. Recommended Action & 4. Suggested Follow-up Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recommended Action */}
                  <div className="bg-stone-900/80 p-3.5 rounded-xl border border-emerald-900/40 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                        3. Recommended Business Action
                      </span>
                      <p className="text-xs sm:text-sm text-stone-200">
                        {ai.recommendedAction}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onCreateQuoteFromRequest(request);
                        onClose();
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Prepare Quotation Now</span>
                    </button>
                  </div>

                  {/* Suggested Follow-up Timing */}
                  <div className="bg-stone-900/80 p-3.5 rounded-xl border border-emerald-900/40 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                        4. Recommended Follow-up Schedule
                      </span>
                      <div className="flex items-center gap-2 text-xs text-stone-200">
                        <span className="font-bold text-amber-300 font-mono">{ai.suggestedFollowUp.timingText}</span>
                        <span>(Target: {ai.suggestedFollowUp.suggestedDate})</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">
                        {ai.suggestedFollowUp.reason}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onCreateFollowupFromRequest(request, ai.suggestedFollowUp.suggestedDate, ai.recommendedAction);
                        onClose();
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>Add to Follow-up Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-xs text-stone-300">Click below to generate intelligent Cameroon SME response & pipeline actions.</p>
                <button
                  onClick={() => onTriggerAiAnalysis(request.id)}
                  disabled={isAiAnalyzing}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Business Assistant</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>CamBiz Ticket ID: <span className="font-mono font-bold text-stone-800">{request.id}</span></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
