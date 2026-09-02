export type ServiceType =
  | 'Web & Software Development'
  | 'Agro-processing & Farm Produce'
  | 'Logistics, Freight & Delivery'
  | 'Business Consulting & Accounting'
  | 'Construction, Hardware & Real Estate'
  | 'Retail, Wholesale & Distribution'
  | 'Digital Marketing & Branding'
  | 'Import & Export Clearance'
  | 'Catering, Events & Hospitality'
  | 'Solar Energy & Electrical Systems'
  | 'Other Services';

export type ContactMethod = 'WhatsApp' | 'Phone Call' | 'Email' | 'In-Person Meeting';

export type RequestStatus = 'New' | 'Under Review' | 'Quoted' | 'In Progress' | 'Closed (Won)' | 'Closed (Lost)';
export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface AIAnalysisResult {
  summary: string;
  suggestedResponse: {
    whatsapp: string;
    email: string;
    phoneScript: string;
  };
  recommendedAction: string;
  suggestedFollowUp: {
    timingText: string;
    daysDelay: number;
    reason: string;
    suggestedDate: string;
  };
  suggestedItems?: Array<{
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  confidence?: 'High' | 'Medium';
  analyzedAt: string;
}

export interface CustomerRequest {
  id: string;
  ticketNumber: string;
  customerName: string;
  companyName: string;
  phone: string;
  email: string;
  city: string;
  serviceType: ServiceType;
  description: string;
  preferredContact: ContactMethod;
  status: RequestStatus;
  priority: PriorityLevel;
  budgetEstimate?: string;
  createdAt: string;
  updatedAt: string;
  aiAnalysis?: AIAnalysisResult;
  isAiAnalyzing?: boolean;
}

export interface QuotationLineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface AdditionalCostItem {
  id: string;
  label: string;
  amount: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Expired';

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerRequestId?: string;
  customerName: string;
  companyName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  customerCity?: string;
  date: string;
  validUntil: string;
  currency: string;
  items: QuotationLineItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  additionalCosts: AdditionalCostItem[];
  totalAdditionalCosts: number;
  taxRate: number; // e.g. 19.25 for Cameroon TVA or 0
  taxAmount: number;
  grandTotal: number;
  paymentTerms: string;
  paymentMethods: {
    mtnMoMo?: string;
    orangeMoney?: string;
    bankAccount?: string;
  };
  notes: string;
  status: QuotationStatus;
  createdAt: string;
}

export type FollowUpStatus = 'Pending' | 'Completed' | 'Overdue' | 'Rescheduled' | 'Cancelled';

export interface FollowUpItem {
  id: string;
  customerRequestId?: string;
  quotationId?: string;
  customerName: string;
  companyName?: string;
  customerPhone?: string;
  phone?: string;
  customerEmail?: string;
  email?: string;
  scheduledDate: string; // YYYY-MM-DD
  dueDate?: string;
  dueTime?: string;
  channel: ContactMethod;
  status: FollowUpStatus;
  reason: string;
  action?: string;
  generatedDraft?: string;
  notes?: string;
  completedAt?: string;
  priority?: PriorityLevel;
  createdAt: string;
}

export type FollowUp = FollowUpItem;

export interface ActivityLogItem {
  id: string;
  type: 
    | 'request_created' 
    | 'ai_analyzed' 
    | 'quotation_generated' 
    | 'quotation_sent' 
    | 'quotation_accepted' 
    | 'followup_scheduled' 
    | 'followup_completed' 
    | 'status_changed'
    | 'request'
    | 'ai'
    | 'quotation'
    | 'followup'
    | 'system';
  title: string;
  description: string;
  timestamp: string;
  entityId?: string;
  entityType?: 'request' | 'quotation' | 'followup';
  badge?: string;
}

export type ActivityLog = ActivityLogItem;

export interface IntegrationSettings {
  googleForms: {
    enabled: boolean;
    webhookUrl: string;
    formEmbedUrl?: string;
    autoImport: boolean;
  };
  makeZapier: {
    enabled: boolean;
    webhookUrl: string;
    apiKey: string;
    syncQuotations: boolean;
    syncFollowups: boolean;
  };
  gmailNotifications: {
    enabled: boolean;
    alertEmail: string;
    autoSendQuote: boolean;
  };
  webhooks: {
    incomingUrl: string;
    secretKey: string;
    lastTriggered?: string;
  };
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  taxIdNIU: string;
  rccmNumber: string;
  defaultCurrency: string; // 'FCFA'
  defaultTaxRate: number; // 19.25
  mtnMoMoNumber: string;
  orangeMoneyNumber: string;
  bankDetails: string;
  quotationPrefix: string;
  termsAndConditions: string;
  integrations: {
    googleFormsSync: boolean;
    makeZapierWebhook: boolean;
    gmailAlerts: boolean;
    whatsappIntegration: boolean;
  };
}
