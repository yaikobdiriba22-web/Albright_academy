import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  AlertTriangle,
  Globe,
  FileEdit,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { NewsItem } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { StatusBadge } from '../../components/ui/StatusBadge.tsx';

interface AdminNewsViewProps {
  news: NewsItem[];
  onDataChanged: () => void;
}

export const AdminNewsView: React.FC<AdminNewsViewProps> = ({
  news,
  onDataChanged,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<NewsItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [author, setAuthor] = useState('Albright Academy Administration');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  const openNewForm = () => {
    setEditingItem(null);
    setTitle('');
    setSummary('');
    setContent('');
    setImageUrl('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80');
    setAuthor('Albright Academy Administration');
    setStatus('Published');
    setIsFormOpen(true);
  };

  const openEditForm = (item: NewsItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSummary(item.summary);
    setContent(item.content);
    setImageUrl(item.imageUrl);
    setAuthor(item.author);
    setStatus(item.status);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await api.updateNews(editingItem.id, {
          title,
          summary,
          content,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
          author,
          status,
        });
      } else {
        await api.createNews({
          title,
          summary,
          content,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
          author,
          status,
        });
      }
      setIsFormOpen(false);
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to save news article.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await api.deleteNews(deletingItem.id);
      setDeletingItem(null);
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete news article.');
    }
  };

  const handleToggleStatus = async (item: NewsItem) => {
    const newStatus = item.status === 'Published' ? 'Draft' : 'Published';
    try {
      await api.updateNews(item.id, { status: newStatus });
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to update article status.');
    }
  };

  const filtered = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2444] font-display">
            News & Press Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish school announcements, academic achievements, and curriculum updates.
          </p>
        </div>
        <Button
          id="create-news-btn"
          variant="gold"
          size="sm"
          onClick={openNewForm}
          icon={<Plus className="w-4 h-4" />}
        >
          Create News Article
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
            placeholder="Search news titles and content..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published Only</option>
          <option value="Draft">Drafts Only</option>
        </select>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-2xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Article</th>
                <th className="px-5 py-4">Author</th>
                <th className="px-5 py-4">Published Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    No articles found matching query.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-[#0f2444] text-sm line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-2xs text-slate-500 line-clamp-1 mt-0.5">
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.author}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        title="Click to toggle status"
                        className="cursor-pointer"
                      >
                        <StatusBadge status={item.status} size="sm" />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditForm(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#0f2444] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Article"
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

      {/* CREATE / EDIT MODAL */}
      {isFormOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFormOpen(false)}
          title={editingItem ? 'Edit News Article' : 'Create News Article'}
          size="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Albright Academy Pupils Win Regional STEM Fair"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brief Summary *
              </label>
              <input
                type="text"
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="One or two sentences highlighting the story..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Article Content *
              </label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the complete story text here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author Byline
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white font-medium"
              >
                <option value="Published">Published (Visible on Public Website)</option>
                <option value="Draft">Draft (Saved Privately)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" type="submit" isLoading={isSaving}>
                {editingItem ? 'Save Changes' : 'Publish Article'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deletingItem && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingItem(null)}
          title="Confirm Article Deletion"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Are you sure you want to delete this article?</p>
                <p className="mt-1">
                  "{deletingItem.title}" will be permanently removed from the website.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeletingItem(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Article
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
