import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  CalendarClock, 
  Building2, 
  ChevronRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { Quotation, QuotationStatus } from '../types';
import { formatFCFA, formatDateOnly, getWhatsAppUrl } from '../utils/formatters';

interface QuotationsViewProps {
  quotations: Quotation[];
  onOpenNewQuote: () => void;
  onSelectQuote: (quote: Quotation) => void;
  onUpdateQuoteStatus: (quoteId: string, status: QuotationStatus) => void;
  onCreateFollowupFromQuote: (quote: Quotation) => void;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  quotations,
  onOpenNewQuote,
  onSelectQuote,
  onUpdateQuoteStatus,
  onCreateFollowupFromQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredQuotes = quotations.filter((q) => {
    const matchesSearch = 
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.customerCity || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = filteredQuotes.reduce((acc, q) => acc + q.grandTotal, 0);
  const acceptedValue = filteredQuotes.filter(q => q.status === 'Accepted').reduce((acc, q) => acc + q.grandTotal, 0);

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'Declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Expired':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div id="quotations-view-container" className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-stone-900">
              Quotation & Commercial Pro-Forma Manager
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {filteredQuotes.length} Quotes
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Auto-calculated quotes in FCFA with VAT (TVA), mobile money details, and exportable invoices.
          </p>
        </div>

        <button
          id="quotations-create-new-btn"
          onClick={onOpenNewQuote}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quotation</span>
        </button>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Pipeline Total Value</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {formatFCFA(totalValue)}
          </div>
          <span className="text-[11px] text-stone-500">Across {filteredQuotes.length} quotes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Accepted Deals (Won)</span>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
            {formatFCFA(acceptedValue)}
          </div>
          <span className="text-[11px] text-emerald-700">Validated by customers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Proposals Sent</span>
          <div className="text-xl font-bold font-mono text-blue-700 mt-1">
            {quotations.filter(q => q.status === 'Sent').length} Quotes
          </div>
          <span className="text-[11px] text-stone-500">Pending client confirmation</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="quotes-search-input"
            placeholder="Search by quote number, client, company or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/60"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            id="quotes-filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Draft">Drafts</option>
            <option value="Sent">Sent to Client</option>
            <option value="Accepted">Accepted (Won)</option>
            <option value="Declined">Declined</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-stone-900">No quotations found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try modifying your search query or filter.'
              : 'Create your first professional quotation in FCFA.'}
          </p>
          <button
            onClick={onOpenNewQuote}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quotation</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Quote No.</th>
                  <th className="py-3.5 px-4">Customer & Company</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Valid Until</th>
                  <th className="py-3.5 px-4">Line Items</th>
                  <th className="py-3.5 px-4">Grand Total (FCFA)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-800">
                {filteredQuotes.map((q) => (
                  <tr 
                    key={q.id}
                    className="hover:bg-stone-50/70 transition-colors group cursor-pointer"
                    onClick={() => onSelectQuote(q)}
                  >
                    {/* Quote No */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-900 group-hover:underline">
                      {q.quotationNumber}
                    </td>

                    {/* Customer & Company */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-stone-900">{q.customerName}</div>
                        {q.companyName && (
                          <div className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-stone-400" />
                            {q.companyName}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Issue Date */}
                    <td className="py-3.5 px-4 text-stone-600 font-mono">
                      {q.date}
                    </td>

                    {/* Valid Until */}
                    <td className="py-3.5 px-4 text-stone-600 font-mono">
                      {q.validUntil}
                    </td>

                    {/* Line Items */}
                    <td className="py-3.5 px-4 text-stone-600">
                      <span className="font-semibold text-stone-800">{q.items.length} item{q.items.length > 1 ? 's' : ''}</span>
                      <span className="text-[10px] text-stone-400 block truncate max-w-[120px]">
                        {q.items[0]?.name || ''}
                      </span>
                    </td>

                    {/* Grand Total */}
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-950 text-sm">
                      {formatFCFA(q.grandTotal)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={q.status}
                        onChange={(e) => onUpdateQuoteStatus(q.id, e.target.value as QuotationStatus)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border focus:ring-2 focus:ring-emerald-600 cursor-pointer ${getStatusBadge(q.status)}`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted (Won)</option>
                        <option value="Declined">Declined</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectQuote(q)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Open and Preview Official Quotation"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Preview</span>
                        </button>

                        {q.customerPhone && (
                          <a
                            href={getWhatsAppUrl(
                              q.customerPhone,
                              `Hello ${q.customerName.split(' ')[0]}, here is your quotation ${q.quotationNumber} (${formatFCFA(q.grandTotal)}) from CamBiz. Please let us know if you would like to proceed!`
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                            title="Share via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => onCreateFollowupFromQuote(q)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                          title="Schedule Follow-up"
                        >
                          <CalendarClock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
