import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Building2, 
  Sparkles, 
  Edit3, 
  Calendar,
  Check
} from 'lucide-react';
import { FollowUpItem, FollowUpStatus } from '../types';
import { getRelativeTimeStatus, getWhatsAppUrl } from '../utils/formatters';

interface FollowUpsViewProps {
  followUps: FollowUpItem[];
  onOpenNewFollowUp: () => void;
  onEditFollowUp: (item: FollowUpItem) => void;
  onToggleComplete: (id: string, currentStatus: FollowUpStatus) => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  followUps,
  onOpenNewFollowUp,
  onEditFollowUp,
  onToggleComplete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [timeFilter, setTimeFilter] = useState<'all' | 'due' | 'upcoming' | 'completed'>('all');

  const filteredFollowUps = followUps.filter((f) => {
    const matchesSearch =
      f.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;

    let matchesTime = true;
    const { isPast, isToday } = getRelativeTimeStatus(f.scheduledDate);
    if (timeFilter === 'due') {
      matchesTime = (isToday || isPast) && f.status === 'Pending';
    } else if (timeFilter === 'upcoming') {
      matchesTime = !isPast && !isToday && f.status === 'Pending';
    } else if (timeFilter === 'completed') {
      matchesTime = f.status === 'Completed';
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  const dueCount = followUps.filter((f) => {
    const { isPast, isToday } = getRelativeTimeStatus(f.scheduledDate);
    return (isPast || isToday) && f.status === 'Pending';
  }).length;

  const upcomingCount = followUps.filter((f) => {
    const { isPast, isToday } = getRelativeTimeStatus(f.scheduledDate);
    return !isPast && !isToday && f.status === 'Pending';
  }).length;

  return (
    <div id="follow-ups-view-container" className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-stone-900">
              Customer Follow-Up Automation
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {dueCount} Due Now
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Never lose a prospect in Douala or Yaoundé — automated AI messaging, WhatsApp reminders, and closing cadence.
          </p>
        </div>

        <button
          id="followup-schedule-new-btn"
          onClick={onOpenNewFollowUp}
          className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick timing tabs */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({followUps.length})
            </button>
            <button
              onClick={() => setTimeFilter('due')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                timeFilter === 'due' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Due & Overdue ({dueCount})</span>
            </button>
            <button
              onClick={() => setTimeFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeFilter === 'upcoming' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setTimeFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeFilter === 'completed' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Search */}
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search follow-ups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50"
            />
          </div>
        </div>
      </div>

      {/* Follow-ups List */}
      {filteredFollowUps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <CalendarClock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-stone-900">No follow-ups matching criteria</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Keep your sales pipeline active by scheduling follow-up reminders with custom AI messages.
          </p>
          <button
            onClick={onOpenNewFollowUp}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFollowUps.map((item) => {
            const timeInfo = getRelativeTimeStatus(item.scheduledDate);
            const isCompleted = item.status === 'Completed';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-stone-200 opacity-70 bg-stone-50/50'
                    : timeInfo.isPast
                    ? 'border-red-300 bg-red-50/20'
                    : timeInfo.isToday
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-stone-200 hover:border-amber-300'
                }`}
              >
                {/* Left Side: Checkbox, Details & Meta */}
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Completion checkbox button */}
                  <button
                    onClick={() => onToggleComplete(item.id, item.status)}
                    className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 hover:border-emerald-600 text-transparent'
                    }`}
                    title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${isCompleted ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {item.customerName}
                      </span>
                      {item.companyName && (
                        <span className="text-xs text-stone-500 font-medium">
                          ({item.companyName})
                        </span>
                      )}

                      {/* Status indicator tag */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${timeInfo.badgeColor}`}>
                        {timeInfo.label}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200">
                        {item.channel}
                      </span>
                    </div>

                    <p className={`text-xs ${isCompleted ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                      {item.reason}
                    </p>

                    {/* AI Message Preview Box if generated */}
                    {item.generatedDraft && !isCompleted && (
                      <div className="mt-2 p-2.5 rounded-xl bg-stone-900 text-stone-200 text-xs font-mono border border-stone-800 flex items-start gap-2 max-w-2xl">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                            AI Pre-composed Message:
                          </span>
                          <p className="line-clamp-2 text-stone-300">
                            {item.generatedDraft}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Quick Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {item.customerPhone && item.generatedDraft && (
                    <a
                      href={getWhatsAppUrl(item.customerPhone, item.generatedDraft)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                      title="Send AI Message on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => onEditFollowUp(item)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title="Edit follow-up details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
