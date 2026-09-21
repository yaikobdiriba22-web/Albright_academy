import React, { useState, useEffect } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Phone,
  Calendar,
  User,
  Reply,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { ContactMessage } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';

interface AdminMessagesViewProps {
  onDataChanged: () => void;
}

export const AdminMessagesView: React.FC<AdminMessagesViewProps> = ({
  onDataChanged,
}) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingMsg, setViewingMsg] = useState<ContactMessage | null>(null);
  const [deletingMsg, setDeletingMsg] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const isUnread = (msg: ContactMessage) => !msg.isRead || msg.status === 'Unread';

  const handleToggleStatus = async (msg: ContactMessage) => {
    const nextStatus = isUnread(msg) ? 'Read' : 'Unread';
    try {
      const updated = await api.updateMessageStatus(msg.id, nextStatus);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? { ...m, isRead: nextStatus === 'Read', status: nextStatus }
            : m
        )
      );
      if (viewingMsg?.id === msg.id) {
        setViewingMsg({ ...viewingMsg, isRead: nextStatus === 'Read', status: nextStatus });
      }
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to update message status.');
    }
  };

  const handleDelete = async () => {
    if (!deletingMsg) return;
    try {
      await api.deleteMessage(deletingMsg.id);
      setMessages((prev) => prev.filter((m) => m.id !== deletingMsg.id));
      if (viewingMsg?.id === deletingMsg.id) {
        setViewingMsg(null);
      }
      setDeletingMsg(null);
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete message.');
    }
  };

  const handleOpenMessage = async (msg: ContactMessage) => {
    setViewingMsg(msg);
    if (isUnread(msg)) {
      try {
        await api.updateMessageStatus(msg.id, 'Read');
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id ? { ...m, isRead: true, status: 'Read' } : m
          )
        );
        setViewingMsg({ ...msg, isRead: true, status: 'Read' });
        onDataChanged();
      } catch (err) {
        // ignore
      }
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2444] font-display">
            Inquiries & Contact Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Messages and parent questions received through the public contact form.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by sender, subject, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading messages...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No inquiries found in inbox.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                  isUnread(msg) ? 'bg-amber-50/40 font-semibold' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(msg);
                    }}
                    className={`mt-1 p-2 rounded-lg cursor-pointer ${
                      isUnread(msg)
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                    title={isUnread(msg) ? 'Mark as Read' : 'Mark as Unread'}
                  >
                    {isUnread(msg) ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <MailOpen className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0f2444] truncate">
                        {msg.name}
                      </span>
                      <span className="text-2xs text-slate-400 truncate">({msg.email})</span>
                      {isUnread(msg) && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-3xs uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm text-slate-800 truncate mt-0.5">
                      {msg.subject}
                    </h4>
                    <p className="text-2xs text-slate-500 line-clamp-1 mt-0.5">{msg.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="text-2xs text-slate-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingMsg(msg);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIEW MESSAGE MODAL */}
      {viewingMsg && (
        <Modal
          isOpen={true}
          onClose={() => setViewingMsg(null)}
          title={`Inquiry from ${viewingMsg.name}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="font-bold text-slate-800 text-sm">{viewingMsg.subject}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sender:</span>
                <span className="text-slate-800 font-semibold">{viewingMsg.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <a
                  href={`mailto:${viewingMsg.email}`}
                  className="text-amber-600 hover:underline font-mono"
                >
                  {viewingMsg.email}
                </a>
              </div>
              {viewingMsg.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-800 font-mono">{viewingMsg.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Received Date:</span>
                <span className="text-slate-600">
                  {new Date(viewingMsg.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Message Content:
              </span>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {viewingMsg.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleToggleStatus(viewingMsg)}
                className="text-xs font-semibold text-slate-600 hover:text-[#0f2444] cursor-pointer"
              >
                Mark as {isUnread(viewingMsg) ? 'Read' : 'Unread'}
              </button>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setViewingMsg(null)}>
                  Close
                </Button>
                <a
                  href={`mailto:${viewingMsg.email}?subject=Re: ${encodeURIComponent(
                    viewingMsg.subject
                  )}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2444] text-amber-400 font-bold text-xs hover:bg-[#16335d] transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION */}
      {deletingMsg && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingMsg(null)}
          title="Delete Contact Inquiry"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Delete message from {deletingMsg.name}?</p>
                <p className="mt-1">"{deletingMsg.subject}" will be deleted from your inbox.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeletingMsg(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
