import { CustomerRequest, AIAnalysisResult, ServiceType, ContactMethod } from '../types';

export async function analyzeCustomerRequestAI(request: Partial<CustomerRequest>): Promise<AIAnalysisResult> {
  try {
    const response = await fetch('/api/ai/analyze-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend AI analysis endpoint unavailable, using fallback:', err);
  }

  // Graceful client fallback
  const customerName = request.customerName || 'Customer';
  const companyName = request.companyName ? ` (${request.companyName})` : '';
  const serviceType = request.serviceType || 'Business Services';
  const description = request.description || '';
  const firstName = customerName.split(' ')[0];

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);

  return {
    summary: `${customerName}${companyName} is requesting assistance with ${serviceType}. Key objective: "${description.slice(0, 120)}${description.length > 120 ? '...' : ''}".`,
    suggestedResponse: {
      whatsapp: `Hello ${firstName}, thank you for contacting us regarding ${serviceType}! We have noted your request and would be glad to support you. We are preparing a customized quotation in FCFA for you right away. Could you please confirm if you have a specific deadline?`,
      email: `Subject: Quotation & Proposal for ${serviceType} - CamBiz AI\n\nDear ${customerName},\n\nThank you for reaching out to us. We have received your detailed request:\n\n"${description}"\n\nOur team is finalizing an itemized proposal with clear delivery terms and mobile money/bank payment options.\n\nBest regards,\nCustomer Relations Team`,
      phoneScript: `1. Introduce CamBiz and thank client for enquiry.\n2. Confirm specific requirements: "${description.slice(0, 50)}...".\n3. Outline quotation scope and payment terms (50% deposit).\n4. Confirm preferred delivery channel.`
    },
    recommendedAction: `Prepare and issue an official quotation in FCFA within 24 hours. Send link via ${request.preferredContact || 'WhatsApp'}.`,
    suggestedFollowUp: {
      timingText: 'In 2 business days',
      daysDelay: 2,
      reason: 'Standard commercial follow-up window for Cameroonian enterprise leads.',
      suggestedDate: targetDate.toISOString().split('T')[0]
    },
    suggestedItems: [
      { name: `${serviceType} - Standard Scope`, description: 'Execution as per client specifications', quantity: 1, unitPrice: 150000 },
      { name: 'Onboarding & Delivery Support', description: 'Handover, setup and verification', quantity: 1, unitPrice: 35000 }
    ],
    analyzedAt: new Date().toISOString()
  };
}

export const analyzeCustomerRequest = analyzeCustomerRequestAI;

export async function generateQuotationDraftAI(serviceType: ServiceType, description: string, customerName: string) {
  try {
    const res = await fetch('/api/ai/generate-quotation-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceType, description, customerName }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('AI quotation draft error:', err);
  }

  return {
    items: [
      { name: `${serviceType} - Core Package`, description: 'Primary service delivery', quantity: 1, unitPrice: 180000 },
      { name: 'Implementation & Quality Verification', description: 'Setup, testing and handover', quantity: 1, unitPrice: 45000 }
    ],
    suggestedAdditionalCosts: [
      { label: 'Transport / Express Delivery', amount: 15000 }
    ],
    paymentTerms: '50% advance via MTN MoMo / Orange Money, 50% balance upon final completion & delivery.'
  };
}

export async function generateFollowupMessageAI(params: {
  customerName: string;
  companyName?: string;
  action: string;
  channel: string;
  quoteNumber?: string;
}) {
  try {
    const res = await fetch('/api/ai/generate-followup-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      return data.message;
    }
  } catch (err) {
    console.warn('AI followup message error:', err);
  }

  const firstName = params.customerName.split(' ')[0];
  return `Hello ${firstName}, hope you are doing well! Following up on ${params.action}${params.quoteNumber ? ` regarding Quotation ${params.quoteNumber}` : ''}. Please let us know if you need any adjustments or if we can proceed with your order.`;
}

export async function generateAiFollowUp(params: {
  customerName: string;
  companyName?: string;
  serviceOrProduct?: string;
  channel?: ContactMethod;
  reason?: string;
}) {
  return generateFollowupMessageAI({
    customerName: params.customerName,
    companyName: params.companyName,
    action: params.reason || params.serviceOrProduct || 'proposal',
    channel: params.channel || 'WhatsApp',
  });
}

/**
 * Retrieves customer requests collected by the backend (e.g. from Google Forms webhook)
 */
export async function fetchServerRequests(): Promise<CustomerRequest[]> {
  try {
    const res = await fetch('/api/requests');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.requests)) {
        return data.requests;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch requests from server:', err);
  }
  return [];
}

