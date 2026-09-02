import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Printer, 
  FileText, 
  Send, 
  Check, 
  Building2, 
  User, 
  DollarSign, 
  ShieldCheck, 
  Calendar, 
  MessageSquare,
  Copy
} from 'lucide-react';
import { Quotation, QuotationLineItem, AdditionalCostItem, CustomerRequest, BusinessSettings } from '../types';
import { formatFCFA, formatDateOnly, getWhatsAppUrl } from '../utils/formatters';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotationToEdit: Quotation | null;
  selectedRequest: CustomerRequest | null;
  requests: CustomerRequest[];
  businessSettings: BusinessSettings;
  onSaveQuotation: (quotationData: Omit<Quotation, 'id' | 'createdAt'>, existingId?: string) => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  quotationToEdit,
  selectedRequest,
  requests,
  businessSettings,
  onSaveQuotation,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Form State
  const [quotationNumber, setQuotationNumber] = useState('');
  const [customerRequestId, setCustomerRequestId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Douala');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  const [currency, setCurrency] = useState('FCFA');
  const [status, setStatus] = useState<Quotation['status']>('Draft');

  // Line items
  const [items, setItems] = useState<QuotationLineItem[]>([
    { id: '1', name: 'Service Package / Product Delivery', description: 'Standard professional scope', quantity: 1, unitPrice: 150000, total: 150000 },
  ]);

  // Discounts
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);

  // Additional costs
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCostItem[]>([
    { id: '1', label: 'Logistics & Secure Transport', amount: 15000 },
  ]);

  // Tax
  const [taxRate, setTaxRate] = useState<number>(19.25); // Standard Cameroon TVA

  // Payment terms & notes
  const [paymentTerms, setPaymentTerms] = useState(
    '50% advance deposit upon quotation signing via MTN Mobile Money, Orange Money, or Bank Wire; 50% balance upon final completion and handover.'
  );
  const [notes, setNotes] = useState(
    'Quotation valid for 15 days. Warranty of 12 months included with free onboarding.'
  );

  // Initialize or reset form
  useEffect(() => {
    if (quotationToEdit) {
      setQuotationNumber(quotationToEdit.quotationNumber);
      setCustomerRequestId(quotationToEdit.customerRequestId || '');
      setCustomerName(quotationToEdit.customerName);
      setCompanyName(quotationToEdit.companyName || '');
      setCustomerEmail(quotationToEdit.customerEmail || '');
      setCustomerPhone(quotationToEdit.customerPhone || '');
      setCustomerAddress(quotationToEdit.customerAddress || '');
      setCustomerCity(quotationToEdit.customerCity || 'Douala');
      setDate(quotationToEdit.date);
      setValidUntil(quotationToEdit.validUntil);
      setCurrency(quotationToEdit.currency || 'FCFA');
      setItems(quotationToEdit.items);
      setDiscountType(quotationToEdit.discountType);
      setDiscountValue(quotationToEdit.discountValue);
      setAdditionalCosts(quotationToEdit.additionalCosts);
      setTaxRate(quotationToEdit.taxRate);
      setPaymentTerms(quotationToEdit.paymentTerms);
      setNotes(quotationToEdit.notes);
      setStatus(quotationToEdit.status);
    } else if (selectedRequest) {
      // Pre-fill from selected request
      const now = new Date();
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 15);

      const generatedNum = `${businessSettings.quotationPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      setQuotationNumber(generatedNum);
      setCustomerRequestId(selectedRequest.id);
      setCustomerName(selectedRequest.customerName);
      setCompanyName(selectedRequest.companyName || '');
      setCustomerEmail(selectedRequest.email || '');
      setCustomerPhone(selectedRequest.phone || '');
      setCustomerAddress(selectedRequest.city ? `${selectedRequest.city}, Cameroon` : 'Douala, Cameroon');
      setCustomerCity(selectedRequest.city || 'Douala');
      setDate(now.toISOString().split('T')[0]);
      setValidUntil(validDate.toISOString().split('T')[0]);
      setCurrency('FCFA');
      setStatus('Draft');

      if (selectedRequest.aiAnalysis?.suggestedItems && selectedRequest.aiAnalysis.suggestedItems.length > 0) {
        setItems(
          selectedRequest.aiAnalysis.suggestedItems.map((item, idx) => ({
            id: `item-${idx + 1}`,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          }))
        );
      } else {
        setItems([
          {
            id: '1',
            name: `${selectedRequest.serviceType} Execution`,
            description: selectedRequest.description.slice(0, 100),
            quantity: 1,
            unitPrice: 250000,
            total: 250000,
          },
        ]);
      }
    } else {
      // Fresh new quotation
      const now = new Date();
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 15);

      const generatedNum = `${businessSettings.quotationPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      setQuotationNumber(generatedNum);
      setCustomerRequestId('');
      setCustomerName('');
      setCompanyName('');
      setCustomerEmail('');
      setCustomerPhone('+237 6');
      setCustomerAddress('Douala, Cameroon');
      setCustomerCity('Douala');
      setDate(now.toISOString().split('T')[0]);
      setValidUntil(validDate.toISOString().split('T')[0]);
      setCurrency('FCFA');
      setStatus('Draft');
      setItems([
        { id: '1', name: 'Commercial Service Item', description: 'Product or service deliverable', quantity: 1, unitPrice: 150000, total: 150000 },
      ]);
      setAdditionalCosts([
        { id: '1', label: 'Logistics / Delivery Support', amount: 15000 },
      ]);
    }
  }, [quotationToEdit, selectedRequest, isOpen]);

  if (!isOpen) return null;

  // Handle selecting an existing request from dropdown
  const handleSelectRequestDropdown = (reqId: string) => {
    setCustomerRequestId(reqId);
    const req = requests.find((r) => r.id === reqId);
    if (req) {
      setCustomerName(req.customerName);
      setCompanyName(req.companyName || '');
      setCustomerEmail(req.email || '');
      setCustomerPhone(req.phone || '');
      setCustomerCity(req.city || 'Douala');
      setCustomerAddress(req.city ? `${req.city}, Cameroon` : 'Douala, Cameroon');

      if (req.aiAnalysis?.suggestedItems && req.aiAnalysis.suggestedItems.length > 0) {
        setItems(
          req.aiAnalysis.suggestedItems.map((item, idx) => ({
            id: `item-${idx + 1}`,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          }))
        );
      }
    }
  };

  // Line item helpers
  const handleItemChange = (index: number, field: keyof QuotationLineItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : item.quantity;
      const p = field === 'unitPrice' ? Number(value) : item.unitPrice;
      item.total = (isNaN(q) ? 0 : q) * (isNaN(p) ? 0 : p);
    }
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        name: 'New Product / Deliverable',
        description: 'Item specifications',
        quantity: 1,
        unitPrice: 50000,
        total: 50000,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Additional costs helpers
  const handleAddCost = () => {
    setAdditionalCosts([
      ...additionalCosts,
      { id: `cost-${Date.now()}`, label: 'Packaging / Shipping', amount: 10000 },
    ]);
  };

  const handleCostChange = (index: number, field: keyof AdditionalCostItem, value: any) => {
    const updated = [...additionalCosts];
    updated[index] = { ...updated[index], [field]: field === 'amount' ? Number(value) || 0 : value };
    setAdditionalCosts(updated);
  };

  const handleRemoveCost = (index: number) => {
    setAdditionalCosts(additionalCosts.filter((_, idx) => idx !== index));
  };

  // Automatic calculations
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountAmount = discountType === 'percentage' 
    ? Math.round(subtotal * (discountValue / 100))
    : discountValue;
  const totalAdditionalCosts = additionalCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount + totalAdditionalCosts);
  const taxAmount = Math.round(taxableAmount * (taxRate / 100));
  const grandTotal = taxableAmount + taxAmount;

  const handleSave = (statusToSave?: Quotation['status']) => {
    if (!customerName.trim()) {
      alert('Please provide customer name.');
      return;
    }

    const finalStatus = statusToSave || status;

    onSaveQuotation(
      {
        quotationNumber: quotationNumber || `CB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customerRequestId: customerRequestId || undefined,
        customerName: customerName.trim(),
        companyName: companyName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        customerCity: customerCity.trim(),
        date,
        validUntil,
        currency,
        items,
        subtotal,
        discountType,
        discountValue,
        discountAmount,
        additionalCosts,
        totalAdditionalCosts,
        taxRate,
        taxAmount,
        grandTotal,
        paymentTerms,
        paymentMethods: {
          mtnMoMo: businessSettings.mtnMoMoNumber,
          orangeMoney: businessSettings.orangeMoneyNumber,
          bankAccount: businessSettings.bankDetails,
        },
        notes,
        status: finalStatus,
      },
      quotationToEdit?.id
    );
    onClose();
  };

  return (
    <div id="quotation-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-emerald-400 font-bold">{quotationNumber}</span>
                <span className="text-stone-400">•</span>
                <h3 className="font-display font-bold text-base text-white">
                  {quotationToEdit ? 'Edit Business Quotation' : 'New Commercial Quotation (FCFA)'}
                </h3>
              </div>
              <p className="text-xs text-stone-300">
                Cameroon SME Pro-forma Invoice & Quotation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch: Editor / Preview */}
            <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === 'editor' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Quote Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === 'preview' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Official Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 bg-stone-50/50">
          {activeTab === 'editor' ? (
            /* ================= QUOTATION EDITOR TAB ================= */
            <div className="p-6 space-y-6">
              
              {/* Row 1: Link request & basic info */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-700" />
                    Customer & Reference Information
                  </h4>
                  <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Currency: {currency}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Select existing customer request */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Link Customer Request (Optional)
                    </label>
                    <select
                      id="quote-link-request-select"
                      value={customerRequestId}
                      onChange={(e) => handleSelectRequestDropdown(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    >
                      <option value="">-- Custom Client Entry --</option>
                      {requests.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.ticketNumber} - {r.customerName} ({r.companyName || r.serviceType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Quotation Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="quote-number-input"
                      value={quotationNumber}
                      onChange={(e) => setQuotationNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Quotation Status
                    </label>
                    <select
                      id="quote-status-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Quotation['status'])}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent to Client</option>
                      <option value="Accepted">Accepted / Won</option>
                      <option value="Declined">Declined</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Customer Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="quote-customer-name"
                      required
                      placeholder="e.g. Jean-Paul Mbarga"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      id="quote-company-name"
                      placeholder="e.g. Sawa Agribusiness"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      id="quote-customer-phone"
                      placeholder="+237 6..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="quote-customer-email"
                      placeholder="client@domain.cm"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      City / Delivery Location
                    </label>
                    <input
                      type="text"
                      id="quote-customer-city"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Date of Issue
                    </label>
                    <input
                      type="date"
                      id="quote-date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Validity Date (Due Date)
                    </label>
                    <input
                      type="date"
                      id="quote-valid-until"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Product / Service Line Items (Dynamic table) */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Line Items & Deliverables (FCFA)
                    </h4>
                    <p className="text-[11px] text-stone-400">Products, hardware, or professional services to deliver</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-start"
                    >
                      <div className="sm:col-span-5 space-y-1">
                        <label className="block text-[11px] font-bold text-stone-600">
                          Product / Service #{index + 1}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Item Name / Title"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Description / Technical specs (optional)"
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-1 text-[11px] rounded-lg border border-stone-200 focus:ring-2 focus:ring-emerald-600 bg-white text-stone-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Unit Price (FCFA)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          required
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Line Total
                        </label>
                        <div className="px-3 py-1.5 text-xs font-mono font-bold text-stone-900 bg-white rounded-lg border border-stone-200 truncate">
                          {formatFCFA(item.total)}
                        </div>
                      </div>

                      <div className="sm:col-span-1 pt-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length <= 1}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Discounts, Additional Costs, & VAT calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Discounts & Additional Costs */}
                <div className="space-y-4">
                  {/* Discounts box */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                        Commercial Discount
                      </h5>
                      <div className="flex items-center gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setDiscountType('percentage')}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            discountType === 'percentage' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          % Percent
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiscountType('fixed')}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            discountType === 'fixed' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          FCFA Fixed
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                        placeholder={discountType === 'percentage' ? 'e.g. 5%' : 'e.g. 25000 FCFA'}
                        className="flex-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-stone-300 bg-stone-50"
                      />
                      <span className="text-xs font-mono font-semibold text-stone-600">
                        = -{formatFCFA(discountAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Additional Costs Box */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                        Additional Costs (Shipping, Setup, Logistics)
                      </h5>
                      <button
                        type="button"
                        onClick={handleAddCost}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Cost</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {additionalCosts.map((cost, idx) => (
                        <div key={cost.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Inter-city Freight"
                            value={cost.label}
                            onChange={(e) => handleCostChange(idx, 'label', e.target.value)}
                            className="flex-1 px-3 py-1 text-xs rounded-lg border border-stone-300 bg-stone-50"
                          />
                          <input
                            type="number"
                            min="0"
                            placeholder="Amount in FCFA"
                            value={cost.amount}
                            onChange={(e) => handleCostChange(idx, 'amount', e.target.value)}
                            className="w-28 px-3 py-1 text-xs font-mono font-bold rounded-lg border border-stone-300 bg-stone-50"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCost(idx)}
                            className="p-1 text-stone-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tax Rate Settings */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-stone-800">
                        Tax / VAT (TVA Cameroun)
                      </h5>
                      <p className="text-[11px] text-stone-500">Legal rate: 19.25% (or 0% if tax exempt)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTaxRate(19.25)}
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          taxRate === 19.25 ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        19.25%
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaxRate(0)}
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          taxRate === 0 ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        0% (Exempt)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Live Calculation Summary Box */}
                <div className="bg-gradient-to-br from-stone-900 to-[#10201a] text-white p-5 rounded-xl border border-emerald-900/60 shadow-md flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 pb-2 border-b border-stone-800">
                      Automatic Quotation Totals
                    </h4>

                    <div className="divide-y divide-stone-800 text-xs py-2 space-y-2">
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-stone-300">Subtotal ({items.length} items):</span>
                        <span className="font-mono font-semibold text-stone-100">{formatFCFA(subtotal)}</span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex items-center justify-between pt-2 text-emerald-400">
                          <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : 'Fixed'}):</span>
                          <span className="font-mono font-semibold">-{formatFCFA(discountAmount)}</span>
                        </div>
                      )}

                      {totalAdditionalCosts > 0 && (
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-stone-300">Additional Costs:</span>
                          <span className="font-mono font-semibold text-stone-100">+{formatFCFA(totalAdditionalCosts)}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-stone-300">VAT / TVA ({taxRate}%):</span>
                        <span className="font-mono font-semibold text-stone-100">+{formatFCFA(taxAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Grand Total Display */}
                  <div className="pt-3 border-t border-emerald-900/80">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Grand Total:
                      </span>
                      <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                        {formatFCFA(grandTotal)}
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-400 text-right mt-0.5">
                      Payable via MTN Mobile Money, Orange Money or Bank Transfer
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 4: Payment Terms & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Payment Terms & Mobile Money Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                  />
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Special Warranty & Quotation Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

            </div>
          ) : (
            /* ================= OFFICIAL PREVIEW TAB ================= */
            <div className="p-4 sm:p-8 bg-stone-100 flex justify-center">
              {/* The printable A4 invoice sheet */}
              <div 
                id="printable-quotation-sheet"
                className="bg-white text-stone-900 rounded-2xl shadow-xl border border-stone-200 max-w-3xl w-full p-6 sm:p-10 space-y-8"
              >
                {/* Header: SME Business Profile & Quotation Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-emerald-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center font-display text-base">
                        CB
                      </div>
                      <h2 className="text-xl font-bold font-display text-stone-950 tracking-tight">
                        {businessSettings.businessName}
                      </h2>
                    </div>
                    <p className="text-xs text-stone-600 font-medium max-w-sm">
                      {businessSettings.tagline}
                    </p>
                    <div className="text-xs text-stone-500 pt-1 space-y-0.5">
                      <p>{businessSettings.address}, {businessSettings.city}, {businessSettings.country}</p>
                      <p>Phone / WhatsApp: <span className="font-mono text-stone-800 font-medium">{businessSettings.phone}</span></p>
                      <p>Email: <span className="text-stone-800">{businessSettings.email}</span></p>
                      <p className="text-[11px] font-mono text-stone-500">
                        NIU: <span className="font-bold text-stone-700">{businessSettings.taxIdNIU}</span> | RCCM: <span className="font-bold text-stone-700">{businessSettings.rccmNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    <span className="inline-block px-3 py-1 rounded-lg bg-emerald-950 text-white font-display font-bold text-sm tracking-wide">
                      PRO-FORMA INVOICE / QUOTATION
                    </span>
                    <div className="pt-2 text-xs">
                      <div className="font-mono font-bold text-base text-emerald-900">
                        {quotationNumber}
                      </div>
                      <div className="text-stone-500">Date: <span className="text-stone-800 font-medium">{date}</span></div>
                      <div className="text-stone-500">Valid until: <span className="text-stone-800 font-medium">{validUntil}</span></div>
                    </div>
                  </div>
                </div>

                {/* Client Box & Location */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                      Quotation Prepared For:
                    </span>
                    <div className="font-bold text-stone-900 text-sm">{customerName || 'Valued Client'}</div>
                    {companyName && <div className="font-semibold text-stone-700">{companyName}</div>}
                    <div className="text-stone-600 mt-1">{customerAddress}</div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                      Contact & Destination:
                    </span>
                    <div className="text-stone-700">Phone: <span className="font-mono font-medium">{customerPhone || 'N/A'}</span></div>
                    <div className="text-stone-700">Email: <span>{customerEmail || 'N/A'}</span></div>
                    <div className="text-stone-700">Delivery Hub: <span className="font-semibold">{customerCity || 'Douala'}</span></div>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-900 text-white font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-3 rounded-l-lg">Item & Description</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price ({currency})</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg">Total ({currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {items.map((it, idx) => (
                        <tr key={it.id || idx} className="hover:bg-stone-50">
                          <td className="py-3 px-3">
                            <span className="font-bold text-stone-900 block">{it.name}</span>
                            {it.description && (
                              <span className="text-[11px] text-stone-500 block mt-0.5">{it.description}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-semibold">{it.quantity}</td>
                          <td className="py-3 px-3 text-right font-mono">{formatFCFA(it.unitPrice)}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-stone-900">{formatFCFA(it.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals & Calculations Breakdown */}
                <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
                  {/* Left: Payment Instructions */}
                  <div className="space-y-3 flex-1 text-xs">
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                      <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider">
                        Payment Methods (Cameroon)
                      </span>
                      <p className="text-stone-700 text-[11px]">
                        <strong>MTN Mobile Money:</strong> {businessSettings.mtnMoMoNumber}
                      </p>
                      <p className="text-stone-700 text-[11px]">
                        <strong>Orange Money:</strong> {businessSettings.orangeMoneyNumber}
                      </p>
                      <p className="text-stone-700 text-[11px]">
                        <strong>Bank Details:</strong> {businessSettings.bankDetails}
                      </p>
                    </div>

                    <div className="text-[11px] text-stone-600">
                      <strong>Payment Terms:</strong> {paymentTerms}
                    </div>
                  </div>

                  {/* Right: Calculations table */}
                  <div className="w-full sm:w-72 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal:</span>
                      <span className="font-mono font-semibold">{formatFCFA(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount:</span>
                        <span className="font-mono">-{formatFCFA(discountAmount)}</span>
                      </div>
                    )}

                    {totalAdditionalCosts > 0 && (
                      <div className="flex justify-between text-stone-600">
                        <span>Additional Logistics:</span>
                        <span className="font-mono font-semibold">+{formatFCFA(totalAdditionalCosts)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-stone-600">
                      <span>TVA / Tax ({taxRate}%):</span>
                      <span className="font-mono font-semibold">+{formatFCFA(taxAmount)}</span>
                    </div>

                    <div className="pt-2 border-t-2 border-stone-900 flex justify-between items-baseline font-bold text-sm text-stone-950">
                      <span>Grand Total ({currency}):</span>
                      <span className="text-base font-mono text-emerald-900">{formatFCFA(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Terms and Signature Block */}
                <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-500">
                  <div>
                    <span className="font-bold text-stone-800 block mb-1">Notes & Guarantee:</span>
                    <p className="text-[11px] leading-relaxed">{notes}</p>
                  </div>

                  <div className="sm:text-right flex flex-col justify-between h-20">
                    <span className="font-bold text-stone-800">Authorized Signature & Stamp:</span>
                    <div className="border-b border-stone-300 w-44 self-end mt-4"></div>
                    <span className="text-[10px] text-stone-400 mt-1">{businessSettings.businessName} Commercial Direction</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            {customerPhone && (
              <a
                href={getWhatsAppUrl(
                  customerPhone,
                  `Hello ${customerName.split(' ')[0]}, here is your official quotation ${quotationNumber} for ${formatFCFA(grandTotal)} from ${businessSettings.businessName}. Please let us know if you have any questions!`
                )}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('Sent')}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Mark Sent</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
