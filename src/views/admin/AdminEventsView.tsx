import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { SchoolEvent, EventStatus } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { StatusBadge } from '../../components/ui/StatusBadge.tsx';

interface AdminEventsViewProps {
  events: SchoolEvent[];
  onDataChanged: () => void;
}

export const AdminEventsView: React.FC<AdminEventsViewProps> = ({
  events,
  onDataChanged,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SchoolEvent | null>(null);
  const [deletingItem, setDeletingItem] = useState<SchoolEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<EventStatus>('Upcoming');

  const openNewForm = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('09:00 AM');
    setEndTime('12:30 PM');
    setLocation('Albright Academy Main Campus');
    setImageUrl('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80');
    setStatus('Upcoming');
    setIsFormOpen(true);
  };

  const openEditForm = (item: SchoolEvent) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setDate(item.date);
    setStartTime(item.startTime);
    setEndTime(item.endTime || '');
    setLocation(item.location);
    setImageUrl(item.imageUrl || '');
    setStatus(item.status);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !startTime || !location) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await api.updateEvent(editingItem.id, {
          title,
          description,
          date,
          startTime,
          endTime,
          location,
          imageUrl,
          status,
        });
      } else {
        await api.createEvent({
          title,
          description,
          date,
          startTime,
          endTime,
          location,
          imageUrl,
          status,
        });
      }
      setIsFormOpen(false);
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to save event.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await api.deleteEvent(deletingItem.id);
      setDeletingItem(null);
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event.');
    }
  };

  const filtered = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2444] font-display">
            Events Calendar Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Schedule academic deadlines, sports days, open house tours, and parent-teacher assemblies.
          </p>
        </div>
        <Button
          id="create-event-btn"
          variant="gold"
          size="sm"
          onClick={openNewForm}
          icon={<Plus className="w-4 h-4" />}
        >
          Schedule New Event
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or location..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
        >
          <option value="All">All Statuses</option>
          <option value="Upcoming">Upcoming Only</option>
          <option value="Completed">Completed Only</option>
          <option value="Cancelled">Cancelled Only</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Event Title</th>
                <th className="px-5 py-4">Scheduled Date</th>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No events found matching the filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <h4 className="font-bold text-[#0f2444] text-sm">{item.title}</h4>
                        <p className="text-2xs text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs font-mono">
                      {item.startTime} {item.endTime ? `- ${item.endTime}` : ''}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.location}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditForm(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#0f2444] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {isFormOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFormOpen(false)}
          title={editingItem ? 'Edit Scheduled Event' : 'Schedule New Event'}
          size="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual STEM & Robotics Expo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the event purpose, attendees, and schedule..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="text"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="e.g. 01:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Auditorium / Sports Field"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white font-medium"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner / Poster Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" type="submit" isLoading={isSaving}>
                {editingItem ? 'Save Event Updates' : 'Add to Calendar'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE EVENT MODAL */}
      {deletingItem && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingItem(null)}
          title="Confirm Event Removal"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Are you sure you want to delete this event?</p>
                <p className="mt-1">
                  "{deletingItem.title}" scheduled on {deletingItem.date} will be removed from the
                  calendar.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeletingItem(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Event
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
