import React, { useState } from 'react';
import { X, Sparkles, UserPlus, Send, Phone, Mail, Building2, MapPin, Tag, CheckCircle2 } from 'lucide-react';
import { CustomerRequest, ContactMethod, ServiceType, PriorityLevel } from '../types';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: Omit<CustomerRequest, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'aiAnalysis'>) => Promise<void>;
}

const SERVICE_TYPES: ServiceType[] = [
  'Web & Software Development',
  'Agro-processing & Farm Produce',
  'Logistics, Freight & Delivery',
  'Business Consulting & Accounting',
  'Construction, Hardware & Real Estate',
  'Retail, Wholesale & Distribution',
  'Digital Marketing & Branding',
  'Import & Export Clearance',
  'Catering, Events & Hospitality',
  'Solar Energy & Electrical Systems',
  'Other Services',
];

const CAMEROON_CITIES = [
  'Douala',
  'Yaoundé',
  'Bamenda',
  'Bafoussam',
  'Garoua',
  'Limbe',
  'Kribi',
  'Buea',
  'Maroua',
  'Ngaoundéré',
  'Ebolowa',
  'Bertoua',
  'Other / Regional'
];

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('+237 6');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Douala');
  const [serviceType, setServiceType] = useState<ServiceType>('Web & Software Development');
  const [description, setDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState<ContactMethod>('WhatsApp');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoRunAi, setAutoRunAi] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !description.trim()) {
      alert('Please fill in Customer Name and Description of Request.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        customerName: customerName.trim(),
        companyName: companyName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city,
        serviceType,
        description: description.trim(),
        preferredContact,
        status: 'New',
        priority,
        budgetEstimate: budgetEstimate.trim() || undefined,
      });
      // Reset form
      setCustomerName('');
      setCompanyName('');
      setPhone('+237 6');
      setEmail('');
      setDescription('');
      setBudgetEstimate('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="new-request-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Log New Customer Request
              </h3>
              <p className="text-xs text-stone-400">
                Record new prospect enquiry with instant AI business assistant review
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
          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Customer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="form-customer-name"
                required
                placeholder="e.g. Paul Biya or Marie Ngono"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Company / Organization Name
              </label>
              <input
                type="text"
                id="form-company-name"
                placeholder="e.g. Douala Cold Chain SARL"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              />
            </div>
          </div>

          {/* Row 2: Phone, Email & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Phone / WhatsApp (Cameroon)
              </label>
              <input
                type="text"
                id="form-customer-phone"
                placeholder="+237 670 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="form-customer-email"
                placeholder="client@company.cm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                City / Location
              </label>
              <select
                id="form-customer-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              >
                {CAMEROON_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Service Type & Preferred Contact Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Service Type / Industry
              </label>
              <select
                id="form-service-type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              >
                {SERVICE_TYPES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Preferred Contact Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['WhatsApp', 'Phone Call', 'Email', 'In-Person Meeting'] as ContactMethod[]).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPreferredContact(method)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      preferredContact === method
                        ? 'bg-emerald-800 text-white border-emerald-900 font-bold'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Description of Request */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                Description of Request <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-stone-600">Provide details for accurate AI analysis</span>
            </div>
            <textarea
              id="form-request-description"
              required
              rows={4}
              placeholder="e.g. Client needs 250 units of customized packaging delivered to Yaoundé by next Friday with sample testing on Monday morning..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50 leading-relaxed"
            />
          </div>

          {/* Row 5: Priority & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Lead Priority
              </label>
              <div className="flex items-center gap-2">
                {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setPriority(lvl)}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-semibold border transition-all cursor-pointer ${
                      priority === lvl
                        ? lvl === 'High' ? 'bg-red-800 text-white border-red-900' :
                          lvl === 'Medium' ? 'bg-amber-800 text-white border-amber-900' :
                          'bg-stone-800 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Estimated Budget (Optional)
              </label>
              <input
                type="text"
                id="form-budget-estimate"
                placeholder="e.g. 500,000 FCFA"
                value={budgetEstimate}
                onChange={(e) => setBudgetEstimate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-stone-50/50"
              />
            </div>
          </div>

          {/* AI Auto-run option */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-800" />
              <div>
                <span className="text-xs font-bold text-emerald-950">Auto-Run CamBiz AI Analysis</span>
                <p className="text-[11px] text-emerald-900">Generate executive summary, bilingual response drafts & follow-up date immediately.</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="form-auto-ai-checkbox"
              checked={autoRunAi}
              onChange={(e) => setAutoRunAi(e.target.checked)}
              className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-600 cursor-pointer accent-emerald-800"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="form-submit-request-btn"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Save & Analyze Request</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
