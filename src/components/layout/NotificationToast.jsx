import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function NotificationToast() {
  const { toasts, removeToast } = usePeerBridge();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-200 bg-white text-slate-800';
        let iconColor = 'text-emerald-600';

        if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-200 bg-white text-slate-800';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-rose-200 bg-white text-slate-800';
          iconColor = 'text-rose-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-brand-200 bg-white text-slate-800';
          iconColor = 'text-brand-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-modal border ${borderClass} transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200`}
            role="alert"
          >
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
