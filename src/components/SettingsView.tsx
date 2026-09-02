import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Globe, 
  Save, 
  Check, 
  Webhook, 
  Mail, 
  Workflow, 
  CheckCircle2, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { BusinessSettings } from '../types';

interface SettingsViewProps {
  settings: BusinessSettings;
  onSaveSettings: (updatedSettings: BusinessSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<BusinessSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof BusinessSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIntegrationToggle = (field: keyof BusinessSettings['integrations'], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-view-container" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-display text-stone-900">
            Business Profile & Automation Settings
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your legal SME information, official Cameroonian tax credentials, Mobile Money receivers, and workflow webhooks.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Legal Business Identity & Cameroon Tax Info */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <h3 className="font-display font-bold text-base text-stone-900">
              Legal Business Information & Registration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Business Legal Entity Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Business Tagline / Service Domain
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Tax Identification Number (NIU Cameroun)
              </label>
              <input
                type="text"
                placeholder="e.g. M052300012345Z"
                value={formData.taxIdNIU}
                onChange={(e) => handleChange('taxIdNIU', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-600"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">Printed on all official pro-forma invoices & receipts</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Commercial Registry Number (RCCM)
              </label>
              <input
                type="text"
                placeholder="e.g. RC/DLA/2023/B/1420"
                value={formData.rccmNumber}
                onChange={(e) => handleChange('rccmNumber', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-600"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">Official Greffe du Tribunal commercial register</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Quotation Number Prefix
              </label>
              <input
                type="text"
                value={formData.quotationPrefix}
                onChange={(e) => handleChange('quotationPrefix', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono font-bold rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Mobile Money & Banking for Quotations */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Smartphone className="w-5 h-5 text-emerald-800" />
            <h3 className="font-display font-bold text-base text-stone-900">
              Cameroon Payment Collection Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
              <label className="block text-xs font-bold text-amber-950 mb-1">
                MTN Mobile Money Merchant / Number
              </label>
              <input
                type="text"
                value={formData.mtnMoMoNumber}
                onChange={(e) => handleChange('mtnMoMoNumber', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-xl border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-amber-800 mt-1 block">Displayed on customer quotations for instant MoMo deposits</span>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200">
              <label className="block text-xs font-bold text-orange-950 mb-1">
                Orange Money Merchant / Number
              </label>
              <input
                type="text"
                value={formData.orangeMoneyNumber}
                onChange={(e) => handleChange('orangeMoneyNumber', e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-xl border border-orange-300 bg-white focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-[11px] text-orange-800 mt-1 block">Orange Money code or business number</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Bank Account Details (Afriland, UBA, BICEC, SCB, Ecobank)
            </label>
            <input
              type="text"
              value={formData.bankDetails}
              onChange={(e) => handleChange('bankDetails', e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Section 3: End-to-End Automation & Webhook Connectors */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-emerald-800" />
              <div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  Automation Connectors & Webhooks
                </h3>
                <p className="text-xs text-stone-500">
                  Ready to link with Google Forms, Make.com, Zapier, Gmail, GitHub & Vercel
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active Workflow Hub
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google Forms */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-stone-900 block">Google Forms Ingestion</span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Receive prospective customer entries directly from your public Google Form link.
                </p>
                <div className="mt-2 font-mono text-[10px] text-stone-400 bg-white p-1.5 rounded border border-stone-200 truncate">
                  Endpoint: /api/webhooks/google-forms
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.integrations.googleFormsSync}
                onChange={(e) => handleIntegrationToggle('googleFormsSync', e.target.checked)}
                className="w-5 h-5 text-emerald-700 rounded accent-emerald-700 cursor-pointer mt-1"
              />
            </div>

            {/* Make / Zapier */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-stone-900 block">Make.com / Zapier Webhook Sync</span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Trigger automated CRM updates, WhatsApp broadcasts, and notifications.
                </p>
                <div className="mt-2 font-mono text-[10px] text-stone-400 bg-white p-1.5 rounded border border-stone-200 truncate">
                  Endpoint: /api/webhooks/make-zapier
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.integrations.makeZapierWebhook}
                onChange={(e) => handleIntegrationToggle('makeZapierWebhook', e.target.checked)}
                className="w-5 h-5 text-emerald-700 rounded accent-emerald-700 cursor-pointer mt-1"
              />
            </div>

            {/* Gmail Notifications */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-stone-900 block">Gmail Deal Alerts</span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Send real-time alerts to {formData.email} when high-priority leads arrive.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.integrations.gmailAlerts}
                onChange={(e) => handleIntegrationToggle('gmailAlerts', e.target.checked)}
                className="w-5 h-5 text-emerald-700 rounded accent-emerald-700 cursor-pointer mt-1"
              />
            </div>

            {/* WhatsApp Web Direct Bridge */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-stone-900 block">WhatsApp SME Direct Bridge</span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  1-click dispatch of quotes and AI follow-ups to Cameroon telephone numbers (+237).
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.integrations.whatsappIntegration}
                onChange={(e) => handleIntegrationToggle('whatsappIntegration', e.target.checked)}
                className="w-5 h-5 text-emerald-700 rounded accent-emerald-700 cursor-pointer mt-1"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            id="save-settings-submit-btn"
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Business Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
