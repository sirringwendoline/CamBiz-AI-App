import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  CalendarClock, 
  UserPlus, 
  Clock, 
  Building2 
} from 'lucide-react';
import { ActivityLogItem } from '../types';
import { formatDateTime } from '../utils/formatters';

interface ActivityHistoryViewProps {
  activities: ActivityLogItem[];
  onClearHistory?: () => void;
}

export const ActivityHistoryView: React.FC<ActivityHistoryViewProps> = ({
  activities,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || act.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getActivityIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'request_created':
        return <UserPlus className="w-4 h-4 text-emerald-700" />;
      case 'ai_analyzed':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'quotation_generated':
        return <FileText className="w-4 h-4 text-purple-700" />;
      case 'quotation_sent':
        return <FileText className="w-4 h-4 text-blue-700" />;
      case 'quotation_accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'followup_scheduled':
        return <CalendarClock className="w-4 h-4 text-amber-700" />;
      case 'followup_completed':
        return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
      case 'status_changed':
        return <Clock className="w-4 h-4 text-stone-600" />;
      default:
        return <History className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div id="activity-history-view-container" className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-stone-900">
              Activity History & Automation Audit Log
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
              {filteredActivities.length} Events
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Complete timeline of customer requests, AI assistant evaluations, sent pro-formas, and follow-up milestones.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:ring-2 focus:ring-emerald-600 cursor-pointer"
        >
          <option value="ALL">All Event Types</option>
          <option value="request_created">Customer Enquiries</option>
          <option value="ai_analyzed">AI Evaluations</option>
          <option value="quotation_generated">Quotations Created</option>
          <option value="quotation_accepted">Deals Won</option>
          <option value="followup_scheduled">Follow-ups Scheduled</option>
          <option value="followup_completed">Follow-ups Completed</option>
        </select>
      </div>

      {/* Timeline view */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-10">
            <History className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-xs text-stone-500">No activity recorded yet for this filter.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-stone-200 ml-4 space-y-6">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative pl-6 group">
                {/* Timeline Dot */}
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-xl bg-white border-2 border-stone-200 shadow-xs flex items-center justify-center group-hover:border-emerald-600 transition-colors">
                  {getActivityIcon(act.type)}
                </div>

                <div className="bg-stone-50/70 hover:bg-stone-100/70 p-3.5 rounded-xl border border-stone-200/80 transition-colors space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      {act.title}
                    </span>
                    <span className="font-mono text-[10px] text-stone-400">
                      {formatDateTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
