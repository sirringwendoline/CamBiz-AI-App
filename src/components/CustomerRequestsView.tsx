import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  CalendarClock, 
  FileText, 
  LayoutGrid, 
  Table as TableIcon,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CustomerRequest, RequestStatus, ServiceType } from '../types';
import { formatDateOnly, formatDateTime, getWhatsAppUrl } from '../utils/formatters';

interface CustomerRequestsViewProps {
  requests: CustomerRequest[];
  onOpenNewRequest: () => void;
  onSelectRequest: (request: CustomerRequest) => void;
  onCreateQuoteFromRequest: (request: CustomerRequest) => void;
  onCreateFollowupFromRequest: (request: CustomerRequest) => void;
  onUpdateStatus: (requestId: string, status: RequestStatus) => void;
}

export const CustomerRequestsView: React.FC<CustomerRequestsViewProps> = ({
  requests,
  onOpenNewRequest,
  onSelectRequest,
  onCreateQuoteFromRequest,
  onCreateFollowupFromRequest,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || r.serviceType === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const getStatusBadgeClass = (status: RequestStatus) => {
    switch (status) {
      case 'New':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Quoted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In Progress':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Closed (Won)':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Closed (Lost)':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div id="customer-requests-view-container" className="space-y-5 pb-12">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-stone-900">
              Customer Enquiries & Leads
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
              {filteredRequests.length} of {requests.length}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Capture, organize, analyze with Gemini AI, and convert SME client requests.
          </p>
        </div>

        <button
          id="requests-add-new-btn"
          onClick={onOpenNewRequest}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer Request</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="requests-search-input"
            placeholder="Search by client, company, ticket #, city or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/60"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <select
            id="requests-filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">🟡 New Leads</option>
            <option value="Under Review">🔵 Under Review</option>
            <option value="Quoted">🟣 Quoted</option>
            <option value="In Progress">🟢 In Progress</option>
            <option value="Closed (Won)">✅ Closed (Won)</option>
            <option value="Closed (Lost)">❌ Closed (Lost)</option>
          </select>

          {/* Service filter */}
          <select
            id="requests-filter-service"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer max-w-[180px] truncate"
          >
            <option value="ALL">All Service Types</option>
            <option value="Web & Software Development">Web & Software</option>
            <option value="Agro-processing & Farm Produce">Agro-processing</option>
            <option value="Logistics, Freight & Delivery">Logistics & Freight</option>
            <option value="Business Consulting & Accounting">Business Consulting</option>
            <option value="Construction, Hardware & Real Estate">Construction</option>
            <option value="Retail, Wholesale & Distribution">Retail & Wholesale</option>
            <option value="Digital Marketing & Branding">Marketing</option>
            <option value="Catering, Events & Hospitality">Catering & Events</option>
            <option value="Solar Energy & Electrical Systems">Solar Energy</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-stone-600">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Rendering */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-stone-900">No customer requests found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            {searchTerm || statusFilter !== 'ALL' || serviceFilter !== 'ALL'
              ? 'Try adjusting your search query or status filter.'
              : 'Start by capturing your first customer inquiry.'}
          </p>
          <button
            onClick={onOpenNewRequest}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer Request</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Organized Table View */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4">Ticket / Client</th>
                  <th className="py-3.5 px-4">Company & City</th>
                  <th className="py-3.5 px-4">Service Type</th>
                  <th className="py-3.5 px-4">Request Scope</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-800">
                {filteredRequests.map((req) => (
                  <tr 
                    key={req.id}
                    className="hover:bg-stone-50/70 transition-colors group cursor-pointer"
                    onClick={() => onSelectRequest(req)}
                  >
                    {/* Ticket & Customer Name */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {req.ticketNumber}
                        </span>
                        <div className="font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                          {req.customerName}
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {formatDateOnly(req.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Company & City */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="font-medium text-stone-800 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-stone-400" />
                          {req.companyName || '—'}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {req.city || 'Cameroon'}
                        </div>
                      </div>
                    </td>

                    {/* Service Type */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-700 block max-w-[140px] truncate">
                        {req.serviceType}
                      </span>
                    </td>

                    {/* Description preview */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-stone-600 text-xs">
                        {req.description}
                      </p>
                      {req.aiAnalysis && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                          <Sparkles className="w-3 h-3" />
                          AI Analyzed
                        </span>
                      )}
                    </td>

                    {/* Contact Method */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                        {req.preferredContact}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectRequest(req)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Open AI Assistant & Details"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>AI Assist</span>
                        </button>

                        {req.phone && (
                          <a
                            href={getWhatsAppUrl(req.phone, req.aiAnalysis?.suggestedResponse?.whatsapp)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                            title="Direct WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => onCreateQuoteFromRequest(req)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                          title="Create Quotation"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Organized Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelectRequest(req)}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 cursor-pointer group"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {req.ticketNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(req.status)}`}>
                    {req.status}
                  </span>
                </div>

                {/* Customer Details */}
                <h3 className="font-display font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {req.customerName}
                </h3>
                {req.companyName && (
                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-stone-400" />
                    {req.companyName}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {req.city || 'Cameroon'}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-800 font-medium truncate max-w-[150px]">
                    {req.serviceType}
                  </span>
                </div>

                {/* Description Box */}
                <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 leading-relaxed line-clamp-3">
                  {req.description}
                </div>

                {/* AI Summary preview if analyzed */}
                {req.aiAnalysis && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-950/5 border border-emerald-800/20 text-[11px] text-emerald-950">
                    <div className="flex items-center gap-1 font-bold text-emerald-800 mb-0.5">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      AI Recommendation:
                    </div>
                    <p className="line-clamp-2 text-stone-600">
                      {req.aiAnalysis.recommendedAction}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-[11px] text-stone-400">
                  {formatDateOnly(req.createdAt)}
                </span>

                <div className="flex items-center gap-1.5">
                  {req.phone && (
                    <a
                      href={getWhatsAppUrl(req.phone, req.aiAnalysis?.suggestedResponse?.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                      title="WhatsApp Client"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => onSelectRequest(req)}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>View AI</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
