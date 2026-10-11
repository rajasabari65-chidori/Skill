import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertCircle, Info, AlertTriangle, Trash2, X } from 'lucide-react';

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markNotificationRead, clearAllNotifications, setCurrentRoute } = useApp();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
      <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-slate-100 text-sm">Notifications</h3>
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {notifications.filter((n) => !n.read).length} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
            No notifications right now
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationRead(item.id);
                if (item.actionRoute) {
                  setCurrentRoute(item.actionRoute as any);
                  onClose();
                }
              }}
              className={`p-3.5 transition cursor-pointer hover:bg-slate-800/50 flex gap-3 ${
                !item.read ? 'bg-blue-950/20 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="mt-0.5">
                {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {item.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {item.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
