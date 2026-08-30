/**
 * Utility functions for security, HTML sanitization, and text formatting in CybeNode Forum.
 */

// Escape HTML characters to prevent XSS
export function escapeHTML(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Check for insecure http:// links (blocking plain HTTP as requested)
export function containsInsecureHttp(text: string): boolean {
  if (!text) return false;
  const httpRegex = /\bhttp:\/\/[^\s]+/i;
  return httpRegex.test(text);
}

// Format date nicely in Arabic
export function formatTimeAgo(dateInput: any): string {
  if (!dateInput) return 'الآن';

  let date: Date;

  if (typeof dateInput === 'object' && dateInput !== null && 'toDate' in dateInput && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else {
    return 'الآن';
  }

  if (isNaN(date.getTime())) return 'الآن';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'الآن';
  if (diffInSeconds < 60) return `منذ ${diffInSeconds} ثانية`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes === 1) return 'منذ دقيقة';
  if (diffInMinutes === 2) return 'منذ دقيقتين';
  if (diffInMinutes < 11) return `منذ ${diffInMinutes} دقائق`;
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return 'منذ ساعة';
  if (diffInHours === 2) return 'منذ ساعتين';
  if (diffInHours < 11) return `منذ ${diffInHours} ساعات`;
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'أمس';
  if (diffInDays === 2) return 'منذ يومين';
  if (diffInDays < 7) return `منذ ${diffInDays} أيام`;

  return date.toLocaleDateString('ar-EG', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Generate an avatar placeholder with cyber gradient based on user name
export function getAvatarColor(name: string): string {
  const colors = [
    'from-emerald-500 to-teal-700',
    'from-cyan-500 to-blue-700',
    'from-teal-500 to-emerald-800',
    'from-green-500 to-emerald-700',
    'from-blue-600 to-cyan-700'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
