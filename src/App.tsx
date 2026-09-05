import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CustomerRequestsView } from './components/CustomerRequestsView';
import { RequestDetailModal } from './components/RequestDetailModal';
import { NewRequestModal } from './components/NewRequestModal';
import { QuotationsView } from './components/QuotationsView';
import { QuotationModal } from './components/QuotationModal';
import { FollowUpsView } from './components/FollowUpsView';
import { FollowUpModal } from './components/FollowUpModal';
import { SettingsView } from './components/SettingsView';
import { ActivityHistoryView } from './components/ActivityHistoryView';

import { 
  CustomerRequest, 
  Quotation, 
  FollowUpItem, 
  ActivityLogItem, 
  BusinessSettings, 
  RequestStatus, 
  QuotationStatus, 
  FollowUpStatus 
} from './types';

import { 
  initialCustomerRequests, 
  initialQuotations, 
  initialFollowUps, 
  initialActivityLogs, 
  initialBusinessSettings 
} from './data/mockData';

import { analyzeCustomerRequest, fetchServerRequests } from './services/api';
import { formatFCFA } from './utils/formatters';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'requests' | 'quotations' | 'followups' | 'settings' | 'history'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Persistence / Business Data State
  const [requests, setRequests] = useState<CustomerRequest[]>(() => {
    try {
      const saved = localStorage.getItem('cambiz_requests');
      return saved ? JSON.parse(saved) : initialCustomerRequests;
    } catch {
      return initialCustomerRequests;
    }
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem('cambiz_quotations');
      return saved ? JSON.parse(saved) : initialQuotations;
    } catch {
      return initialQuotations;
    }
  });

  const [followUps, setFollowUps] = useState<FollowUpItem[]>(() => {
    try {
      const saved = localStorage.getItem('cambiz_followups');
      return saved ? JSON.parse(saved) : initialFollowUps;
    } catch {
      return initialFollowUps;
    }
  });

  const [activities, setActivities] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('cambiz_activities');
      return saved ? JSON.parse(saved) : initialActivityLogs;
    } catch {
      return initialActivityLogs;
    }
  });

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem('cambiz_settings');
      return saved ? JSON.parse(saved) : initialBusinessSettings;
    } catch {
      return initialBusinessSettings;
    }
  });

  // Modal States
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<CustomerRequest | null>(null);

  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [quotationToEdit, setQuotationToEdit] = useState<Quotation | null>(null);
  const [requestForNewQuotation, setRequestForNewQuotation] = useState<CustomerRequest | null>(null);

  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpToEdit, setFollowUpToEdit] = useState<FollowUpItem | null>(null);

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto save to localStorage
  useEffect(() => {
    localStorage.setItem('cambiz_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('cambiz_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('cambiz_followups', JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem('cambiz_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('cambiz_settings', JSON.stringify(businessSettings));
  }, [businessSettings]);

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper Activity Log adder
  const logActivity = (type: ActivityLogItem['type'], title: string, description: string) => {
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      description,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  // Fetch requests from backend (Google Forms / Google Apps Script bridge) and merge without duplicates
  const syncServerRequests = useCallback(async () => {
    try {
      const serverRequests = await fetchServerRequests();
      if (!serverRequests || !Array.isArray(serverRequests) || serverRequests.length === 0) {
        return;
      }

      setRequests((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const existingTicketNumbers = new Set(prev.map((r) => r.ticketNumber));

        const newItems = serverRequests.filter(
          (sr) => !existingIds.has(sr.id) && !existingTicketNumbers.has(sr.ticketNumber)
        );

        if (newItems.length === 0) {
          return prev;
        }

        newItems.forEach((item) => {
          logActivity(
            'request_created',
            `Google Form Submission: ${item.customerName}`,
            `${item.serviceType || 'Service'} (${item.city || 'Cameroon'}) - ${item.ticketNumber}`
          );
        });

        showToast(`${newItems.length} new customer enquiry${newItems.length > 1 ? 's' : ''} received from Google Forms.`);
        return [...newItems, ...prev];
      });
    } catch (err) {
      console.warn('Error syncing requests from server:', err);
    }
  }, []);

  // Poll backend for new incoming Google Form submissions
  useEffect(() => {
    syncServerRequests();
    const interval = setInterval(syncServerRequests, 15000);
    return () => clearInterval(interval);
  }, [syncServerRequests]);

  // Calculations for Badges
  const pendingRequestsCount = requests.filter((r) => r.status === 'New' || r.status === 'Under Review').length;
  const followUpsDueCount = followUps.filter((f) => f.status === 'Pending').length;

  // --- Handlers: Customer Requests ---
  const handleCreateNewRequest = async (
    requestData: Omit<CustomerRequest, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'aiAnalysis'>
  ) => {
    const newId = `req-${Date.now()}`;
    const ticketNumber = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    let aiResult = undefined;
    try {
      setIsAiAnalyzing(true);
      aiResult = await analyzeCustomerRequest({
        ...requestData,
        id: newId,
        ticketNumber,
      });
    } catch (err) {
      console.warn('AI analysis skipped or failed:', err);
    } finally {
      setIsAiAnalyzing(false);
    }

    const newRequest: CustomerRequest = {
      ...requestData,
      id: newId,
      ticketNumber,
      createdAt: now,
      updatedAt: now,
      aiAnalysis: aiResult,
    };

    setRequests((prev) => [newRequest, ...prev]);
    logActivity('request_created', `New Request: ${newRequest.customerName}`, `${newRequest.serviceType} (${newRequest.city}) - ${newRequest.ticketNumber}`);
    
    if (aiResult) {
      logActivity('ai_analyzed', `AI Analyzed: ${newRequest.ticketNumber}`, `Generated bilingual responses and next steps for ${newRequest.customerName}`);
    }

    showToast(`Request ${ticketNumber} logged and analyzed successfully.`);
  };

  const handleUpdateStatus = (requestId: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          logActivity('status_changed', `Status Updated: ${r.ticketNumber}`, `Changed status to "${status}" for ${r.customerName}`);
          return { ...r, status, updatedAt: new Date().toISOString() };
        }
        return r;
      })
    );

    // Also update modal state if open
    if (selectedRequestForDetail && selectedRequestForDetail.id === requestId) {
      setSelectedRequestForDetail((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Status updated to "${status}".`);
  };

  const handleTriggerAiAnalysis = async (requestId: string) => {
    const target = requests.find((r) => r.id === requestId);
    if (!target) return;

    setIsAiAnalyzing(true);
    try {
      const aiResult = await analyzeCustomerRequest(target);
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId) {
            return { ...r, aiAnalysis: aiResult, updatedAt: new Date().toISOString() };
          }
          return r;
        })
      );
      if (selectedRequestForDetail && selectedRequestForDetail.id === requestId) {
        setSelectedRequestForDetail((prev) => (prev ? { ...prev, aiAnalysis: aiResult } : null));
      }
      logActivity('ai_analyzed', `AI Re-analyzed: ${target.ticketNumber}`, `Refreshed analysis for ${target.customerName}`);
      showToast('AI analysis completed successfully.');
    } catch (err) {
      console.error(err);
      showToast('Error during AI analysis.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // --- Handlers: Quotations ---
  const handleSaveQuotation = (quotationData: Omit<Quotation, 'id' | 'createdAt'>, existingId?: string) => {
    const now = new Date().toISOString();
    if (existingId) {
      setQuotations((prev) =>
        prev.map((q) => {
          if (q.id === existingId) {
            return { ...quotationData, id: existingId, createdAt: q.createdAt };
          }
          return q;
        })
      );
      logActivity('quotation_generated', `Quotation Updated: ${quotationData.quotationNumber}`, `Total: ${formatFCFA(quotationData.grandTotal)} for ${quotationData.customerName}`);
      showToast(`Quotation ${quotationData.quotationNumber} updated.`);
    } else {
      const newQuote: Quotation = {
        ...quotationData,
        id: `quote-${Date.now()}`,
        createdAt: now,
      };
      setQuotations((prev) => [newQuote, ...prev]);

      // If tied to a request, mark request as Quoted
      if (quotationData.customerRequestId) {
        handleUpdateStatus(quotationData.customerRequestId, 'Quoted');
      }

      logActivity('quotation_generated', `Quotation Created: ${newQuote.quotationNumber}`, `Total: ${formatFCFA(newQuote.grandTotal)} for ${newQuote.customerName}`);
      showToast(`Quotation ${newQuote.quotationNumber} created successfully.`);
    }
  };

  const handleUpdateQuoteStatus = (quoteId: string, status: QuotationStatus) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          if (status === 'Accepted') {
            logActivity('quotation_accepted', `Quotation Won! ${q.quotationNumber}`, `Client ${q.customerName} accepted deal of ${formatFCFA(q.grandTotal)}`);
          } else if (status === 'Sent') {
            logActivity('quotation_sent', `Quotation Sent: ${q.quotationNumber}`, `Sent to ${q.customerName}`);
          }
          return { ...q, status };
        }
        return q;
      })
    );
    showToast(`Quotation status changed to "${status}".`);
  };

  // --- Handlers: Follow-ups ---
  const handleSaveFollowUp = (followUpData: Omit<FollowUpItem, 'id' | 'createdAt'>, existingId?: string) => {
    const now = new Date().toISOString();
    if (existingId) {
      setFollowUps((prev) =>
        prev.map((f) => {
          if (f.id === existingId) {
            return { ...followUpData, id: existingId, createdAt: f.createdAt };
          }
          return f;
        })
      );
      showToast('Follow-up updated.');
    } else {
      const newFollowUp: FollowUpItem = {
        ...followUpData,
        id: `fu-${Date.now()}`,
        createdAt: now,
      };
      setFollowUps((prev) => [newFollowUp, ...prev]);
      logActivity('followup_scheduled', `Follow-up Scheduled: ${newFollowUp.customerName}`, `Due on ${newFollowUp.scheduledDate} via ${newFollowUp.channel}`);
      showToast(`Follow-up scheduled for ${newFollowUp.scheduledDate}.`);
    }
  };

  const handleToggleFollowUpComplete = (id: string, currentStatus: FollowUpStatus) => {
    const nextStatus: FollowUpStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    setFollowUps((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          if (nextStatus === 'Completed') {
            logActivity('followup_completed', `Follow-up Completed: ${f.customerName}`, f.reason);
          }
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
    showToast(nextStatus === 'Completed' ? 'Follow-up marked completed!' : 'Follow-up marked pending.');
  };

  // --- Cross-Flow Creators ---
  const handleCreateQuoteFromRequest = (request: CustomerRequest) => {
    setRequestForNewQuotation(request);
    setQuotationToEdit(null);
    setIsQuotationModalOpen(true);
  };

  const handleCreateFollowupFromRequest = (request: CustomerRequest, timingDate?: string, actionText?: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);

    const newFollowUpItem: FollowUpItem = {
      id: '',
      customerRequestId: request.id,
      customerName: request.customerName,
      companyName: request.companyName,
      customerPhone: request.phone,
      customerEmail: request.email,
      scheduledDate: timingDate || tomorrow.toISOString().split('T')[0],
      channel: request.preferredContact || 'WhatsApp',
      status: 'Pending',
      reason: actionText || `Follow up on request: ${request.serviceType}`,
      generatedDraft: request.aiAnalysis?.suggestedResponse?.whatsapp,
      createdAt: new Date().toISOString(),
    };

    setFollowUpToEdit(newFollowUpItem);
    setIsFollowUpModalOpen(true);
  };

  const handleCreateFollowupFromQuote = (quote: Quotation) => {
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 3);

    const newFollowUpItem: FollowUpItem = {
      id: '',
      quotationId: quote.id,
      customerName: quote.customerName,
      companyName: quote.companyName,
      customerPhone: quote.customerPhone,
      customerEmail: quote.customerEmail,
      scheduledDate: threeDays.toISOString().split('T')[0],
      channel: 'WhatsApp',
      status: 'Pending',
      reason: `Check status of Quote ${quote.quotationNumber} (${formatFCFA(quote.grandTotal)})`,
      generatedDraft: `Hello ${quote.customerName.split(' ')[0]}, kindly checking in regarding our quotation ${quote.quotationNumber} for ${formatFCFA(quote.grandTotal)}. We have the team ready to commence once confirmed!`,
      createdAt: new Date().toISOString(),
    };

    setFollowUpToEdit(newFollowUpItem);
    setIsFollowUpModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#f7f6f2] text-stone-900 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        requests={requests}
        quotations={quotations}
        followUps={followUps}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        pendingRequestsCount={pendingRequestsCount}
        followUpsDueCount={followUpsDueCount}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          setIsMobileOpen={setIsMobileSidebarOpen}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
          onOpenNewQuote={() => {
            setRequestForNewQuotation(null);
            setQuotationToEdit(null);
            setIsQuotationModalOpen(true);
          }}
          pendingRequestsCount={pendingRequestsCount}
          followUpsDueCount={followUpsDueCount}
          followUpsDueTodayCount={followUpsDueCount}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                requests={requests}
                quotations={quotations}
                followUps={followUps}
                activities={activities}
                onNavigateTab={setCurrentTab}
                onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
                onOpenNewQuotation={() => {
                  setRequestForNewQuotation(null);
                  setQuotationToEdit(null);
                  setIsQuotationModalOpen(true);
                }}
                onSelectRequest={(req) => setSelectedRequestForDetail(req)}
                onSelectQuote={(quote) => {
                  setQuotationToEdit(quote);
                  setIsQuotationModalOpen(true);
                }}
                onToggleFollowUpComplete={handleToggleFollowUpComplete}
              />
            )}

            {currentTab === 'requests' && (
              <CustomerRequestsView
                requests={requests}
                onOpenNewRequest={() => setIsNewRequestModalOpen(true)}
                onSelectRequest={(req) => setSelectedRequestForDetail(req)}
                onCreateQuoteFromRequest={handleCreateQuoteFromRequest}
                onCreateFollowupFromRequest={(req) => handleCreateFollowupFromRequest(req)}
                onUpdateStatus={handleUpdateStatus}
                onSyncServerRequests={syncServerRequests}
              />
            )}

            {currentTab === 'quotations' && (
              <QuotationsView
                quotations={quotations}
                onOpenNewQuote={() => {
                  setRequestForNewQuotation(null);
                  setQuotationToEdit(null);
                  setIsQuotationModalOpen(true);
                }}
                onSelectQuote={(quote) => {
                  setQuotationToEdit(quote);
                  setIsQuotationModalOpen(true);
                }}
                onUpdateQuoteStatus={handleUpdateQuoteStatus}
                onCreateFollowupFromQuote={handleCreateFollowupFromQuote}
              />
            )}

            {currentTab === 'followups' && (
              <FollowUpsView
                followUps={followUps}
                onOpenNewFollowUp={() => {
                  setFollowUpToEdit(null);
                  setIsFollowUpModalOpen(true);
                }}
                onEditFollowUp={(item) => {
                  setFollowUpToEdit(item);
                  setIsFollowUpModalOpen(true);
                }}
                onToggleComplete={handleToggleFollowUpComplete}
              />
            )}

            {currentTab === 'history' && (
              <ActivityHistoryView activities={activities} />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                settings={businessSettings}
                onSaveSettings={(updated) => {
                  setBusinessSettings(updated);
                  showToast('Business details & integrations updated.');
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* --- Global Modals --- */}

      {/* New Customer Request Modal */}
      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSubmit={handleCreateNewRequest}
      />

      {/* Request Detail & AI Assistant Modal */}
      <RequestDetailModal
        request={selectedRequestForDetail}
        onClose={() => setSelectedRequestForDetail(null)}
        onUpdateStatus={handleUpdateStatus}
        onTriggerAiAnalysis={handleTriggerAiAnalysis}
        onCreateQuoteFromRequest={handleCreateQuoteFromRequest}
        onCreateFollowupFromRequest={handleCreateFollowupFromRequest}
        isAiAnalyzing={isAiAnalyzing}
      />

      {/* Quotation Builder & Pro-Forma Preview Modal */}
      <QuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => {
          setIsQuotationModalOpen(false);
          setQuotationToEdit(null);
          setRequestForNewQuotation(null);
        }}
        quotationToEdit={quotationToEdit}
        selectedRequest={requestForNewQuotation}
        requests={requests}
        businessSettings={businessSettings}
        onSaveQuotation={handleSaveQuotation}
      />

      {/* Follow-up Scheduler Modal */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setFollowUpToEdit(null);
        }}
        followUpToEdit={followUpToEdit}
        requests={requests}
        quotations={quotations}
        onSaveFollowUp={handleSaveFollowUp}
      />
    </div>
  );
}
