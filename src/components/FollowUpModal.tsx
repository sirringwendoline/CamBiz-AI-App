import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CalendarClock, 
  MessageSquare, 
  Phone, 
  Mail, 
  Check, 
  Clock, 
  User, 
  Building2,
  Calendar
} from 'lucide-react';
import { FollowUpItem, CustomerRequest, Quotation, ContactMethod, FollowUpStatus } from '../types';
import { generateAiFollowUp } from '../services/api';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  followUpToEdit: FollowUpItem | null;
  requests: CustomerRequest[];
  quotations: Quotation[];
  onSaveFollowUp: (followUpData: Omit<FollowUpItem, 'id' | 'createdAt'>, existingId?: string) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  followUpToEdit,
  requests,
  quotations,
  onSaveFollowUp,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [relatedRequestId, setRelatedRequestId] = useState('');
  const [relatedQuotationId, setRelatedQuotationId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [channel, setChannel] = useState<ContactMethod>('WhatsApp');
  const [status, setStatus] = useState<FollowUpStatus>('Pending');
  const [reason, setReason] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [notes, setNotes] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    if (followUpToEdit) {
      setCustomerName(followUpToEdit.customerName);
      setCompanyName(followUpToEdit.companyName || '');
      setCustomerPhone(followUpToEdit.customerPhone || '');
      setCustomerEmail(followUpToEdit.customerEmail || '');
      setRelatedRequestId(followUpToEdit.customerRequestId || '');
      setRelatedQuotationId(followUpToEdit.quotationId || '');
      setScheduledDate(followUpToEdit.scheduledDate);
      setChannel(followUpToEdit.channel);
      setStatus(followUpToEdit.status);
      setReason(followUpToEdit.reason);
      setGeneratedDraft(followUpToEdit.generatedDraft || '');
      setNotes(followUpToEdit.notes || '');
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
      setCustomerName('');
      setCompanyName('');
      setCustomerPhone('+237 6');
      setCustomerEmail('');
      setRelatedRequestId('');
      setRelatedQuotationId('');
      setChannel('WhatsApp');
      setStatus('Pending');
      setReason('Check client feedback on quotation and offer clarification on delivery schedule');
      setGeneratedDraft('');
      setNotes('');
    }
  }, [followUpToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSelectRequest = (reqId: string) => {
    setRelatedRequestId(reqId);
    const req = requests.find((r) => r.id === reqId);
    if (req) {
      setCustomerName(req.customerName);
      setCompanyName(req.companyName || '');
      setCustomerPhone(req.phone || '');
      setCustomerEmail(req.email || '');
      setChannel(req.preferredContact);
      if (req.aiAnalysis?.suggestedFollowUp?.reason) {
        setReason(req.aiAnalysis.suggestedFollowUp.reason);
      }
    }
  };

  const handleSelectQuote = (qId: string) => {
    setRelatedQuotationId(qId);
    const q = quotations.find((quote) => quote.id === qId);
    if (q) {
      setCustomerName(q.customerName);
      setCompanyName(q.companyName || '');
      setCustomerPhone(q.customerPhone || '');
      setCustomerEmail(q.customerEmail || '');
      setReason(`Follow up on Quote #${q.quotationNumber} (Amount: ${q.grandTotal.toLocaleString()} FCFA)`);
    }
  };

  const handleGenerateAiDraft = async () => {
    if (!customerName.trim()) {
      alert('Please provide Customer Name first.');
      return;
    }
    setIsGeneratingAi(true);
    try {
      const draft = await generateAiFollowUp({
        customerName,
        companyName,
        serviceOrProduct: reason || 'Business Proposal',
        channel,
        reason,
      });
      setGeneratedDraft(draft);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !scheduledDate.trim()) {
      alert('Please provide Customer Name and Scheduled Date.');
      return;
    }

    onSaveFollowUp(
      {
        customerName: customerName.trim(),
        companyName: companyName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerRequestId: relatedRequestId || undefined,
        quotationId: relatedQuotationId || undefined,
        scheduledDate,
        channel,
        status,
        reason: reason.trim(),
        generatedDraft: generatedDraft.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      followUpToEdit?.id
    );
    onClose();
  };

  return (
    <div id="followup-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                {followUpToEdit ? 'Edit Scheduled Follow-up' : 'Schedule Customer Follow-up'}
              </h3>
              <p className="text-xs text-stone-400">
                Automate deal follow-ups & keep Cameroonian SME leads warm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Link to existing request or quote */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Link to Customer Request (Optional)
              </label>
              <select
                value={relatedRequestId}
                onChange={(e) => handleSelectRequest(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              >
                <option value="">-- No linked request --</option>
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.ticketNumber} - {r.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Link to Quotation (Optional)
              </label>
              <select
                value={relatedQuotationId}
                onChange={(e) => handleSelectQuote(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              >
                <option value="">-- No linked quote --</option>
                {quotations.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quotationNumber} - {q.customerName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Profile Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>
          </div>

          {/* Phone & Schedule Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                WhatsApp / Phone
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Follow-up Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as ContactMethod)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 bg-stone-50"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email</option>
                <option value="In-Person Meeting">In-Person Meeting</option>
              </select>
            </div>
          </div>

          {/* Reason & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Follow-up Purpose / Reason <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Check if client received proforma quotation"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FollowUpStatus)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 bg-stone-50"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* AI Generated Message Draft */}
          <div className="bg-stone-900 text-white p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Crafted Follow-Up Message (WhatsApp/Email)
              </span>
              <button
                type="button"
                onClick={handleGenerateAiDraft}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAi ? 'Generating...' : 'Generate with AI'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Click 'Generate with AI' above to draft a high-converting Cameroonian business follow-up message..."
              value={generatedDraft}
              onChange={(e) => setGeneratedDraft(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg bg-stone-950 border border-stone-800 text-stone-200 font-mono focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Follow-up</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
