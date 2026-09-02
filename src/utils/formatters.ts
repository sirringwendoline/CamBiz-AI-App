export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 FCFA';
  return new Intl.NumberFormat('fr-CM', {
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateOnly(isoOrDateString: string): string {
  if (!isoOrDateString) return '';
  const date = new Date(isoOrDateString);
  if (isNaN(date.getTime())) return isoOrDateString;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function cleanCameroonPhone(phone: string): string {
  if (!phone) return '';
  // Clean non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  // If starts with 6 or 237
  if (cleaned.startsWith('6') && cleaned.length === 9) {
    cleaned = '237' + cleaned;
  } else if (cleaned.startsWith('+237')) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleanNumber = cleanCameroonPhone(phone);
  const encodedMsg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanNumber}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}

export function getRelativeTimeStatus(dateString: string): {
  isPast: boolean;
  isToday: boolean;
  label: string;
  badgeColor: string;
} {
  if (!dateString) {
    return { isPast: false, isToday: false, label: 'Unscheduled', badgeColor: 'bg-stone-100 text-stone-600 border-stone-200' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const targetDate = new Date(dateString);
  const today = new Date(todayStr);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (dateString === todayStr) {
    return { isPast: false, isToday: true, label: 'Due Today', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' };
  } else if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    return { 
      isPast: true, 
      isToday: false, 
      label: `Overdue by ${absDays}d`, 
      badgeColor: 'bg-red-100 text-red-800 border-red-300' 
    };
  } else if (diffDays === 1) {
    return { isPast: false, isToday: false, label: 'Due Tomorrow', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' };
  } else {
    return { 
      isPast: false, 
      isToday: false, 
      label: `In ${diffDays} days`, 
      badgeColor: 'bg-stone-100 text-stone-700 border-stone-200' 
    };
  }
}
