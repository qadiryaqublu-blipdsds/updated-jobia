import React, { useEffect } from 'react';
import { AppNotification } from '../../types';
import { Bell, X, ArrowRight, Sparkles, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';

interface LiveNotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
  onOpenCenter: () => void;
}

export const LiveNotificationToast: React.FC<LiveNotificationToastProps> = ({
  notification,
  onClose,
  onOpenCenter,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          {notification.type === 'offer' ? (
            <Sparkles className="w-5 h-5 text-amber-500" />
          ) : notification.type === 'application' ? (
            <Briefcase className="w-5 h-5 text-emerald-600" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">{notification.title}</h4>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">İndi</span>
            <button
              onClick={() => {
                onOpenCenter();
                onClose();
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              Bax <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
